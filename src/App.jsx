import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Notes from './pages/Notes';
import Settings from './pages/Settings';
import ComingSoon from './pages/ComingSoon';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/notes" element={<Notes />} />
      <Route path="/settings" element={<Settings />} />
      <Route
        path="/story"
        element={<ComingSoon title="故事柜" icon="📖" note="AI 现场写睡前故事，可选类型和设定" />}
      />
      <Route
        path="/sounds"
        element={<ComingSoon title="声音角" icon="📻" note="白噪音、轻音乐，可以叠着放" />}
      />
    </Routes>
  );
}
