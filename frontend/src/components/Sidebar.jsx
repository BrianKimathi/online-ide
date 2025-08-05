import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import * as api from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const FolderIcon = () => (
  <svg className="w-5 h-5 text-yellow-500 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h3.172a2 2 0 011.414.586l1.828 1.828A2 2 0 0012.828 8H19a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" /></svg>
);
const FileIcon = () => (
  <svg className="w-4 h-4 text-blue-500 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16V4a2 2 0 012-2h8a2 2 0 012 2v12M4 16l4 4m0 0l4-4m-4 4V4" /></svg>
);
const ChevronDown = () => (
  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
);
const ChevronRight = () => (
  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
);
const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
);

const Sidebar = ({ projects = [], refreshProjects, onOpenFile, onDeleteFile, onDeleteProject, openFiles, activeFileIdx, isSidebarOpen, setIsSidebarOpen, loadingProjects }) => {
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectLang, setNewProjectLang] = useState('javascript');
  const [expanded, setExpanded] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);
  const [newFileName, setNewFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Prevent background scroll when sidebar drawer is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isSidebarOpen]);

  const addProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    setLoading(true); setError(null);
    try {
      await api.createProject({ name: newProjectName, language: newProjectLang });
      setShowProjectModal(false);
      setNewProjectName('');
      setNewProjectLang('javascript');
      refreshProjects && refreshProjects();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addFile = async (e) => {
    e.preventDefault();
    if (!newFileName.trim() || selectedProject === null) return;
    setLoading(true); setError(null);
    try {
      await api.createFile({ projectId: projects[selectedProject]._id, name: newFileName });
      setShowFileModal(false);
      setNewFileName('');
      refreshProjects && refreshProjects();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (idx) => {
    setExpanded({ ...expanded, [idx]: !expanded[idx] });
  };

  // Sidebar content
  const sidebarContent = (
            <div className="w-64 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col h-full shadow-lg">
          {/* Close button for mobile */}
          <button
            className="md:hidden mb-4 ml-auto p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            aria-label="Close sidebar"
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Code Editor</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Create and manage your projects</p>
          </div>
          
          <button
            className="mb-6 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            onClick={() => setShowProjectModal(true)}
          >
            <PlusIcon /> New Project
          </button>
          
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-lg">Projects</h3>
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{projects.length}</span>
            </div>
          </div>
      <ul className="space-y-2 flex-1 overflow-y-auto">
        {projects.length === 0 && (
          <li className="text-gray-400 text-sm">No projects yet. Create one!</li>
        )}
        {projects.map((p, i) => (
          <li key={i} className="mb-3">
            <div 
              className="flex items-center cursor-pointer group p-3 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm hover:shadow-md" 
              onClick={() => toggleExpand(i)}
            >
              <span className="mr-2 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                {expanded[i] ? <ChevronDown /> : <ChevronRight />}
              </span>
              <FolderIcon />
              <div className="flex-1 min-w-0">
                <span
                  className="font-semibold text-gray-800 dark:text-gray-100 truncate block"
                  title={p.name}
                >
                  {p.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{p.language}</span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="p-1.5 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 transition-colors"
                  onClick={e => { e.stopPropagation(); setSelectedProject(i); setShowFileModal(true); }}
                  title="Add file"
                >
                  <PlusIcon />
                </button>
                <button
                  className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 transition-colors"
                  onClick={e => { e.stopPropagation(); onDeleteProject && onDeleteProject(p._id); }}
                  title="Delete project"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            {expanded[i] && (
              <div className="ml-8 mt-2 space-y-1">
                {p.files.length === 0 && (
                  <div className="text-gray-400 text-xs italic p-2">No files yet</div>
                )}
                {p.files.map((f, j) => (
                  <div
                    key={f._id || j}
                    className={`flex items-center p-2 rounded-md cursor-pointer transition-all duration-200 ${
                      openFiles && openFiles.some(of => of.project.name === p.name && of.file === (f.name || f)) 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => onOpenFile && onOpenFile(p, f.name || f)}
                    title={f.name || f}
                  >
                    <FileIcon />
                    <span className={`flex-1 truncate ml-2 text-sm ${
                      openFiles && openFiles.some(of => of.project.name === p.name && of.file === (f.name || f))
                        ? 'font-semibold text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {f.name || f}
                    </span>
                    <button
                      className="ml-2 p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      onClick={e => { e.stopPropagation(); onDeleteFile && onDeleteFile(p, f.name || f); }}
                      title="Delete file"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  // Modal overlays using portals for perfect centering
  const projectModal = showProjectModal ? createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <form
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-96 flex flex-col gap-6 border border-gray-200 dark:border-gray-700 transform transition-all duration-200"
        onSubmit={addProject}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">Create New Project</h2>
          <p className="text-gray-600 dark:text-gray-400">Start coding with a new project</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project Name</label>
            <input
              type="text"
              placeholder="Enter project name..."
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
              value={newProjectName}
              onChange={e => setNewProjectName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
            <select
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 transition-all duration-200"
              value={newProjectLang}
              onChange={e => setNewProjectLang(e.target.value)}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="typescript">TypeScript</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
            </select>
          </div>
        </div>
        
        <div className="flex gap-3 pt-2">
          <button 
            type="submit" 
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Create Project
          </button>
          <button 
            type="button" 
            className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 font-semibold" 
            onClick={() => setShowProjectModal(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>,
    document.body
  ) : null;

  const fileModal = showFileModal ? createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <form
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-96 flex flex-col gap-6 border border-gray-200 dark:border-gray-700 transform transition-all duration-200"
        onSubmit={addFile}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">Create New File</h2>
          <p className="text-gray-600 dark:text-gray-400">Add a new file to your project</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">File Name</label>
          <input
            type="text"
            placeholder="e.g. main.js, index.py, app.cpp"
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
            value={newFileName}
            onChange={e => setNewFileName(e.target.value)}
            required
          />
        </div>
        
        <div className="flex gap-3 pt-2">
          <button 
            type="submit" 
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Create File
          </button>
          <button 
            type="button" 
            className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 font-semibold" 
            onClick={() => setShowFileModal(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>,
    document.body
  ) : null;

  // Show loading spinner when loading projects
  if (loadingProjects) {
    return (
      <div className="w-64 flex items-center justify-center h-full bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
        <LoadingSpinner size={8} />
      </div>
    );
  }

  // Desktop: static sidebar, Mobile: drawer
  return (
    <>
      {/* Mobile drawer overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-40 transition-opacity md:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsSidebarOpen(false)}
      />
      {/* Sidebar drawer (mobile) or static (desktop) */}
      <div
        className={`fixed z-50 inset-y-0 left-0 transform md:static md:translate-x-0 transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:block h-full`}
        style={{ width: '16rem' }}
      >
        <div className="w-64 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col h-full shadow-lg">
          {/* Close button for mobile */}
          <button
            className="md:hidden mb-4 ml-auto p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            aria-label="Close sidebar"
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Code Editor</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Create and manage your projects</p>
          </div>
          
          <button
            className="mb-6 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            onClick={() => setShowProjectModal(true)}
          >
            <PlusIcon /> New Project
          </button>
          
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-lg">Projects</h3>
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{projects.length}</span>
            </div>
          </div>
          <ul className="space-y-2 flex-1 overflow-y-auto">
            {projects.length === 0 && (
              <li className="text-gray-400 text-sm">No projects yet. Create one!</li>
            )}
            {projects.map((p, i) => (
              <li key={i} className="mb-3">
                <div 
                  className="flex items-center cursor-pointer group p-3 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm hover:shadow-md" 
                  onClick={() => toggleExpand(i)}
                >
                  <span className="mr-2 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                    {expanded[i] ? <ChevronDown /> : <ChevronRight />}
                  </span>
                  <FolderIcon />
                  <div className="flex-1 min-w-0">
                    <span
                      className="font-semibold text-gray-800 dark:text-gray-100 truncate block"
                      title={p.name}
                    >
                      {p.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{p.language}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="p-1.5 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 transition-colors"
                      onClick={e => { e.stopPropagation(); setSelectedProject(i); setShowFileModal(true); }}
                      title="Add file"
                    >
                      <PlusIcon />
                    </button>
                    <button
                      className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 transition-colors"
                      onClick={e => { e.stopPropagation(); onDeleteProject && onDeleteProject(p._id); }}
                      title="Delete project"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                {expanded[i] && (
                  <div className="ml-8 mt-2 space-y-1">
                    {p.files.length === 0 && (
                      <div className="text-gray-400 text-xs italic p-2">No files yet</div>
                    )}
                    {p.files.map((f, j) => (
                      <div
                        key={f._id || j}
                        className={`flex items-center p-2 rounded-md cursor-pointer transition-all duration-200 ${
                          openFiles && openFiles.some(of => of.project.name === p.name && of.file === (f.name || f)) 
                            ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => onOpenFile && onOpenFile(p, f.name || f)}
                        title={f.name || f}
                      >
                        <FileIcon />
                        <span className={`flex-1 truncate ml-2 text-sm ${
                          openFiles && openFiles.some(of => of.project.name === p.name && of.file === (f.name || f))
                            ? 'font-semibold text-blue-700 dark:text-blue-300'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {f.name || f}
                        </span>
                        <button
                          className="ml-2 p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                          onClick={e => { e.stopPropagation(); onDeleteFile && onDeleteFile(p, f.name || f); }}
                          title="Delete file"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Project Modal */}
          {projectModal}
          {/* File Modal */}
          {fileModal}
        </div>
      </div>
    </>
  );
};

export default Sidebar; 