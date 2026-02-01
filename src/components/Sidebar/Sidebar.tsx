import React from 'react';
import { Home, Compass, Disc3, Mic2, Clock, Heart, Folder, ListMusic, Music } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';

const Sidebar: React.FC = () => {
  const { currentView, setView } = useUiStore();

  const getLinkClass = (viewName: string) => {
    const isActive = currentView === viewName;
    return `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
      isActive
        ? 'text-gray-900 bg-white/60 font-medium shadow-sm'
        : 'text-gray-600 hover:text-gray-900 hover:bg-white/40'
    }`;
  };

  return (
    <div className="w-64 h-full bg-white/50 backdrop-blur-xl text-gray-800 flex flex-col p-6 border-r border-white/30 shadow-lg">
      <div className="flex items-center gap-2 mb-10 px-2 text-gray-900">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
          <Music className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight drop-shadow-sm">Melody</span>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-4 px-2 text-gray-600/80">
            Menu
          </h3>
          <nav className="space-y-1">
            <button onClick={() => setView('library')} className={getLinkClass('library')}>
              <Home className="w-5 h-5" />
              Home
            </button>
            <button
              onClick={() => setView('library')}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:text-gray-900 hover:bg-white/40 transition-all w-full text-left text-gray-600"
            >
              <Compass className="w-5 h-5" />
              Discover
            </button>
            <button
              onClick={() => setView('library')}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:text-gray-900 hover:bg-white/40 transition-all w-full text-left text-gray-600"
            >
              <Disc3 className="w-5 h-5" />
              Albums
            </button>
            <button
              onClick={() => setView('library')}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:text-gray-900 hover:bg-white/40 transition-all w-full text-left text-gray-600"
            >
              <Mic2 className="w-5 h-5" />
              Artists
            </button>
          </nav>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-4 px-2 text-gray-600/80">
            Library
          </h3>
          <nav className="space-y-1">
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:text-gray-900 hover:bg-white/40 transition-all w-full text-left text-gray-600">
              <Clock className="w-5 h-5" />
              Recent
            </button>
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:text-gray-900 hover:bg-white/40 transition-all w-full text-left text-gray-600">
              <Heart className="w-5 h-5" />
              Favorites
            </button>
            <button onClick={() => setView('local')} className={getLinkClass('local')}>
              <Folder className="w-5 h-5" />
              Local
            </button>
          </nav>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-4 px-2 text-gray-600/80">
            Playlists
          </h3>
          <nav className="space-y-1">
            {['Chill Vibes', 'Workout Pump', 'Focus Flow'].map((item) => (
              <a
                key={item}
                href="#"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:text-gray-900 hover:bg-white/40 transition-all text-gray-600"
              >
                <ListMusic className="w-5 h-5 opacity-50" />
                {item}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
