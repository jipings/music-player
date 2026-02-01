import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-full bg-gray-900 text-white flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-8 text-blue-500">My Music</h1>
      <nav className="space-y-2">
        <a href="#" className="block px-4 py-2 rounded hover:bg-gray-800 bg-gray-800">Library</a>
        <a href="#" className="block px-4 py-2 rounded hover:bg-gray-800">Playlists</a>
        <a href="#" className="block px-4 py-2 rounded hover:bg-gray-800">Settings</a>
      </nav>
    </div>
  );
};

export default Sidebar;
