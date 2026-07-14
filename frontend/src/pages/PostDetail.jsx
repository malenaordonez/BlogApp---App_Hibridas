import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import FeedbackMessage from '../components/FeedbackMessage';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [feedback, setFeedback] = useState({ mensaje: '', tipo: '' });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/posts/${id}`);
        if (!res.ok) throw new Error("No se pudo cargar el post");
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setFeedback({ mensaje: 'Hubo un error', tipo: 'error' });
      } finally {
        setCargando(false);
      }
    };

    fetchPost();
  }, [id]);

  if (cargando) return <p className="text-center mt-10">Cargando contenido...</p>;

  return (
   <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
      <FeedbackMessage mensaje={feedback.mensaje} tipo={feedback.tipo} />
      
      <Link to="/" className="text-blue-500 hover:underline mb-6 block">
        &larr; Volver al inicio
      </Link>
      
      <h1 className="text-4xl font-bold mb-4 text-gray-900">{post.titulo}</h1>
      
      
      <div className="mb-6">
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded uppercase tracking-wide">
          {post.categoria?.nombre || "Sin categoría"}
        </span>
      </div>

      
      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg flex items-center justify-between mb-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
            {post.autor?.nombre ? post.autor.nombre.charAt(0).toUpperCase() : 'A'}
          </div>
          <div>
            <p className="text-sm text-gray-500">Escrito por:</p>
            <p className="font-bold text-gray-800">{post.autor?.nombre || "Anónimo"}</p>
          </div>
        </div>

        <Link 
          to={`/usuario/${post.autor?._id}`} 
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded transition shadow-sm"
        >
          Ver perfil
        </Link>
      </div>

      
      <div className="prose lg:prose-xl text-gray-800 leading-relaxed border-t pt-8">
        {post.contenido}
      </div>
    </div>
  );
};

export default PostDetail;