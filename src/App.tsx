import Sidebar from './components/Sidebar/Sidebar';
import Library from './components/Library/Library';
import PlayerBar from './components/PlayerBar/PlayerBar';
import './App.css';

function App() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <Library />
      </div>
      <PlayerBar />
    </div>
  );
}

export default App;