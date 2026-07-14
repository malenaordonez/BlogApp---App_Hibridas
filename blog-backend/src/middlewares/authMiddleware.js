const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    //Buscamos el token en las cabeceras de la petición (Headers)
    let token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({exito: false, mensaje: 'No se proporcionó un token de seguridad'});
    }

    //Sacamos la palabra Bearer de adelante asi nos quedamos solo con el token.
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    try {
        const decodificado = jwt.verify(token, process.env.JWT_SECRET);
        
        //Guardamos los datos del usuario en la petición
        req.usuario = decodificado;

        //Usamos el next como forma de éxito.
        next();
    } catch (error) {
        return res.status(401).json({ exito: false, mensaje: 'El token es inválido o expiró'});
    }
};

module.exports = {verificarToken};