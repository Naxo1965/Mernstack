const UsuarioModel = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// creamos una funcion, y como trabajamos con express pasamos un request y un response
exports.crearUsuario = async (req, res) => {
    //revisar si hay errores
    const errores = validationResult(req);
    if ( !errores.isEmpty() ) {
        return res.status(400).json({errores: errores.array() })
    }

    // destructuring de email y password
    const { email, password } = req.body;
    try {
        // Usamos la funcion de mongo findOne para extraer un dato concreto
        // en funcion de nuestro modelo.
        let usuario = await UsuarioModel.findOne({ email });

        if (usuario) {
            return res.status(400).json({ msg: 'El usuario ya existe'})
        }
        // crear el nuevo usuario
        usuario = new UsuarioModel(req.body);
        // hasheamos el password y utilizaremos salt que nos permite
        // crear un hash unico aunque se repita la clave.
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        // guardar el nuevo usuario
        await usuario.save();

        // Crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600
        }, (error, token) => {
            if(error) throw error;
            // mensaje de confirmación
            res.json({ token });
        })
        
    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}