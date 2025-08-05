require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const fetch = require('node-fetch');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/project');
const fileRoutes = require('./routes/file');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/files', fileRoutes);

let pistonRuntimes = [];
let lastFetched = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

async function fetchPistonRuntimes() {
  const now = Date.now();
  if (pistonRuntimes.length && now - lastFetched < CACHE_DURATION) return pistonRuntimes;
  try {
    const res = await fetch('https://emkc.org/api/v2/piston/runtimes');
    const data = await res.json();
    pistonRuntimes = data;
    lastFetched = now;
    return data;
  } catch (err) {
    console.error('[PISTON] Failed to fetch runtimes:', err);
    return pistonRuntimes;
  }
}

// Endpoint to get supported languages/versions
app.get('/api/languages', async (req, res) => {
  const runtimes = await fetchPistonRuntimes();
  res.json(runtimes);
});

// Code execution endpoint using Piston API
app.post('/api/execute', async (req, res) => {
  let { code, language, stdin } = req.body;
  if (!code || !language) return res.status(400).json({ message: 'Code and language required' });

  // Map language to Piston's expected values and aliases
  const langMap = {
    python: 'python',
    python3: 'python',
    py: 'python',
    js: 'javascript',
    javascript: 'javascript',
    cpp: 'c++',
    cplusplus: 'c++',
    cxx: 'c++',
    java: 'java',
  };
  language = langMap[language.toLowerCase()] || language;

  // Get latest version for language (match aliases)
  const runtimes = await fetchPistonRuntimes();
  let runtime = runtimes.find(r => r.language === language || (r.aliases && r.aliases.includes(language)));
  if (!runtime) {
    // fallback: try to match by partial
    runtime = runtimes.find(r => r.language.includes(language));
  }
  const version = runtime ? runtime.version : '*';

  // Map language to filename extension
  const extMap = {
    python: 'py',
    javascript: 'js',
    'c++': 'cpp',
    java: 'java',
  };
  const ext = extMap[language] || 'txt';
  const filename = `main.${ext}`;

  console.log('[EXECUTE] Language:', language, 'Version:', version, 'Filename:', filename, '\nCode:', code, '\nStdin:', stdin);
  try {
    const body = {
      language: runtime ? runtime.language : language,
      version,
      files: [{ name: filename, content: code }],
    };
    if (stdin !== undefined) body.stdin = stdin;
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    console.log('[EXECUTE] Piston response:', data);
    // Use run.stdout and run.stderr if available
    const output = data.run?.stdout ?? data.output ?? '';
    const stderr = data.run?.stderr ?? data.stderr ?? '';
    res.json({ output, stderr, code: data.run?.code ?? data.code, full: data });
  } catch (err) {
    console.error('[EXECUTE] Error:', err);
    res.status(500).json({ message: 'Execution failed', error: err.message });
  }
});



app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
