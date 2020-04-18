const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

// Crea la tarea
exports.crearTarea = async (req, res) => {

    // Revisar si hay errores
    const errores = validationResult(req);
    if ( !errores.isEmpty() ) {
        return res.status(400).json({errores: errores.array() })
    }
    const {proyecto} = req.body;
    try {
        // Comprobar si exite el proyecto
        const esProyecto = await Proyecto.findById(proyecto)
        if(!esProyecto) {
            res.status(404).json({msg: 'Proyecto no encontrado.'});
        }

        // comprobar si el proyecto exitente pertenece al usuario logeado
        if(esProyecto.creador.toString() != req.usuario.id) {
            return res.status(401).json({msg: 'No Atuorizado'});
        }

        // Crear neuva tarea
        const tarea = new Tarea(req.body);
        
        await tarea.save();
        res.json({tarea});
        
    } catch (error) {
        console.log(error);
        // es status 500 es cuando hay un error en el servidor
        res.status(500).send('Hubo un error');
    }
}

// Obtiene las tareas de un proyecto
exports.obtenerTareas = async (req, res) =>  {
    const {proyecto} = req.query;
    try {
        // Comprobar si exite el proyecto
        const esProyecto = await Proyecto.findById(proyecto)
        if(!esProyecto) {
            res.status(404).json({msg: 'Proyecto no encontrado.'});
        }
        // comprobar si el proyecto exitente pertenece al usuario logeado
        if(esProyecto.creador.toString() != req.usuario.id) {
            return res.status(401).json({msg: 'No Atuorizado'});
        }
        // obtener las tareas
        const tareas = await Tarea.find({ proyecto: proyecto }).sort({creado: -1});
        res.json({ tareas });
    } catch (error) {
        console.log(error);
        // es status 500 es cuando hay un error en el servidor
        res.status(500).send('Hubo un error');
    }
}

// Funcion para actualizar una tarea
exports.actualizarTarea = async (req, res) => {
    // Revisar si hay errores
    const errores = validationResult(req);
    if ( !errores.isEmpty() ) {
        return res.status(400).json({errores: errores.array() })
    }

    // extraer la información del proyecto
    const { nombre, estado } = req.body;
    const tareaCambio = {};

    tareaCambio.nombre = nombre;
    tareaCambio.estado = estado;

    try {
        // revisar el id
        let tarea = await Tarea.findById(req.params.id);
        // comprobar si el proyecto existe o no
        if(!tarea) {
            return res.status(404).json({msg: 'No se encontro ninguna tarea'})
        }

        // obtencion del usuario del proyecto
        let proyectoCreador = await Proyecto.findById(tarea.proyecto);

        // verificar el creador de la tarea
        if(proyectoCreador.creador != req.usuario.id) {
            return res.status(401).json({msg: 'No Atuorizado'});
        }

        // actualizar
        tarea = await Tarea.findByIdAndUpdate({ _id: req.params.id }, { $set: tareaCambio }, { new: true });
        res.json({tarea});
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}

// Funcion para eliminar tarea segun su id
exports.eliminarTarea = async (req, res) => {
    try {
        // revisar el id
        let tarea = await Tarea.findById(req.params.id);
        // comprobar si el proyecto existe o no
        if(!tarea) {
            return res.status(404).json({msg: 'No se encontro ningun proyecto'})
        }
        // obtencion del usuario del proyecto
        let proyectoCreador = await Proyecto.findById(tarea.proyecto);

        // verificar el creador de la tarea
        if(proyectoCreador.creador != req.usuario.id) {
            return res.status(401).json({msg: 'No Atuorizado'});
        }

        // eliminar el proyecto
        await Tarea.findOneAndRemove({ _id: req.params.id });
        res.json({msg: 'tarea eliminada'});
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}