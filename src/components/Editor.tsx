import React from 'react';
import MonacoEditor from '@monaco-editor/react';
import '~/styles/editor.css';

interface EditorProps
{
  content: string;
  setContent: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ content, setContent }) =>
{
  return (
    <div className="editor-container">
      <MonacoEditor
        height="50vh"
        defaultLanguage="markdown"
        value={content}
        onChange={(value) => setContent(value || '')}
      />
    </div>
  );
};

export default Editor;
