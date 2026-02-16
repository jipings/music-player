import React from 'react';
import { Home, Clock, Heart, Folder, ListMusic, Music, X } from 'lucide-react';
import { useUiStore, View } from '../../store/uiStore';
import { usePlaylists } from '../../hooks/usePlaylists';

const Sidebar: React.FC = () => {
  const {
    currentView,
    setView,
    selectedPlaylistId,
    setSelectedPlaylistId,
    isMobile,
    isSidebarOpen,
    closeSidebar,
  } = useUiStore();
  const { playlists } = usePlaylists();

  const recentPlaylist = playlists.find((p) => p.name === 'Recent');
  const favoritesPlaylist = playlists.find((p) => p.name === 'Favorites');
  const userPlaylists = playlists.filter((p) => p.name !== 'Recent' && p.name !== 'Favorites');

  const handlePlaylistClick = (id: string) => {
    setSelectedPlaylistId(id);
    setView('playlist');
    if (isMobile) closeSidebar();
  };

  const handleViewChange = (view: string) => {
    setView(view as View);
    if (isMobile) closeSidebar();
  };

  const getLinkClass = (viewName: string, id?: string) => {
    const isActive = currentView === viewName && (!id || selectedPlaylistId === id);
    const baseClass =
      'flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer w-full text-left font-medium';
    if (isActive) {
      return `${baseClass} text-gray-900 bg-white/60 shadow-sm`;
    }
    return `${baseClass} text-gray-600 hover:text-gray-900 hover:bg-white/40`;
  };

  if (isMobile) {
    if (!isSidebarOpen) return null;

    return (
      <>
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
          onClick={closeSidebar}
        />
        <div className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white/95 backdrop-blur-xl text-gray-800 flex flex-col p-6 shadow-2xl z-50 animate-in slide-in-from-left duration-300">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Music className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight drop-shadow-sm">Melody</span>
            </div>
            <button
              onClick={closeSidebar}
              className="p-2 hover:bg-white/50 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-8 flex-1 overflow-y-auto custom-scrollbar">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4 px-2 text-gray-500">
                Menu
              </h3>
              <nav className="space-y-1">
                <button
                  onClick={() => handleViewChange('library')}
                  className={getLinkClass('library')}
                >
                  <Home className="w-5 h-5" />
                  Home
                </button>
              </nav>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4 px-2 text-gray-500">
                Library
              </h3>
              <nav className="space-y-1">
                {recentPlaylist && (
                  <button
                    onClick={() => handlePlaylistClick(recentPlaylist.id)}
                    className={getLinkClass('playlist', recentPlaylist.id)}
                  >
                    <Clock className="w-5 h-5" />
                    Recent
                  </button>
                )}
                {favoritesPlaylist && (
                  <button
                    onClick={() => handlePlaylistClick(favoritesPlaylist.id)}
                    className={getLinkClass('playlist', favoritesPlaylist.id)}
                  >
                    <Heart className="w-5 h-5" />
                    Favorites
                  </button>
                )}
                <button onClick={() => handleViewChange('local')} className={getLinkClass('local')}>
                  <Folder className="w-5 h-5" />
                  Local
                </button>
              </nav>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4 px-2 text-gray-500">
                Playlists
              </h3>
              <nav className="space-y-1">
                {userPlaylists.map((playlist) => (
                  <button
                    key={playlist.id}
                    onClick={() => handlePlaylistClick(playlist.id)}
                    className={getLinkClass('playlist', playlist.id)}
                  >
                    <ListMusic className="w-5 h-5 opacity-60" />
                    {playlist.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="w-72 h-full bg-white/50 backdrop-blur-xl text-gray-800 flex flex-col p-6 border-r border-white/30 shadow-lg hidden lg:flex">
      <div className="flex items-center gap-3 mb-10 px-2 text-gray-900">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <Music className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold tracking-tight drop-shadow-sm">Melody</span>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider mb-4 px-2 text-gray-500">
            Menu
          </h3>
          <nav className="space-y-1">
            <button onClick={() => setView('library')} className={getLinkClass('library')}>
              <Home className="w-5 h-5" />
              Home
            </button>
          </nav>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider mb-4 px-2 text-gray-500">
            Library
          </h3>
          <nav className="space-y-1">
            {recentPlaylist && (
              <button
                onClick={() => handlePlaylistClick(recentPlaylist.id)}
                className={getLinkClass('playlist', recentPlaylist.id)}
              >
                <Clock className="w-5 h-5" />
                Recent
              </button>
            )}
            {favoritesPlaylist && (
              <button
                onClick={() => handlePlaylistClick(favoritesPlaylist.id)}
                className={getLinkClass('playlist', favoritesPlaylist.id)}
              >
                <Heart className="w-5 h-5" />
                Favorites
              </button>
            )}
            <button onClick={() => setView('local')} className={getLinkClass('local')}>
              <Folder className="w-5 h-5" />
              Local
            </button>
          </nav>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider mb-4 px-2 text-gray-500">
            Playlists
          </h3>
          <nav className="space-y-1">
            {userPlaylists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => handlePlaylistClick(playlist.id)}
                className={getLinkClass('playlist', playlist.id)}
              >
                <ListMusic className="w-5 h-5 opacity-60" />
                {playlist.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
