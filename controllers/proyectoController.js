const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req, res) => {

    // Revisar si hay errores
    const errores = validationResult(req);
    if ( !errores.isEmpty() ) {
        return res.status(400).json({errores: errores.array() })
    }

    try {
        // Crear nuevo proyecto
        const proyecto = new Proyecto(req.body);
        
        // Guardar el creador segun JWT
        proyecto.creador = req.usuario.id;

        proyecto.save();
        res.json({proyecto, msg: 'Proyecto creado' });
        
    } catch (error) {
        console.log(error);
        // es status 500 es cuando hay un error en el servidor
        res.status(500).send('Hubo un error');
    }
}

// Funcion para Obtener proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
    try {
        // usamos id del req para hacer una consulta a la base de datos
        //console.log(req.usuario.id);
        const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({ creado: -1});
        res.json({ proyectos });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// Funcion para actualizar un proyecto
exports.actualizarProyecto = async (req, res) => {
    // Revisar si hay errores
    const errores = validationResult(req);
    if ( !errores.isEmpty() ) {
        return res.status(400).json({errores: errores.array() })
    }

    // extraer la información del proyecto
    const { nombre } = req.body;
    const proyectoCambio = {};

    if(nombre) {
        proyectoCambio.nombre = nombre;
    }

    try {
        // revisar el id
        let proyecto = await Proyecto.findById(req.params.id);
        // comprobar si el proyecto existe o no
        if(!proyecto) {
            return res.status(404).json({msg: 'No se encontro ningun proyecto'})
        }
        // verificar el creador del proyecto
        if(proyecto.creador.toString() != req.usuario.id) {
            return res.status(401).json({msg: 'No Atuorizado'});
        }
        // actualizar
        proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id }, { $set: proyectoCambio }, { new: true });
        res.json({proyecto});
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}

// Funcion para eliminar proyecto segun su id
exports.eliminarProyecto = async (req, res) => {
    try {
        // revisar el id
        let proyecto = await Proyecto.findById(req.params.id);
        // comprobar si el proyecto existe o no
        if(!proyecto) {
            return res.status(404).json({msg: 'El proyecto que desea eliminar no existe'})
        }
        // verificar el creador del proyecto
        if(proyecto.creador.toString() != req.usuario.id) {
            return res.status(401).json({msg: 'No Atuorizado'});
        }
        // eliminar el proyecto
        await Proyecto.findOneAndRemove({ _id: req.params.id });
        res.json({msg: 'proyecto eliminado'});
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}