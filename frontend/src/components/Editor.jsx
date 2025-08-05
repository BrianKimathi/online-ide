import React from 'react';
import MonacoEditor from '@monaco-editor/react';
import * as api from '../services/api';

  const Editor = ({ value = '', onChange, language = 'javascript' }) => {
  return (
    <div className="flex-1 bg-gray-900 rounded-lg p-2 sm:p-4 flex flex-col min-h-0 shadow-lg border border-gray-700">
      <MonacoEditor
        height="100%"
        width="100%"
        theme="vs-dark"
        language={language}
        value={value}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          automaticLayout: true,
          formatOnType: true,
          formatOnPaste: true,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible'
          },
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
        }}
        onChange={onChange}
      />
    </div>
  );
};

export default Editor; 