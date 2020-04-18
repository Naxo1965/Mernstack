const mongoose = require('mongoose'); // vamos a utilizar uno de los metodos de mongoose.

// vamos a definir nuestra estructura con algo que se conoce como un schema
// mas informacion sobre los type en mongoosejs.com/docs/shcematypes.html
const UsuariosSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    registro: {
        type: Date,
        default: Date.now()
    }
})

// Usuario es el nombre del modelo. Con esto le decimos a mongoose que vamos a registrar
// el modelo llamado 'Usuario' con la forma definida en el Schama definido.
module.exports = mongoose.model('Usuario', UsuariosSchema);