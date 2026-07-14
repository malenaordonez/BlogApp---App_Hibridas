import { Link } from 'react-router-dom';

const FloatingCreateButton = () => {
  // Verificamos si existe el token
  const token = localStorage.getItem('token');
  
  if (!token) return null; // Si no hay token, no renderizamos nada

  return (
    <Link
      to="/admin"
      className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center z-50"
      title="Crear nuevo post"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
      </svg>
    </Link>
  );
};

export default FloatingCreateButton;