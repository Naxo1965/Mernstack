const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// ---------- api/tareas ------------------
// Crea tareas
router.post('/',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    tareaController.crearTarea
);

// Obtener tareas
router.get('/',
    auth,
    tareaController.obtenerTareas
);

// Actualizar una tarea segun su id
router.put('/:id',
    auth,
    tareaController.actualizarTarea
);

// Eliminar un proyecto existente
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
);

module.exports = router;