import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Admin from './pages/Admin';
import UserPosts from './pages/UserPosts';
import PostDetail from './pages/PostDetail';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/registro" element={<Register />} />
        
        <Route path="/login" element={
          <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <Login />
          </div>
        } />

        <Route path="/usuario/:id" element={<UserPosts />} />
        
        <Route path="/post/:id" element={<PostDetail />} />
        
        <Route path="/admin" element={<Admin />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;