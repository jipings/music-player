import React from 'react';
import { Home, Compass, Disc3, Mic2, Clock, Heart, Folder, ListMusic, Music } from 'lucide-react';

const Sidebar: React.FC = () => {
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
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-900 bg-white/60 hover:bg-white/80 transition-all font-medium shadow-sm"
            >
              <Home className="w-5 h-5" />
              Home
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:text-gray-900 hover:bg-white/40 transition-all"
            >
              <Compass className="w-5 h-5" />
              Discover
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:text-gray-900 hover:bg-white/40 transition-all"
            >
              <Disc3 className="w-5 h-5" />
              Albums
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:text-gray-900 hover:bg-white/40 transition-all"
            >
              <Mic2 className="w-5 h-5" />
              Artists
            </a>
          </nav>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-4 px-2 text-gray-600/80">
            Library
          </h3>
          <nav className="space-y-1">
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:text-gray-900 hover:bg-white/40 transition-all"
            >
              <Clock className="w-5 h-5" />
              Recent
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:text-gray-900 hover:bg-white/40 transition-all"
            >
              <Heart className="w-5 h-5" />
              Favorites
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:text-gray-900 hover:bg-white/40 transition-all"
            >
              <Folder className="w-5 h-5" />
              Local
            </a>
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
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:text-gray-900 hover:bg-white/40 transition-all"
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
