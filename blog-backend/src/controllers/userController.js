const userService = require('../services/userService');

const registrar = async (req,res) => {
    try {
        //Le pasamos los datos que viene del Frontend (req.body)
        const resultado = await userService.registrarUsuario(req.body);

        if (resultado.exito === false) {
            return res.status(400).json({mensaje: resultado.mensaje});
        }

        res.status(201).json({
            mensaje: 'Usuario registrado con éxito',
            usuario: {
                id: resultado.usuario._id, 
                nombre: resultado.usuario.nombre, 
                email: resultado.usuario.email
            }
        });
    } catch (error) {
        res.status(400).json({mensaje: error.message});
    }
};

const login =  async (req, res) => {
    try {
        const {email, password} = req.body;
        const resultado = await userService.loginUsuario(email, password);

        if (resultado.exito === false) {
            return res.status(401).json({mensaje: resultado.mensaje});
        }
        //devolvemos el token JWT al Frontend
        res.status(200).json({
            mensaje: 'Login exitoso',
            token: resultado.token,
            usuario: {
                id: resultado.usuario._id,
                nombre: resultado.usuario.nombre,
                email: resultado.usuario.email
            }
        })
    } catch (error) {
        res.status(401).json({mensaje: error.message});
    }
};

module.exports = {registrar, login};