import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FeedbackMessage from '../components/FeedbackMessage';

const Register = () => {
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '' });
  const [feedback, setFeedback] = useState({mensaje: '', tipo: ''});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ mensaje: '', tipo: '' });

    try {
      const res = await fetch('http://localhost:4000/api/usuarios/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedback({ mensaje: data.mensaje || "Error al registrar", tipo: 'error' });
        return;
      }

      const loginRes = await fetch('http://localhost:4000/api/usuarios/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      })

      const loginData = await loginRes.json();

      //Si el login automático falla, Se manda al login manual.
      if (!loginRes.ok) {
        setFeedback({ mensaje: 'Registro exitoso. Redirigiendo al login...', tipo: 'exito' });
        setTimeout(() => {
          navigate('/login');
        }, 1500);
        return;
      }
      
      localStorage.setItem('token', loginData.token);
      setFeedback({ mensaje: '¡Bienvenido! Redirigiendo...', tipo: 'exito' });
      
      setTimeout(() => {
        navigate('/');
        window.location.reload(); // Para forzar el refresco de la Navbar
      }, 1500);

    } catch (error) {
      setFeedback({ mensaje: 'Error de conexión con el servidor', tipo: 'error' });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Registro</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input 
          type="text" placeholder="Nombre" className="p-2 border rounded"
          onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
        />
        <input 
          type="email" placeholder="Email" className="p-2 border rounded"
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
        />
        <input 
          type="password" placeholder="Contraseña" className="p-2 border rounded"
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Register;