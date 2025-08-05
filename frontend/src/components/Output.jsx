import React from 'react';

const Output = ({ output = '', error = '' }) => (
  <div className="w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden min-h-[100px] sm:min-h-[120px] flex flex-col">
    <div className="px-2 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-600 text-xs sm:text-sm font-semibold text-gray-200 flex items-center">
      <div className="flex items-center gap-1 sm:gap-2">
        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
      </div>
      <span className="ml-2 sm:ml-3">Output Terminal</span>
      <span className="ml-auto text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">Ready</span>
    </div>
    <div className="flex-1 p-2 sm:p-4 bg-gray-900">
      <pre className="text-xs sm:text-sm font-mono whitespace-pre-wrap min-h-[60px] sm:min-h-[80px] max-h-[40vh] sm:max-h-[50vh] overflow-auto text-gray-100 leading-relaxed">
        {error && (
          <div className="text-red-400 mb-2">
            <span className="text-red-500 font-bold">Error:</span> {error}
          </div>
        )}
        {output && (
          <div className="text-green-400">
            <span className="text-green-500 font-bold">Output:</span> {output}
          </div>
        )}
        {!output && !error && (
          <div className="text-gray-500 italic">
            // Your program output will appear here...
          </div>
        )}
      </pre>
    </div>
  </div>
);

export default Output; 