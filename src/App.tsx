import Sidebar from './components/Sidebar/Sidebar';
import Library from './components/Library/Library';
import PlayerBar from './components/PlayerBar/PlayerBar';
import bgImage from './assets/default.jpeg';
import './App.css';

function App() {
  return (
    <div
      className="flex flex-col h-screen w-screen overflow-hidden bg-cover bg-center text-gray-900"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay to ensure text readability if image is too bright/busy */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] -z-10"></div>

      <div className="flex flex-1 overflow-hidden z-0">
        <Sidebar />
        <Library />
      </div>
      <PlayerBar />
    </div>
  );
}

export default App;
