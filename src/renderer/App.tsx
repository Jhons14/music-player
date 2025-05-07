import Home from './pages/Home';
import VideoPlayerPage from './pages/VideoPlayerPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/video' element={<VideoPlayerPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
