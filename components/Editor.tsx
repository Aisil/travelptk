"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Bold, Italic, List, ListOrdered, Heading2, Heading3, ImageIcon } from 'lucide-react';
import { useState } from 'react';

const MenuBar = ({ editor }: { editor: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ }) => {
  if (!editor) return null;

  const addImage = async () => {
    const url = window.prompt('URL of the image:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        editor.chain().focus().setImage({ src: data.url }).run();
      }
    } catch (error) {
      console.error('Error uploading image', error);
      alert('Upload failed');
    }
  };

  return (
    <div className="border-b border-gray-200 p-2 flex flex-wrap gap-2 items-center bg-gray-50 rounded-t-lg">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-200 \${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
      >
        <Bold size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-200 \${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
      >
        <Italic size={18} />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-200 font-bold \${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded hover:bg-gray-200 font-bold \${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}`}
      >
        H3
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-200 \${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
      >
        <List size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-200 \${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
      >
        <ListOrdered size={18} />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <div className="relative">
        <label className="cursor-pointer p-2 rounded hover:bg-gray-200 flex items-center gap-1 text-sm font-medium text-gray-700">
          <ImageIcon size={18} />
          <span>Upload Image</span>
          <input type="file" className="hidden" accept="image/*" onChange={uploadImage} />
        </label>
      </div>
    </div>
  );
};

export default function Editor({ content, onChange }: { content: string, onChange: (content: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto shadow-md my-4',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all bg-white">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
