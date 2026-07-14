import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable'; //Importamos el buscador inteligente
import FeedbackMessage from '../components/FeedbackMessage';

const Admin = () => {
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [feedback, setFeedback] = useState({ mensaje: '', tipo: '' });
  
  // Estados para las categorías
  const [opcionesCategorias, setOpcionesCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  
  //Estado para guardar la lista de posts
  const [listaPosts, setListaPosts] = useState([]);

  //Estado para saber si se esta editando un post y cuál es su ID
  const [idEditado, setIdEditado] = useState(null);

  const [postAEliminar, setPostAEliminar] = useState(null);
  
  const navigate = useNavigate();

  const mostrarFeedback = (msg, tipo) => {
    setFeedback({ mensaje: msg, tipo: tipo });
    setTimeout(() => setFeedback({ mensaje: '', tipo: '' }), 4000);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Vamos a buscar las categorías a tu backend
    const cargarDatos = async () => {
      try {
        const resCategorias= await fetch('http://localhost:4000/api/categorias');
        const datosCategorias = await resCategorias.json();
        // La librería react-select necesita este formato exacto: { value, label }
        const opcionesMapeadas = datosCategorias.map(cat => ({
          value: cat._id,
          label: cat.nombre // Cambiá 'nombre' si tu campo se llama distinto
        }));
        
        setOpcionesCategorias(opcionesMapeadas);

        const resPosts = await fetch('http://localhost:4000/api/posts/mis-posts', {headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }});

        const datosPosts = await resPosts.json();
        setListaPosts(datosPosts);
      } catch (err) {
        mostrarFeedback("Error al cargar los datos iniciales", "error");
      }
    };

    cargarDatos();
  }, [navigate]);

  // 2. Función que se ejecuta si el usuario escribe una categoría nueva y le da a "Crear"
  const handleCrearCategoria = async (nuevoNombre) => {
    const token = localStorage.getItem('token');
    
    try {
      const respuesta = await fetch('http://localhost:4000/api/categorias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ nombre: nuevoNombre }) 
      });

      const datos = await respuesta.json();
      // Si el backend lo mandó envuelto en "categoria" o "nuevaCategoria", lo extraemos.
      // Si lo mandó suelto, usamos "datos" directamente.
      const categoriaCreada = datos.categoria || datos.nuevaCategoria || datos;

      //Armamos la opción asegurándonos de que no haya undefined
      if (categoriaCreada && categoriaCreada._id) {
        const nuevaOpcion = { 
            value: categoriaCreada._id, 
            label: categoriaCreada.nombre 
        };
        
        setOpcionesCategorias((prev) => [...prev, nuevaOpcion]);
        setCategoriaSeleccionada(nuevaOpcion);
      } else {
        mostrarFeedback('Error de conexión con el servidor.', 'error');
      }
      
    } catch (err) {
      mostrarFeedback('Error de conexión con el servidor.', 'error');
    }
  };


  //Funcion para el formulario de editar
  const handleEditar = (post) => {
    setTitulo(post.titulo);
    setContenido(post.contenido);
    setIdEditado(post._id);

    //Buscamos la categoría de este post para dejarla seleccionada en el buscador.
    const idCategoriaDelPost = typeof post.categoria === 'object' ? post.categoria._id : post.categoria;
    const catEncontrada = opcionesCategorias.find(c => c.value === idCategoriaDelPost);
    if (catEncontrada) {
        setCategoriaSeleccionada(catEncontrada);
    }

    window.scrollTo({top: 0, behavior: 'smooth'});
    setFeedback({ mensaje: '', tipo: '' });
  }

  const cancelarEdicion = () => {
    setTitulo('');
    setContenido('');
    setCategoriaSeleccionada(null);
    setIdEditado(null);
  }


  //Función para enviar el POST
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ mensaje: '', tipo: '' });
    
    //Si no hay categoria seleccionada, cortamos la funcion
    if (!categoriaSeleccionada) {
      mostrarFeedback('Por favor, seleccioná o creá una categoría.', 'error');
      return;
    }

    const token = localStorage.getItem('token');

    //Si la variable idEditado tiene algo guardado, se usa la url que viene con el id. Si no, se usa la normal de crear post. lo mismo con el metodo PUT Y POST.
    const url = idEditado 
      ? `http://localhost:4000/api/posts/${idEditado}` 
      : 'http://localhost:4000/api/posts';
    
    const metodoDelFetch = idEditado ? 'PUT' : 'POST';

    try {
      const respuesta = await fetch(url, {
        method: metodoDelFetch,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          titulo, 
          contenido, 
          categoria: categoriaSeleccionada.value 
        }), 
      });

      //Guardamos la respuesta
      const datos = await respuesta.json();

      if (!respuesta.ok) {
        mostrarFeedback('Error al crear el articulo.', 'error');
        return;
      }


      const postReal = datos.post || datos.postActualizado || datos.nuevoPost || datos;

      if (idEditado) {
        // Si estábamos editando, actualizamos solo ese post en la lista visual (con .map)
        setListaPosts(prev => prev.map(p => p._id === idEditado ? postReal : p));
        mostrarFeedback('¡Artículo actualizado con éxito!', 'exito');
      } else {
        // Si estábamos creando, lo agregamos al principio de la lista
        setListaPosts(prev => [postReal, ...prev]);
        mostrarFeedback('¡Artículo publicado con éxito!', 'exito');
      }

      // Limpiamos el formulario en ambos casos
      cancelarEdicion();

    } catch (err) {
      mostrarFeedback(err.message, 'error');
    }
  };

  //Función para eliminar un post
  const handleEliminar = async (idPost) => {
    const token = localStorage.getItem('token');

    try {
        const respuesta = await fetch(`http://localhost:4000/api/posts/${idPost}`,{
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (respuesta.ok) {
            //Hacemos un filter para ver si el id que acabamos de pasar, coincide con alguno de los post, lo sacamos de la lista que muestra react. 
            setListaPosts(prev => prev.filter(post => post._id !== idPost));
            mostrarFeedback('Post eliminado correctamente', 'exito');
        } else {
            mostrarFeedback("Hubo un error al eliminar", "error");
        }
    } catch (error) {
        mostrarFeedback("Error de conexión al eliminar", "error");
    } finally {
      setPostAEliminar(null);
    }
  };

  return (
   <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              {idEditado ? 'Editar Post' : 'Crear Nuevo Post'}
            </h1>
            <button onClick={() => navigate('/')} className="text-blue-600 hover:underline font-semibold">
              Ver Blog Público
            </button>
          </div>

          <FeedbackMessage mensaje={feedback.mensaje} tipo={feedback.tipo} />

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Título del artículo</label>
              <input 
                type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">Categoría</label>
              <CreatableSelect
                isClearable
                options={opcionesCategorias}
                value={categoriaSeleccionada}
                onChange={(opcion) => setCategoriaSeleccionada(opcion)}
                onCreateOption={handleCrearCategoria}
                placeholder="Buscar o crear categoría..."
                formatCreateLabel={(inputValue) => `Crear categoría "${inputValue}"`}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">Contenido</label>
              <textarea 
                value={contenido} onChange={(e) => setContenido(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded h-40 focus:outline-none focus:border-blue-500 resize-none" required
              />
            </div>

            <div className="flex gap-4">
              <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-6 rounded hover:bg-blue-700 transition w-full">
                {idEditado ? 'Actualizar Artículo' : 'Publicar Artículo'}
              </button>
              
              {idEditado && (
                <button type="button" onClick={cancelarEdicion} className="bg-gray-400 text-white font-bold py-3 px-6 rounded hover:bg-gray-500 transition">
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Administrar mis Posts</h2>
          
          {listaPosts.length === 0 ? (
            <p className="text-gray-500 text-center">Todavía no hay posts creados.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {listaPosts.map(post => (
                <div key={post._id} className="flex justify-between items-center border-b border-gray-200 pb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{post.titulo}</h3>
                    <p className="text-gray-500 text-sm">{post.contenido.substring(0, 60)}...</p>
                  </div>
                  
                  <div className="flex gap-2">
                    {postAEliminar === post._id ? (
                      <div className="flex items-center gap-2 bg-red-50 p-1 rounded border border-red-200">
                        <span className="text-sm text-red-600 font-bold px-2">¿Seguro?</span>
                        <button 
                          onClick={() => handleEliminar(post._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded transition text-sm font-semibold"
                        >
                          Sí, borrar
                        </button>
                        <button 
                          onClick={() => setPostAEliminar(null)}
                          className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1.5 rounded transition text-sm font-semibold"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleEditar(post)}
                          className="bg-amber-400 hover:bg-amber-500 text-white px-4 py-2 rounded transition font-semibold"
                        >
                          Editar
                        </button>
                        <button 
                        
                          onClick={() => setPostAEliminar(post._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition font-semibold"
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Admin;