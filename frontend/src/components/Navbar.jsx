import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  // Verificamos si hay token para saber si el usuario está logueado
  const token = localStorage.getItem('token'); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <Link to="/" className="font-bold text-xl">BlogApp</Link>
      
      <div className="flex gap-4">
        {token ? (
          <>
            <Link to="/admin" className="hover:text-blue-300">Panel</Link>
            <button onClick={handleLogout} className="hover:text-red-400">Cerrar Sesión</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-300">Iniciar Sesión</Link>
            <Link to="/registro" className="hover:text-blue-300">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;