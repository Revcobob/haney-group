"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Node, mergeAttributes } from "@tiptap/core";
import { useEffect, useRef, useState } from "react";

// Custom block node that round-trips the "What this article covers" callout
// box (.article__keypoints in styles/main.css). Without this, the wrapping
// <div class="article__keypoints"> would be stripped by the default Tiptap
// schema and the formatting would not survive a save. Children are normal
// block content (h2 + list), so the editor remains a familiar surface.
const KeyPointsCallout = Node.create({
  name: "keyPointsCallout",
  group: "block",
  content: "block+",
  defining: true,
  parseHTML() {
    return [{ tag: "div.article__keypoints" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        class: "article__keypoints",
        "aria-labelledby": "article-keypoints-label",
      }),
      0,
    ];
  },
});

const KEYPOINTS_TEMPLATE = `
<div class="article__keypoints" aria-labelledby="article-keypoints-label">
  <h2 id="article-keypoints-label">What this article covers</h2>
  <ul>
    <li><p><strong>Point one.</strong> One short sentence on what the reader will take away.</p></li>
    <li><p><strong>Point two.</strong> Another point worth previewing up front.</p></li>
    <li><p><strong>Point three.</strong> Edit, add, or remove rows as needed.</p></li>
  </ul>
</div>
`;

type Props = {
  name: string;
  defaultHtml?: string;
  placeholder?: string;
};

// Plain-language toolbar buttons that fit the Haney editor chrome.
function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      title={label}
      aria-label={label}
      className={`tiptap__btn${active ? " is-active" : ""}`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;
  return (
    <div className="tiptap__toolbar" role="toolbar" aria-label="Text formatting">
      <div className="tiptap__group">
        <ToolbarButton
          label="Heading 2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          label="Heading 3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          label="Heading 4"
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          active={editor.isActive("heading", { level: 4 })}
        >
          H4
        </ToolbarButton>
        <ToolbarButton
          label="Paragraph"
          onClick={() => editor.chain().focus().setParagraph().run()}
          active={editor.isActive("paragraph")}
        >
          ¶
        </ToolbarButton>
      </div>
      <div className="tiptap__group">
        <ToolbarButton
          label="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          label="Strikethrough"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
        >
          <s>S</s>
        </ToolbarButton>
        <ToolbarButton
          label="Inline code"
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
        >
          <code>{"<>"}</code>
        </ToolbarButton>
        <ToolbarButton
          label="Code block"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
        >
          {"{ }"}
        </ToolbarButton>
      </div>
      <div className="tiptap__group">
        <ToolbarButton
          label="Bullet list"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          • List
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          1. List
        </ToolbarButton>
        <ToolbarButton
          label="Quote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
        >
          “”
        </ToolbarButton>
        <ToolbarButton
          label="Horizontal rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          ―
        </ToolbarButton>
        <ToolbarButton
          label="Key points box (inserts the ‘What this article covers’ callout)"
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertContent(KEYPOINTS_TEMPLATE)
              .run()
          }
        >
          ☷ Key points
        </ToolbarButton>
        <ToolbarButton
          label="Spacer (blank line between sections)"
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertContent("<p>&nbsp;</p>")
              .run()
          }
        >
          ↕ Spacer
        </ToolbarButton>
      </div>
      <div className="tiptap__group">
        <ToolbarButton
          label="Add link"
          active={editor.isActive("link")}
          onClick={() => {
            const previous = editor.getAttributes("link").href as
              | string
              | undefined;
            const url = window.prompt("Link URL", previous ?? "https://");
            if (url === null) return;
            if (url.trim() === "") {
              editor.chain().focus().extendMarkRange("link").unsetLink().run();
              return;
            }
            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: url.trim() })
              .run();
          }}
        >
          🔗 Link
        </ToolbarButton>
        <ToolbarButton
          label="Remove link"
          disabled={!editor.isActive("link")}
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          ✕ Link
        </ToolbarButton>
      </div>
      <div className="tiptap__group">
        <ToolbarButton
          label="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          ↶
        </ToolbarButton>
        <ToolbarButton
          label="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          ↷
        </ToolbarButton>
      </div>
    </div>
  );
}

export function TiptapEditor({ name, defaultHtml, placeholder }: Props) {
  const [html, setHtml] = useState(defaultHtml ?? "");
  const initial = useRef(defaultHtml ?? "");
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        codeBlock: {},
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      KeyPointsCallout,
    ],
    content: initial.current || "",
    editorProps: {
      attributes: {
        class: "tiptap__content",
        spellcheck: "true",
        "aria-label": "Article body",
      },
    },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  useEffect(() => {
    return () => editor?.destroy();
  }, [editor]);

  return (
    <div className="tiptap">
      <Toolbar editor={editor} />
      {!editor || editor.isEmpty ? (
        <div className="tiptap__placeholder" aria-hidden="true">
          {placeholder ?? "Start writing the article…"}
        </div>
      ) : null}
      <EditorContent editor={editor} />
      <p className="tiptap__help">
        Press <kbd>Enter</kbd> for a new paragraph, or{" "}
        <kbd>Shift</kbd>+<kbd>Enter</kbd> for a soft line break (tighter,
        no paragraph gap). Use <strong>Spacer</strong> to add an extra
        blank line between sections, or <strong>Key points</strong> to
        insert the “What this article covers” callout box.
      </p>
      <textarea name={name} value={html} readOnly hidden />
    </div>
  );
}
