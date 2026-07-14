import { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import FloatingCreateButton from '../components/FloatingCreateButton';

const Home = () => {
  //Preparamos un estado vacío para guardar los artículos
  const [posts, setPosts] = useState([]);
  
  const [cargando, setCargando] = useState(true);

  //Usamos useEffect para ir a buscar los datos a tu API
  useEffect(() => {
    const obtenerPosts = async () => {
      try {
        const respuesta = await fetch('http://localhost:4000/api/posts');
        const datos = await respuesta.json();
        
        setPosts(datos); // Guardamos los artículos que nos mandó el backend
      } catch (error) {
        console.error("Error al traer los posts:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerPosts();
  }, []); // Para que lo haga una sola vez y no refreshee todo el tiempo

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">BlogApp</h1>
      
      {cargando ? (
        <p className="text-center text-gray-500 text-xl">Cargando artículos...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <p className="text-gray-500 col-span-full text-center">Todavía no hay artículos publicados.</p>
          )}
        </div>
      )}
      <FloatingCreateButton />
    </div>
  );
};

export default Home;