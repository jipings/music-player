import React from 'react';
import { Home, Clock, Heart, Folder, Menu } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { usePlaylists } from '../../hooks/usePlaylists';

const BottomNav: React.FC = () => {
  const { currentView, setView, toggleSidebar, selectedPlaylistId, setSelectedPlaylistId } =
    useUiStore();
  const { playlists } = usePlaylists();

  const recentPlaylist = playlists.find((p) => p.name === 'Recent');
  const favoritesPlaylist = playlists.find((p) => p.name === 'Favorites');

  const handlePlaylistClick = (id: string) => {
    setSelectedPlaylistId(id);
    setView('playlist');
  };

  const getNavClass = (isActive: boolean) => {
    return `flex flex-col items-center gap-1 p-3 rounded-xl transition-all cursor-pointer ${
      isActive ? 'text-indigo-600 bg-white/60' : 'text-gray-500 hover:text-gray-700'
    }`;
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-white/30 shadow-2xl z-40 pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        <button onClick={toggleSidebar} className={getNavClass(false)}>
          <Menu className="w-6 h-6" />
          <span className="text-[10px] font-medium">Menu</span>
        </button>

        <button
          onClick={() => setView('library')}
          className={getNavClass(currentView === 'library')}
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        <button
          onClick={() => recentPlaylist && handlePlaylistClick(recentPlaylist.id)}
          className={getNavClass(
            currentView === 'playlist' && selectedPlaylistId === recentPlaylist?.id,
          )}
        >
          <Clock className="w-6 h-6" />
          <span className="text-[10px] font-medium">Recent</span>
        </button>

        <button
          onClick={() => favoritesPlaylist && handlePlaylistClick(favoritesPlaylist.id)}
          className={getNavClass(
            currentView === 'playlist' && selectedPlaylistId === favoritesPlaylist?.id,
          )}
        >
          <Heart className="w-6 h-6" />
          <span className="text-[10px] font-medium">Favorites</span>
        </button>

        <button onClick={() => setView('local')} className={getNavClass(currentView === 'local')}>
          <Folder className="w-6 h-6" />
          <span className="text-[10px] font-medium">Local</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
