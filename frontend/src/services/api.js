const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function register({ username, email, password }) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Registration failed');
  return res.json();
}

export async function login({ email, password }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Login failed');
  const data = await res.json();
  localStorage.setItem('token', data.token);
  return data;
}

export function logout() {
  localStorage.removeItem('token');
}

export function getToken() {
  return localStorage.getItem('token');
}

export async function getProjects() {
  const token = getToken();
  const res = await fetch(`${API_URL}/projects`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to fetch projects');
  return res.json();
}

export async function createProject({ name, language }) {
  const token = getToken();
  const res = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ name, language })
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to create project');
  return res.json();
}

export async function getMe() {
  const token = getToken();
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to fetch user');
  return res.json();
}

export async function createFile({ projectId, name, content = '' }) {
  const token = getToken();
  const res = await fetch(`${API_URL}/files`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ projectId, name, content })
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to create file');
  return res.json();
}

export async function saveFile({ fileId, content }) {
  const token = getToken();
  const res = await fetch(`${API_URL}/files/${fileId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ content })
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to save file');
  return res.json();
}

export async function runCode({ code, language, stdin }) {
  const body = { code, language };
  if (stdin !== undefined) body.stdin = stdin;
  const res = await fetch(`${API_URL}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to execute code');
  return res.json();
}

export async function getFile(fileId) {
  const token = getToken();
  const res = await fetch(`${API_URL}/files/${fileId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to fetch file');
  return res.json();
}

export async function deleteFile(fileId) {
  const token = getToken();
  const res = await fetch(`${API_URL}/files/${fileId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to delete file');
  return res.json();
}

export async function deleteProject(projectId) {
  const token = getToken();
  const res = await fetch(`${API_URL}/projects/${projectId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to delete project');
  return res.json();
}

export async function aiComplete({ prompt, max_tokens = 64 }) {
  const res = await fetch(`${API_URL}/ai/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, max_tokens })
  });
  if (!res.ok) throw new Error((await res.json()).message || 'AI completion failed');
  return res.json();
}