import React from 'react';
import { useAudioStore } from '../../store/audioStore';

const Library: React.FC = () => {
  const { currentTrack } = useAudioStore();

  return (
    <div className="flex-1 bg-gray-100 p-8 overflow-y-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Library</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Placeholder for song list / album grid */}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div
            key={item}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="w-full h-40 bg-gray-300 rounded-md mb-4 flex items-center justify-center text-gray-500">
              Cover Art
            </div>
            <h3 className="font-semibold text-lg text-gray-900">Song Title {item}</h3>
            <p className="text-sm text-gray-600">Artist Name</p>
          </div>
        ))}
      </div>
      {currentTrack && (
        <div className="mt-8 p-4 bg-blue-100 rounded">Currently Selected: {currentTrack}</div>
      )}
    </div>
  );
};

export default Library;
