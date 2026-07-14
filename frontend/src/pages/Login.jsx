import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FeedbackMessage from '../components/FeedbackMessage';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState({ mensaje: '', tipo: '' });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ mensaje: '', tipo: '' });

    try {
      //Hacemos la petición POST al backend
      const respuesta = await fetch('http://localhost:4000/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const datos = await respuesta.json();

      //Chequeamos si el backend dio un error
      if (!respuesta.ok) {
        setFeedback({ mensaje: datos.mensaje || 'Error al iniciar sesión', tipo: 'error' });
        return; //Para que la funcione frene si hay este error.
      }

      //Guardamos el token en el navegador
      localStorage.setItem('token', datos.token);
      
      setFeedback({ mensaje: 'Login exitoso. Redirigiendo...', tipo: 'exito' });
      
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 1000);
    } catch (err) {
      setFeedback({ mensaje: err.message, tipo: 'error' });
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Iniciar Sesión
      </h2>
      
      <FeedbackMessage mensaje={feedback.mensaje} tipo={feedback.tipo} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            placeholder="tu@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            placeholder="********"
            required
          />
        </div>

        <button 
          type="submit" 
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition mt-2"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;