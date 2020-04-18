const mongoose = require('mongoose');
// usamos la dependencia dotenv para leer el archivo de variable de entorno
// expecificamos el fichero por que esta en el raiz, si estubiera en una carpeta
// habria que incluirla en el path
require('dotenv').config({ path: 'variables.env'}) ;

const conectarDB = async () => {
    try {
        // mongoose.connect toma como primer parametro la url a donde se conectara
        // el segundo es un objeto de configuración
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('DB concectada');
    } catch (error) {
        console.log('hubo un error')
        console.log(error);
        process.exit(1); // En caso de error detiene la aplicacion
    }
}

// la sintaxis siguiente es como el export default que se encuentra en las nuevas versiones de javascript
module.exports = conectarDB;