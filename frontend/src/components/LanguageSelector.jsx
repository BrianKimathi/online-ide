import React from 'react';

const LanguageSelector = ({ value, onChange }) => (
  <div className="flex items-center gap-1 sm:gap-2">
    <label className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
      Language:
    </label>
    <select 
      value={value} 
      onChange={onChange}
      className="px-2 sm:px-3 py-1 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs sm:text-sm"
    >
      <option value="javascript">JavaScript</option>
      <option value="python">Python</option>
      <option value="cpp">C++</option>
      <option value="java">Java</option>
      <option value="c">C</option>
      <option value="csharp">C#</option>
      <option value="php">PHP</option>
      <option value="ruby">Ruby</option>
      <option value="go">Go</option>
      <option value="rust">Rust</option>
      <option value="swift">Swift</option>
      <option value="kotlin">Kotlin</option>
      <option value="typescript">TypeScript</option>
      <option value="html">HTML</option>
      <option value="css">CSS</option>
      <option value="sql">SQL</option>
      <option value="bash">Bash</option>
      <option value="powershell">PowerShell</option>
      <option value="r">R</option>
      <option value="scala">Scala</option>
      <option value="dart">Dart</option>
      <option value="lua">Lua</option>
      <option value="perl">Perl</option>
      <option value="haskell">Haskell</option>
      <option value="elixir">Elixir</option>
      <option value="clojure">Clojure</option>
      <option value="erlang">Erlang</option>
      <option value="fsharp">F#</option>
      <option value="ocaml">OCaml</option>
      <option value="nim">Nim</option>
      <option value="zig">Zig</option>
      <option value="v">V</option>
      <option value="crystal">Crystal</option>
      <option value="julia">Julia</option>
      <option value="d">D</option>
      <option value="ada">Ada</option>
      <option value="fortran">Fortran</option>
      <option value="cobol">COBOL</option>
      <option value="pascal">Pascal</option>
      <option value="basic">BASIC</option>
      <option value="assembly">Assembly</option>
    </select>
  </div>
);

export default LanguageSelector; 