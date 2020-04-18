const express = require('express'); // node no soporta los import por eso lo hacemos asi.
const conectarDB = require('./config/db');
const cors = require('cors');

// crear el servidor
const appserver = express();

// conectamos la base de datos
conectarDB();

// habilitar cors
appserver.use(cors());

// hablitamos express.json. Nos permite leer datos que el usuario coloque.
appserver.use(express.json({ extended: true}));

// puerto de la appserver
const PORT = process.env.PORT || 4000;

/*/ definimos la pagina principal
appserver.get('/', (req, res) => {
    res.send('Hola Mundo')
});
*/

// Importar las rutas
appserver.use('/api/usuarios', require('./routes/usuarios'));
appserver.use('/api/auth', require('./routes/auth'));
appserver.use('/api/proyectos', require('./routes/proyectos'));
appserver.use('/api/tareas', require('./routes/tareas'));

// arrancamos la app Y como callback le lanzamos un mensaje
appserver.listen(PORT, () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`);
})


