"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
// import { htmlToPlainText } from "@/utils/htmlToPlainText";

const TiptapEditor = ({
  onUpdate,
}: {
  onUpdate: (content: string) => void;
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Start typing...</p>",
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
      // const html = editor.getHTML();
      // const plainText = htmlToPlainText(html);
      // onUpdate(html, plainText);
    },
  });

  return <EditorContent editor={editor} />;
};

export default TiptapEditor;
