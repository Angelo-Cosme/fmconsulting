import { useRef, useState, type ReactNode } from "react";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { Placeholder } from "@tiptap/extensions";
import { imageUrl, type ImageRef, type RichDoc } from "@/lib/news";
import { parseYouTubeId } from "@/lib/youtube";
import { uploadImage } from "./supabase";

/**
 * Image stockée dans Supabase : on enregistre path / widths / ext (pas d'URL absolue),
 * l'URL d'affichage est recalculée au rendu. Les <img> collées depuis l'extérieur sont ignorées.
 */
const StoredImage = Image.extend({
  draggable: true,
  parseHTML() {
    return [{ tag: "img[data-path]" }];
  },
  addAttributes() {
    const hidden = { renderHTML: () => ({}) };
    return {
      src: { default: null, ...hidden },
      alt: { default: "" },
      title: { default: null, ...hidden },
      path: {
        default: null,
        parseHTML: (el) => el.getAttribute("data-path"),
        renderHTML: (attrs) => {
          const widths: number[] = attrs.widths ?? [];
          const w = widths.find((x) => x >= 960) ?? widths[widths.length - 1];
          return attrs.path && w ? { "data-path": attrs.path, src: imageUrl(attrs.path, w, attrs.ext) } : {};
        },
      },
      width: { default: null },
      height: { default: null },
      widths: { default: [], ...hidden },
      ext: { default: "webp", ...hidden },
    };
  },
});

const extensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    code: false,
    codeBlock: false,
    link: {
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
      HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
    },
  }),
  StoredImage,
  Youtube.configure({ nocookie: true, addPasteHandler: true, modestBranding: true }),
  Placeholder.configure({ placeholder: "Rédigez votre article…" }),
];

