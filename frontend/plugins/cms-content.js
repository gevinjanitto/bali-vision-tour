/* Compile-time copy catalogue: no DOM rewriting and no unsafe HTML rendering.
 * Stable IDs are based on page + original copy, not line numbers.
 * The same visitor extracts the admin catalogue and instruments public JSX.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const attrs = new Set(['title', 'titleAccent', 'desc', 'eyebrow', 'placeholder', 'alt', 'cta', 'label']);
const shared = new Set(['Layout', 'Navbar', 'Cards', 'BookingDialog']);
const scopeOf = (file) => {
  const name = path.basename(file, '.jsx');
  return file.includes(`${path.sep}pages${path.sep}`) || shared.has(name) ? name : null;
};
const keyOf = (scope, kind, value) => `${scope}-${kind}-${crypto.createHash('sha1').update(value).digest('hex').slice(0, 12)}`;
const cleanText = (value) => value.split(/\r?\n/).map((line, i, arr) => {
  let out = line.replace(/\t/g, ' ');
  if (i) out = out.replace(/^ +/, '');
  if (i < arr.length - 1) out = out.replace(/ +$/, '');
  return out;
}).filter(Boolean).join(' ');

function visitor(scope, record, instrument) {
  const call = (kind, value) => {
    const key = keyOf(scope, kind, value);
    record({ key, scope, kind, default: value });
    return t.callExpression(t.identifier('__bvtCopy'), [t.stringLiteral(key), t.stringLiteral(value)]);
  };
  return {
    JSXText(p) {
      const value = cleanText(p.node.value);
      if (!value.trim()) return;
      const expression = call('text', value);
      if (instrument) { p.replaceWith(t.jsxExpressionContainer(expression)); p.skip(); }
    },
    JSXAttribute(p) {
      if (!attrs.has(p.node.name.name) || !t.isStringLiteral(p.node.value) || !p.node.value.value.trim()) return;
      const expression = call(p.node.name.name, p.node.value.value);
      if (instrument) { p.node.value = t.jsxExpressionContainer(expression); p.skip(); }
    },
    AssignmentPattern(p) {
      if (!t.isIdentifier(p.node.left) || !attrs.has(p.node.left.name) || !t.isStringLiteral(p.node.right)) return;
      const expression = call(p.node.left.name, p.node.right.value);
      if (instrument) { p.node.right = expression; p.skip(); }
    },
    StringLiteral(p) {
      // Only descriptive phrases inside inline display arrays; never filter values,
      // routes, style tokens, comparisons, or option lists that drive business logic.
      if (!p.parentPath.isArrayExpression() || !p.findParent(x => x.isJSXExpressionContainer())) return;
      const value = p.node.value;
      if (!/[a-zA-Z].*\s.*[a-zA-Z]/.test(value) || /(?:bg-|text-|h-|w-|mt-|px-|py-|\/[a-z]|https?:)/.test(value)) return;
      const container = p.findParent(x => x.isJSXExpressionContainer());
      let optionList = false;
      container.traverse({ JSXOpeningElement(q) { if (['SelectItem', 'Select', 'SearchField', 'FilterSelect'].includes(q.node.name.name)) optionList = true; } });
      if (optionList) return;
      const expression = call('copy', value);
      if (instrument) { p.replaceWith(expression); p.skip(); }
    },
    ObjectProperty(p) {
      // Descriptive labels in local specification tables, never domain records.
      if (!t.isIdentifier(p.node.key) || !['label', 'desc', 'title', 'sub'].includes(p.node.key.name) || !t.isStringLiteral(p.node.value) || !p.getFunctionParent()) return;
      const expression = call('copy', p.node.value.value);
      if (instrument) { p.node.value = expression; p.skip(); }
    },
  };
}

function catalog(root) {
  const entries = new Map();
  for (const dir of ['pages', 'components']) {
    for (const name of fs.readdirSync(path.join(root, dir))) {
      if (!name.endsWith('.jsx')) continue;
      const file = path.join(root, dir, name);
      const scope = scopeOf(file);
      if (!scope) continue;
      const ast = parser.parse(fs.readFileSync(file, 'utf8'), { sourceType: 'module', plugins: ['jsx'] });
      traverse(ast, visitor(scope, item => entries.set(item.key, item), false));
    }
  }
  return [...entries.values()];
}

function plugin() {
  return { visitor: { Program(p, state) {
    const scope = scopeOf(state.filename || '');
    if (!scope) return;
    let used = false;
    p.traverse(visitor(scope, () => { used = true; }, true));
    if (used) p.unshiftContainer('body', t.importDeclaration([t.importSpecifier(t.identifier('__bvtCopy'), t.identifier('cmsText'))], t.stringLiteral('../lib/siteContent')));
  } } };
}
module.exports = plugin;
module.exports.catalog = catalog;