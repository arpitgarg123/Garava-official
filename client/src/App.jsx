import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

const Home = lazy(() => import('./pages/Home.jsx'));
const About = lazy(() => import('./pages/About.jsx'));

const App = () => {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  )
}

export default App