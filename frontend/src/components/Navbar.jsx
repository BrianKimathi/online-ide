import React, { useEffect, useState } from 'react';

const Navbar = ({ isSidebarOpen, setIsSidebarOpen, isAuthenticated, user, logout }) => {
  const [dark, setDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // On mount, set theme from localStorage or system preference
  useEffect(() => {
    const saved = localStorage.theme;
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // When dark changes, update <html> class and localStorage
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [dark]);

  const getInitial = () => {
    if (user && user.username && user.username.length > 0) return user.username[0].toUpperCase();
    if (user && user.email && user.email.length > 0) return user.email[0].toUpperCase();
    return '?';
  };

  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 w-full relative">
      <div className="flex items-center gap-2 sm:gap-4">
        {isAuthenticated && typeof setIsSidebarOpen === 'function' && (
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            aria-label="Open sidebar"
            onClick={() => setIsSidebarOpen(true)}
          >
            {/* Hamburger icon */}
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        )}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div className="hidden xs:block">
            <div className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">Code Editor</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Online IDE</div>
          </div>
          <div className="xs:hidden">
            <div className="text-sm font-bold text-gray-800 dark:text-gray-100">IDE</div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          aria-label="Toggle theme"
          onClick={() => setDark((d) => !d)}
        >
          {dark ? (
            // Sun icon
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-8.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.95-7.07l-.71.71M4.05 4.93l-.71-.71M12 5a7 7 0 100 14 7 7 0 000-14z" /></svg>
          ) : (
            // Moon icon
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
          )}
        </button>
        
        {isAuthenticated && user && (
          <>
            {/* Desktop user info and logout */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{user.username || user.email || 'User'}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Developer</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold uppercase shadow-lg">
                {getInitial()}
              </div>
              <button
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                onClick={logout}
              >
                Logout
              </button>
            </div>

            {/* Mobile user menu */}
            <div className="sm:hidden relative">
              <button
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold uppercase shadow-lg"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="User menu"
              >
                {getInitial()}
              </button>
              
              {/* Mobile dropdown menu */}
              {mobileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">{user.username || user.email || 'User'}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Developer</div>
                  </div>
                  <div className="py-1">
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Backdrop for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 sm:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar; 