export default function RichEditor({ initial, onChange }: { initial: RichDoc; onChange: (doc: RichDoc) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const editorRef = useRef<Editor | null>(null);

  /** Insère l'image à `pos`, ou après la sélection courante (sans jamais la remplacer). */
  async function insertImage(file: File, pos?: number) {
    const editor = editorRef.current;
    if (!editor || !file.type.startsWith("image/")) return;
    setUploading(true);
    setError("");
    try {
      const image: ImageRef = await uploadImage(file);
      const node = { type: "image", attrs: { ...image } };
      editor.chain().focus().insertContentAt(pos ?? editor.state.selection.to, node).run();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  const editor = useEditor({
    extensions,
    content: initial,
    immediatelyRender: true,
    editorProps: {
      attributes: { class: "rich-text min-h-[50vh] outline-none", "aria-label": "Contenu de l'article" },
      handleDrop: (view, event, _slice, moved) => {
        const file = event.dataTransfer?.files?.[0];
        if (moved || !file?.type.startsWith("image/")) return false;
        event.preventDefault();
        const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
        insertImage(file, pos);
        return true;
      },
      handlePaste: (_view, event) => {
        const file = Array.from(event.clipboardData?.files ?? []).find((f) => f.type.startsWith("image/"));
        if (!file) return false;
        event.preventDefault();
        insertImage(file);
        return true;
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getJSON() as RichDoc),
  });
  editorRef.current = editor;

  return (
    <div className="card">
      <Toolbar editor={editor} uploading={uploading} onPickImage={(file) => insertImage(file)} />
      {error && <p className="border-b border-line bg-red-50 px-6 py-2 text-sm text-red-700">{error}</p>}
      <div className="px-6 py-8 md:px-10">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function Toolbar({ editor, uploading, onPickImage }: { editor: Editor; uploading: boolean; onPickImage: (file: File) => void }) {
  const file = useRef<HTMLInputElement>(null);
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      strike: e.isActive("strike"),
      link: e.isActive("link"),
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      quote: e.isActive("blockquote"),
      image: e.isActive("image"),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });

  const chain = () => editor.chain().focus();

  function setLink() {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Adresse du lien (laisser vide pour retirer le lien)", previous ?? "https://");
    if (url === null) return;
    if (url.trim() === "" || url.trim() === "https://") return chain().extendMarkRange("link").unsetLink().run();
    chain().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }

  function addVideo() {
    const url = window.prompt("Lien de la vidéo YouTube (youtube.com/watch?v=…, youtu.be/…, shorts…)");
    if (!url) return;
    const id = parseYouTubeId(url);
    if (!id) return window.alert("Lien YouTube non reconnu.");
    // Insère après la sélection (ne remplace jamais une image ou un texte sélectionné).
    chain()
      .insertContentAt(editor.state.selection.to, { type: "youtube", attrs: { src: `https://www.youtube.com/watch?v=${id}` } })
      .run();
  }

  function setAlt() {
    const current = (editor.getAttributes("image").alt as string) ?? "";
    const alt = window.prompt("Description de l'image (affichée en légende et lue par les lecteurs d'écran)", current);
    if (alt !== null) chain().updateAttributes("image", { alt: alt.trim() }).run();
  }

  return (
    <div className="sticky top-16 z-10 flex flex-wrap items-center gap-0.5 rounded-t-2xl border-b border-line bg-white/95 px-3 py-2 backdrop-blur">
      <Btn label="Paragraphe" active={!s.h2 && !s.h3 && !s.quote} onClick={() => chain().setParagraph().run()}>¶</Btn>
      <Btn label="Titre de section" active={s.h2} onClick={() => chain().toggleHeading({ level: 2 }).run()}>H2</Btn>
      <Btn label="Sous-titre" active={s.h3} onClick={() => chain().toggleHeading({ level: 3 }).run()}>H3</Btn>
      <Sep />
      <Btn label="Gras (⌘B)" active={s.bold} onClick={() => chain().toggleBold().run()}><b>B</b></Btn>
      <Btn label="Italique (⌘I)" active={s.italic} onClick={() => chain().toggleItalic().run()}><i className="font-serif">I</i></Btn>
      <Btn label="Souligné (⌘U)" active={s.underline} onClick={() => chain().toggleUnderline().run()}><u>U</u></Btn>
      <Btn label="Barré" active={s.strike} onClick={() => chain().toggleStrike().run()}><s>S</s></Btn>
      <Btn label="Lien" active={s.link} onClick={setLink}>
        <Icon d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" />
      </Btn>
      <Sep />
      <Btn label="Liste à puces" active={s.bullet} onClick={() => chain().toggleBulletList().run()}>
        <Icon d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" />
      </Btn>
      <Btn label="Liste numérotée" active={s.ordered} onClick={() => chain().toggleOrderedList().run()}>
        <Icon d="M10 6h10M10 12h10M10 18h10M4 5h1v4M4 9h2M4 14.5c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5c0 1.5-3 2-3 3.5h3" />
      </Btn>
      <Btn label="Citation" active={s.quote} onClick={() => chain().toggleBlockquote().run()}>
        <span className="font-serif text-lg leading-none">“</span>
      </Btn>
      <Btn label="Séparateur" onClick={() => chain().setHorizontalRule().run()}>
        <Icon d="M4 12h16" />
      </Btn>
      <Sep />
      <input ref={file} type="file" accept="image/*" className="hidden" onChange={(e) => {
        const f = e.target.files?.[0];
        if (f) onPickImage(f);
        e.target.value = "";
      }} />
      <Btn label="Insérer une image" disabled={uploading} onClick={() => file.current?.click()}>
        {uploading ? <span className="text-xs">Envoi…</span> : <Icon d="M4 5h16v14H4zM4 15l4-4 4 4 3-3 5 5M15 9h.01" />}
      </Btn>
      <Btn label="Insérer une vidéo YouTube" onClick={addVideo}>
        <Icon d="M3 7.5C3 6 4 5 5.5 5h13C20 5 21 6 21 7.5v9c0 1.5-1 2.5-2.5 2.5h-13C4 19 3 18 3 16.5zM10 9.5v5l4.5-2.5z" />
      </Btn>
      {s.image && (
        <button type="button" onClick={setAlt} className="ml-1 cursor-pointer rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-600">
          Description de l'image
        </button>
      )}
      <div className="ml-auto flex">
        <Btn label="Annuler (⌘Z)" disabled={!s.canUndo} onClick={() => chain().undo().run()}>
          <Icon d="M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3" />
        </Btn>
        <Btn label="Rétablir (⇧⌘Z)" disabled={!s.canRedo} onClick={() => chain().redo().run()}>
          <Icon d="m15 14 5-5-5-5M20 9H10a6 6 0 0 0 0 12h3" />
        </Btn>
      </div>
    </div>
  );
}

function Btn({ label, active = false, disabled = false, onClick, children }: { label: string; active?: boolean; disabled?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-lg px-2 text-sm transition-colors disabled:cursor-default disabled:opacity-30 ${
        active ? "bg-ink text-white" : "text-ink-soft hover:bg-mist"
      }`}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <span aria-hidden="true" className="mx-1 h-5 w-px bg-line" />;
}

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
      <path d={d} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
