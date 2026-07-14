const User = require('../schemas/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registrarUsuario = async (datosUsuario) => {
    try {
        const {nombre, email, password} = datosUsuario;
    
        //Verificamos si el email ya existe
        const usuarioExistente = await User.findOne({email});
        if (usuarioExistente) {
            return { exito: false, mensaje: 'El email ya está registrado'};
        }
    
        //Encriptamos la contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(password, salt);
    
        //Creamos el usuario en la bdd
        const nuevoUsuario = new User({
            nombre,
            email,
            password: passwordEncriptada
        });
    
        await nuevoUsuario.save();
    
        //Retornamos un objeto avisando que todo salió bien
        return {exito: true, usuario: nuevoUsuario};
    } catch (error) {
        return {exito: false, mensaje: 'Error al registrar un nuevo usuario'}
    }
};

const loginUsuario = async (email, password) => {
    try {
        //Buscamos al usuario
        const usuario = await User.findOne({email});
    
        if (!usuario) {
            return {exito: false, mensaje: 'Credenciales inválidas'};
        }
    
        //Comparamos contraseñas
        const passwordValida = await bcrypt.compare(password, usuario.password);
    
        if (!passwordValida) {
            return {exito: false, mensaje: 'Credenciales inválidas'};
        }
    
        //Generamos el token JWT para la autenticación
        const token = jwt.sign(
            { id: usuario._id},
            process.env.JWT_SECRET,
            {expiresIn: '1d' }
        );
    
        return {exito: true, token: token, usuario: usuario};
    } catch (error) {
        return {exito: false, mensaje: 'Error al iniciar sesión'}
    }
};

module.exports = {registrarUsuario, loginUsuario};