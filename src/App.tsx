import { useEffect } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import BottomNav from './components/BottomNav/BottomNav';
import Library from './components/Library/Library';
import Local from './components/Local/Local';
import PlayerBar from './components/PlayerBar/PlayerBar';
import bgImage from './assets/default.jpeg';
import { useUiStore } from './store/uiStore';
import { usePlayerSync } from './hooks/usePlayerSync';
import { usePlaylists } from './hooks/usePlaylists';
import './App.css';

function App() {
  const { currentView, setMobile } = useUiStore();
  const { getPlaylists } = usePlaylists();
  usePlayerSync();

  useEffect(() => {
    getPlaylists();
  }, [getPlaylists]);

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setMobile]);

  return (
    <div
      className="flex flex-col h-screen w-screen overflow-hidden bg-cover bg-center text-gray-900"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] -z-10"></div>

      <div className="flex flex-1 overflow-hidden z-0">
        <Sidebar />
        {currentView === 'local' ? <Local /> : <Library />}
      </div>

      <PlayerBar />
      <BottomNav />
    </div>
  );
}

export default App;
