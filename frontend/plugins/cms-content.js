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
const headings = new Set(['h1', 'h2', 'h3', 'h4']);
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
const nameOf = (node) => { const n = node.openingElement && node.openingElement.name; return n && n.name ? n.name : ''; };
const classOf = (node) => {
  const a = node.openingElement && node.openingElement.attributes.find(x => t.isJSXAttribute(x) && x.name.name === 'className');
  if (!a) return '';
  if (t.isStringLiteral(a.value)) return a.value.value;
  if (t.isJSXExpressionContainer(a.value) && t.isTemplateLiteral(a.value.expression)) return a.value.expression.quasis.map(q => q.value.cooked).join(' ');
  return '';
};
const roleOf = (kind, tag, cls) => {
  if (kind === 'eyebrow' || /(^|\s)eyebrow(\s|$)/.test(cls) || (/uppercase/.test(cls) && /tracking/.test(cls))) return 'eyebrow';
  if (kind === 'title' || kind === 'titleAccent' || headings.has(tag)) return 'heading';
  if (['b', 'strong'].includes(tag)) return 'bold';
  if (['i', 'em'].includes(tag) || /italic/.test(cls)) return 'italic';
  if (tag === 'span' && /text-(brand|gold|forest|sage)/.test(cls)) return 'accent';
  if (kind === 'cta' || ['button', 'a', 'Link'].includes(tag)) return 'button';
  if (kind === 'placeholder' || kind === 'alt' || kind === 'label') return kind;
  if (kind === 'desc' || tag === 'p') return 'paragraph';
  return 'text';
};

function visitor(scope, record, instrument) {
  const handled = new WeakSet();
  const sections = new Map();
  const titleAttr = (node) => { const a = node.openingElement.attributes.find(x => t.isJSXAttribute(x) && x.name.name === 'title' && t.isStringLiteral(x.value)); return a ? a.value.value : ''; };
  const headingOf = (sec) => {
    let label = titleAttr(sec.node);
    if (label) return label;
    sec.traverse({ JSXElement(q) {
      const n = nameOf(q.node);
      if (headings.has(n)) label = q.node.children.filter(c => t.isJSXText(c)).map(c => cleanText(c.value)).join(' ').trim();
      if (!label) label = titleAttr(q.node);
      if (label) q.stop();
    } });
    return label;
  };
  const sectionOf = (p) => {
    const el = p.isJSXElement() ? p : p.findParent(x => x.isJSXElement());
    if (!el) return { section: 0, sectionLabel: '' };
    const chain = [];
    for (let cur = el; cur; cur = cur.parentPath) if (cur.isJSXElement()) chain.push(cur);
    const sec = chain.find(c => nameOf(c.node) === 'section') || chain[chain.length - 2] || chain[chain.length - 1];
    if (!sections.has(sec.node)) sections.set(sec.node, { section: sections.size + 1, sectionLabel: headingOf(sec) });
    return sections.get(sec.node);
  };
  const call = (p, kind, value, fn = '__bvtCopy', extra = []) => {
    const key = keyOf(scope, kind, value);
    if (instrument) record({ key });
    else {
      const el = p.isJSXElement() ? p.node : (p.findParent(x => x.isJSXElement()) || {}).node;
      const tag = el ? nameOf(el) : '';
      record({ key, scope, kind, default: value, tag, role: roleOf(kind, tag, el ? classOf(el) : ''), ...sectionOf(p) });
    }
    return t.callExpression(t.identifier(fn), [t.stringLiteral(key), t.stringLiteral(value), ...extra]);
  };
  return {
    JSXElement(p) {
      // Sentence split by inline elements or expressions becomes one template: "Showing {1} experiences".
      const parts = []; const nodes = []; const texts = []; let letters = false;
      for (const c of p.node.children) {
        if (t.isJSXText(c)) { const v = cleanText(c.value); if (!v) continue; parts.push(v); texts.push(c); if (/[a-zA-Z]/.test(v)) letters = true; }
        else if (t.isJSXExpressionContainer(c)) { if (t.isJSXEmptyExpression(c.expression)) continue; nodes.push(c.expression); parts.push(`{${nodes.length}}`); }
        else { nodes.push(c); parts.push(`{${nodes.length}}`); }
      }
      if (texts.length < 2 || !letters || !nodes.length) return;
      texts.forEach(c => handled.add(c));
      const expression = call(p, 'text', parts.join(''), '__bvtTpl', [t.arrayExpression(nodes)]);
      if (instrument) p.node.children = [t.jsxExpressionContainer(expression)];
    },
    JSXText(p) {
      if (handled.has(p.node)) return;
      const value = cleanText(p.node.value);
      if (!value.trim() || !/[a-zA-Z]/.test(value)) return;
      const expression = call(p, 'text', value);
      if (instrument) { p.replaceWith(t.jsxExpressionContainer(expression)); p.skip(); }
    },
    JSXAttribute(p) {
      if (!attrs.has(p.node.name.name) || !t.isStringLiteral(p.node.value) || !p.node.value.value.trim()) return;
      const expression = call(p, p.node.name.name, p.node.value.value);
      if (instrument) { p.node.value = t.jsxExpressionContainer(expression); p.skip(); }
    },
    AssignmentPattern(p) {
      if (!t.isIdentifier(p.node.left) || !attrs.has(p.node.left.name) || !t.isStringLiteral(p.node.right)) return;
      const expression = call(p, p.node.left.name, p.node.right.value);
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
      const expression = call(p, 'copy', value);
      if (instrument) { p.replaceWith(expression); p.skip(); }
    },
    ObjectProperty(p) {
      // Descriptive labels in local specification tables, never domain records.
      if (!t.isIdentifier(p.node.key) || !['label', 'desc', 'title', 'sub'].includes(p.node.key.name) || !t.isStringLiteral(p.node.value) || !p.getFunctionParent()) return;
      const expression = call(p, 'copy', p.node.value.value);
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
    if (used) p.unshiftContainer('body', t.importDeclaration([t.importSpecifier(t.identifier('__bvtCopy'), t.identifier('cmsText')), t.importSpecifier(t.identifier('__bvtTpl'), t.identifier('cmsTemplate'))], t.stringLiteral('../lib/siteContent')));
  } } };
}
module.exports = plugin;
module.exports.catalog = catalog;
