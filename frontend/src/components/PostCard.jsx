import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  // Verificamos si existe el autor
  const autorNombre = post.autor?.nombre || "Autor desconocido";
  const autorId = post.autor?._id;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{post.titulo}</h2>
      
      <div className="mb-4">
        <span className="text-gray-500 text-sm">Por: </span>
        {autorId ? (
          <Link 
            to={`/usuario/${autorId}`} 
            className="text-blue-600 font-semibold hover:underline"
          >
            {autorNombre}
          </Link>
        ) : (
          <span className="text-gray-400">{autorNombre}</span>
        )}
      </div>

      <p className="text-gray-600 mb-4 line-clamp-3">{post.contenido}</p>
      
      <Link 
        to={`/post/${post._id}`} 
        className="text-blue-500 font-semibold hover:underline"
      >
        Leer más
      </Link>
    </div>
  );
};

export default PostCard;