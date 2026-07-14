import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PostCard from '../components/PostCard';
import FeedbackMessage from '../components/FeedbackMessage';

const UserPosts = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [feedback, setFeedback] = useState({ mensaje: '', tipo: '' });

  useEffect(() => {
    const fetchPostsUsuario = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/posts/usuario/${id}`);
        const data = await res.json();
        if (!res.ok) {
          setFeedback({ mensaje: 'No se pudieron cargar los posts.', tipo: 'error' });
            return;
        }

        setPosts(data);
      } catch (error) {
        setFeedback({ mensaje: 'Error de conexión con el servidor.', tipo: 'error' });
      } finally {
        setCargando(false);
      }
    };
    fetchPostsUsuario();
  }, [id]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Publicaciones del autor</h1>

      <FeedbackMessage mensaje={feedback.mensaje} tipo={feedback.tipo} />
      
      {cargando ? <p>Cargando...</p> : (
        posts.length === 0 ? <p>Este usuario aún no ha publicado nada.</p> : (
          <div className="flex flex-col gap-6">
            {posts.map(post => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default UserPosts;