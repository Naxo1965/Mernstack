const UsuarioModel = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {
    //revisar si hay errores
    const errores = validationResult(req);
    if ( !errores.isEmpty() ) {
        return res.status(400).json({errores: errores.array() })
    }

    const {email, password} = req.body;

    try{
        // comprobar si el usuario existe
        let usuario = await UsuarioModel.findOne({ email });
        if(!usuario) {
            return res.status(400).json({msg: 'El usuario no existe'});
        }
        // comprobar si el password es correcto
        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if(!passCorrecto) {
            return res.status(400).json({msg: 'El password no es correcto'});
        }

        // Crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 36000
        }, (error, token) => {
            if(error) throw error;
            // mensaje de confirmación
            res.json({ token });
        })

    } catch (error) {
        console.log(error);
    }
}

// Función para obtener el usuario logueado
exports.usuarioLogueado = async (req, res) => {
    try {
        const usuario = await UsuarioModel.findById(req.usuario.id).select('-password');
        res.json({usuario});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}