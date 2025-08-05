import React, { useEffect, useState } from 'react';
import Editor from '../components/Editor';
import Output from '../components/Output';
import LanguageSelector from '../components/LanguageSelector';
import * as api from '../services/api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

const RunIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v18l15-9-15-9z" /></svg>
);
const SaveIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
);

const IDE = ({ user, logout, isAuthenticated }) => {
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [openFiles, setOpenFiles] = useState([]);
  const [activeFileIdx, setActiveFileIdx] = useState(null);
  const [fileContents, setFileContents] = useState({});
  const [unsaved, setUnsaved] = useState({}); // {fileKey: true/false}
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(''); // '', 'Saving...', 'Saved!'
  const [output, setOutput] = useState('');
  const [outputError, setOutputError] = useState('');
  const [running, setRunning] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);
  const [stdin, setStdin] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');

  const handleTabClick = (idx) => {
    setActiveFileIdx && setActiveFileIdx(idx);
  };

  const handleCloseTab = (idx) => {
    if (!openFiles) return;
    const newFiles = openFiles.filter((_, i) => i !== idx);
    let newActive = null;
    if (newFiles.length > 0) {
      if (activeFileIdx === idx) {
        newActive = idx === 0 ? 0 : idx - 1;
      } else if (activeFileIdx > idx) {
        newActive = activeFileIdx - 1;
      } else {
        newActive = activeFileIdx;
      }
    }
    setOpenFiles && setOpenFiles(newFiles);
    setActiveFileIdx && setActiveFileIdx(newActive);
  };

  // Empty state logic
  const hasProjects = Array.isArray(projects) && projects.length > 0;
  const hasOpenFile = openFiles && openFiles.length > 0 && activeFileIdx !== null && openFiles[activeFileIdx];

  // Get current file key
  let currentFileKey = null;
  if (hasOpenFile) {
    const { project, file } = openFiles[activeFileIdx];
    currentFileKey = `${project.name}|${file}`;
  }

  // Get language for current file
  let currentLanguage = 'javascript';
  if (hasOpenFile) {
    const { project } = openFiles[activeFileIdx];
    currentLanguage = project.language || 'javascript';
  }

  // Save file handler
  const handleSave = async () => {
    if (!hasOpenFile) return;
    setSaving(true); setSaveStatus('Saving...');
    try {
      const { project, file } = openFiles[activeFileIdx];
      const proj = projects.find(p => p.name === project.name);
      if (!proj) throw new Error('Project not found');
      const fileObj = proj.files.find(f => f.name === file);
      if (!fileObj) throw new Error('File not found');
      await api.saveFile({ fileId: fileObj._id, content: fileContents[currentFileKey] || '' });
      setUnsaved(prev => ({ ...prev, [currentFileKey]: false }));
      setSaveStatus('Saved!');
      setTimeout(() => setSaveStatus(''), 1500);
    } catch (err) {
      setSaveStatus('Error saving');
    } finally {
      setSaving(false);
    }
  };

  // Mark file as unsaved on edit
  const handleEditorChange = (value) => {
    if (currentFileKey && setFileContents) {
      setFileContents(prev => ({ ...prev, [currentFileKey]: value }));
      setUnsaved(prev => ({ ...prev, [currentFileKey]: true }));
    }
  };

  // Map language to Piston's expected values
  const getPistonLanguage = (lang) => {
    const map = {
      python: 'python3',
      python3: 'python3',
      js: 'javascript',
      javascript: 'javascript',
      cpp: 'cpp',
      cplusplus: 'cpp',
      java: 'java',
    };
    return map[lang.toLowerCase()] || lang;
  };

  // Run code handler
  const handleRun = async () => {
    if (!hasOpenFile) return;
    setSaveStatus('Running...');
    setRunning(true);
    setOutput('');
    setOutputError('');
    try {
      const code = fileContents[currentFileKey] || '';
      const language = getPistonLanguage(currentLanguage);
      console.log('[RUN] Sending code:', code, 'Language:', language, 'Stdin:', stdin);
      const result = await api.runCode({ code, language, stdin });
      console.log('[RUN] API result:', result);
      setOutput(result.full?.run?.stdout || result.output || '');
      setOutputError(result.full?.run?.stderr || result.stderr || '');
      setSaveStatus('');
    } catch (err) {
      console.error('[RUN] Error:', err);
      setOutput('');
      setOutputError(err.message);
      setSaveStatus('');
    } finally {
      setRunning(false);
    }
  };

  // File open handler
  const handleOpenFile = async (project, fileName) => {
    const idx = openFiles.findIndex(f => f.project.name === project.name && f.file === fileName);
    if (idx === -1) {
      // Find file object
      const proj = projects.find(p => p.name === project.name);
      const fileObj = proj?.files.find(f => f.name === fileName);
      if (fileObj && !fileContents[`${project.name}|${fileName}`]) {
        setLoadingFile(true);
        try {
          const fileData = await api.getFile(fileObj._id);
          setFileContents(prev => ({ ...prev, [`${project.name}|${fileName}`]: fileData.content || '' }));
        } catch (err) {
          setFileContents(prev => ({ ...prev, [`${project.name}|${fileName}`]: '' }));
        } finally {
          setLoadingFile(false);
        }
      }
      setOpenFiles([...openFiles, { project, file: fileName }]);
      setActiveFileIdx(openFiles.length);
    } else {
      setActiveFileIdx(idx);
    }
    setIsSidebarOpen(false); // close drawer on mobile
  };

  // Delete file handler
  const handleDeleteFile = async (project, fileName) => {
    const proj = projects.find(p => p.name === project.name);
    const fileObj = proj?.files.find(f => f.name === fileName);
    if (!fileObj) return;
    await api.deleteFile(fileObj._id);
    // Remove from openFiles and fileContents
    setOpenFiles(openFiles.filter(f => !(f.project.name === project.name && f.file === fileName)));
    setFileContents(prev => {
      const newContents = { ...prev };
      delete newContents[`${project.name}|${fileName}`];
      return newContents;
    });
    refreshProjects();
  };

  // Delete project handler
  const handleDeleteProject = async (projectId) => {
    await api.deleteProject(projectId);
    // Remove all open files from this project
    setOpenFiles(openFiles.filter(f => f.project._id !== projectId));
    setFileContents(prev => {
      const newContents = { ...prev };
      openFiles.forEach(f => {
        if (f.project._id === projectId) delete newContents[`${f.project.name}|${f.file}`];
      });
      return newContents;
    });
    refreshProjects();
  };

  // Fetch projects from backend
  const refreshProjects = async () => {
    setLoadingProjects(true);
    setError(null);
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    refreshProjects();
  }, []);

  return (
    <div className="flex flex-col h-full w-full max-w-full">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isAuthenticated={isAuthenticated}
        user={user}
        logout={logout}
      />
      <div className="flex flex-col md:flex-row flex-1 w-full max-w-full">
        <Sidebar
          projects={projects}
          refreshProjects={refreshProjects}
          openFiles={openFiles}
          setOpenFiles={setOpenFiles}
          activeFileIdx={activeFileIdx}
          setActiveFileIdx={setActiveFileIdx}
          onOpenFile={handleOpenFile}
          onDeleteFile={handleDeleteFile}
          onDeleteProject={handleDeleteProject}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          loadingProjects={loadingProjects}
        />
        <div className="flex-1 flex flex-col min-h-[50vh] sm:min-h-[60vh] w-full max-w-full">
          {/* Enhanced Header with Language Selector and Controls */}
          {hasOpenFile && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700 px-2 sm:px-4 py-2 sm:py-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                {/* Tabs */}
                <div className="flex-1 flex items-center overflow-x-auto scrollbar-hide min-w-0">
                  {openFiles && openFiles.map((f, idx) => (
                    <div
                      key={f.project.name + f.file}
                      className={`flex items-center px-2 sm:px-4 py-1 sm:py-2 mx-1 rounded-t-lg cursor-pointer border transition-all duration-200 flex-shrink-0 ${
                        idx === activeFileIdx 
                          ? 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-blue-700 dark:text-blue-300 font-semibold shadow-sm' 
                          : 'bg-gray-200 dark:bg-gray-700 border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                      onClick={() => handleTabClick(idx)}
                      title={f.file}
                    >
                      <span className="truncate max-w-[80px] sm:max-w-[120px] text-xs sm:text-sm">{f.file}</span>
                      {unsaved[`${f.project.name}|${f.file}`] && (
                        <span className="ml-1 sm:ml-2 text-red-500 text-xs">●</span>
                      )}
                      <button
                        className="ml-1 sm:ml-2 text-gray-400 hover:text-red-500 transition-colors text-sm"
                        onClick={e => { e.stopPropagation(); handleCloseTab(idx); }}
                        title="Close tab"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* Language Selector and Controls */}
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <LanguageSelector 
                    value={selectedLanguage} 
                    onChange={(e) => setSelectedLanguage(e.target.value)} 
                  />
                  
                  {/* Save button */}
                  <button
                    className="px-2 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center gap-1 sm:gap-2 shadow-lg disabled:opacity-50 text-xs sm:text-sm"
                    onClick={handleSave}
                    disabled={saving || !unsaved[currentFileKey]}
                  >
                    <SaveIcon />
                    <span className="hidden xs:inline">Save</span>
                    {saving && <LoadingSpinner size={3} className="ml-1" />}
                  </button>
                  
                  {/* Run button */}
                  <button
                    className="px-2 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-1 sm:gap-2 shadow-lg disabled:opacity-50 text-xs sm:text-sm"
                    onClick={handleRun}
                    disabled={running}
                  >
                    <RunIcon />
                    <span className="hidden xs:inline">Run</span>
                    {running && <LoadingSpinner size={3} className="ml-1" />}
                  </button>
                </div>
              </div>
              
              {/* Save status */}
              {saveStatus && (
                <div className="mt-2 text-center">
                  <span className="text-xs text-gray-500 dark:text-gray-300 bg-white/80 dark:bg-gray-900/80 px-3 py-1 rounded-full shadow">
                    {saveStatus}
                  </span>
                </div>
              )}
            </div>
          )}
          {/* Editor, Input, and Output stacked vertically */}
          {!hasProjects ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <p className="text-lg font-semibold">Create a new project to get started.</p>
            </div>
          ) : hasOpenFile ? (
            <>
              <div className="flex-1 flex flex-col min-h-0">
                {loadingFile ? (
                  <LoadingSpinner className="mt-8" />
                ) : (
                  <Editor value={fileContents && currentFileKey ? fileContents[currentFileKey] || '' : ''} onChange={handleEditorChange} language={selectedLanguage} />
                )}
              </div>
              {/* Enhanced Input Section */}
              <div className="w-full max-w-full px-2 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-t border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                    Program Input (stdin):
                  </label>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded self-start sm:self-auto">
                    Interactive
                  </span>
                </div>
                <textarea
                  className="w-full p-2 sm:p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono resize-y min-h-[50px] sm:min-h-[60px] max-h-[120px] sm:max-h-[150px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs sm:text-sm"
                  value={stdin}
                  onChange={e => setStdin(e.target.value)}
                  placeholder="Type input for your program here... (e.g., numbers, text, etc.)"
                />
              </div>
              <div className="w-full max-w-full">
                <Output output={output} error={outputError} />
              </div>
            </>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </div>
    </div>
  );
};

export default IDE; 