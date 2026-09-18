import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Underline, Heading2, Heading3, List, ListOrdered, Quote, Link2, Unlink, Undo2, Redo2, Minus } from 'lucide-react';

const isEmptyHtml = (html) => !html || html === '<p></p>';

const Btn = ({ onClick, active, disabled, label, children, testId }) => (
  <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={onClick} disabled={disabled} title={label} aria-label={label} data-testid={testId} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30 ${active ? 'bg-forest text-white' : 'text-ink/70 hover:bg-cream-100'}`}>{children}</button>
);

export const RichTextEditor = ({ value, onChange, testId, placeholder = 'Tulis di sini…', minHeight = 180 }) => {
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } } })],
    content: value || '',
    editorProps: { attributes: { class: 'rich-editor', 'data-testid': testId || 'rich-editor', 'data-placeholder': placeholder } },
    onUpdate: ({ editor: ed }) => { const html = ed.getHTML(); onChange(isEmptyHtml(html) ? '' : html); },
  });

  useEffect(() => {
    if (!editor) return;
    if (editor.isFocused) return;
    const current = editor.getHTML();
    if ((value || '') !== current && !(isEmptyHtml(current) && !value)) editor.commands.setContent(value || '', { emitUpdate: false });
  }, [value, editor]);

  if (!editor) return null;
  const setLink = () => {
    const prev = editor.getAttributes('link').href || '';
    const url = window.prompt('Masukkan URL link', prev);
    if (url === null) return;
    if (!url.trim()) return editor.chain().focus().extendMarkRange('link').unsetLink().run();
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
  };
  const c = editor.chain().focus();
  const tools = [
    ['bold', Bold, 'Tebal', () => c.toggleBold().run(), editor.isActive('bold')],
    ['italic', Italic, 'Miring', () => c.toggleItalic().run(), editor.isActive('italic')],
    ['underline', Underline, 'Garis bawah', () => c.toggleUnderline().run(), editor.isActive('underline')],
    null,
    ['h2', Heading2, 'Subjudul', () => c.toggleHeading({ level: 2 }).run(), editor.isActive('heading', { level: 2 })],
    ['h3', Heading3, 'Sub-subjudul', () => c.toggleHeading({ level: 3 }).run(), editor.isActive('heading', { level: 3 })],
    null,
    ['bullet', List, 'Daftar poin', () => c.toggleBulletList().run(), editor.isActive('bulletList')],
    ['ordered', ListOrdered, 'Daftar bernomor', () => c.toggleOrderedList().run(), editor.isActive('orderedList')],
    ['quote', Quote, 'Kutipan', () => c.toggleBlockquote().run(), editor.isActive('blockquote')],
    ['hr', Minus, 'Garis pemisah', () => c.setHorizontalRule().run(), false],
    null,
    ['link', Link2, 'Tambah link', setLink, editor.isActive('link')],
    ['unlink', Unlink, 'Hapus link', () => c.unsetLink().run(), false, !editor.isActive('link')],
    null,
    ['undo', Undo2, 'Undo', () => c.undo().run(), false, !editor.can().undo()],
    ['redo', Redo2, 'Redo', () => c.redo().run(), false, !editor.can().redo()],
  ];
  return (
    <div className="rounded-xl border border-input bg-white overflow-hidden focus-within:ring-2 focus-within:ring-ring/40" data-testid={`${testId || 'rich'}-wrapper`}>
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-ink/8 bg-cream/60" data-testid={`${testId || 'rich'}-toolbar`}>
        {tools.map((t, i) => {
          if (t === null) return <span key={i} className="w-px h-5 bg-ink/10 mx-1" />;
          const [key, I, label, run, active, disabled] = t;
          return <Btn key={key} label={label} onClick={run} active={active} disabled={disabled} testId={`${testId || 'rich'}-${key}`}><I className="w-4 h-4" /></Btn>;
        })}
      </div>
      <EditorContent editor={editor} style={{ '--rich-min': `${minHeight}px` }} />
    </div>
  );
};

export default RichTextEditor;
