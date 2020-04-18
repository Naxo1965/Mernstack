// Rutas para crear usuarios
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');

// Iniciar sesión
// End pont --> /api/auth
// en el post especificamos solo / por que definimos en index.js pp.use('/api/ususarios', .....
router.post('/',
    authController.autenticarUsuario
);

// Obtener el usuario logueado
router.get('/',
    auth,
    authController.usuarioLogueado
)

module.exports = router;