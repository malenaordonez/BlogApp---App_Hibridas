const FeedbackMessage = ({ mensaje, tipo }) => {
  if (!mensaje) return null;

  // Clases según si es error o éxito
  const estilos = tipo === 'error' 
    ? "bg-red-100 text-red-700 border-red-400" 
    : "bg-green-100 text-green-700 border-green-400";

  return (
    <div className={`p-4 mb-4 border rounded ${estilos}`}>
      {mensaje}
    </div>
  );
};

export default FeedbackMessage;