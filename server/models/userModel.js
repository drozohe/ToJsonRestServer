const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator')


let availableRoles = {
   values: ['ADMIN_ROLE', 'USER_ROLE'] ,
   message: '{VALUE} no es un rol válido'
}


let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true,'El nombre es necesario']

    },
    email: {
        type: String,
        required: [true,'Se necesita el email'],
        unique:true
    },
    password:{
        type: String,
        required: [true,'Se necesita la contraseña']
    },
    img:{
        type: String,
        required: [false]

    },
    role:{
        type: String,
        required: [true],
        default: 'USER_ROLE', 
        enum: availableRoles
    },
    estado:{
        type: Boolean,
        default:true,
        required: [true]
    },
    google:{
        type: Boolean,
        default: false
    }
});



//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
//modificar el esquema para devolver ciertos objetos
//por ejemplo el password nunca se debe devolver en el objeto
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_

//Nunca usar una funcion de flecha pq se necesita el "this"
usuarioSchema.methods.toJSON = function(){
    let user = this
    let usrObject = user.toObject();
    delete usrObject.password
    //delete usrObject.role
    return usrObject
}



usuarioSchema.plugin(mongooseUniqueValidator,{message: '{PATH} debe ser unico'})


module.exports = mongoose.model('TB_USUARIO',usuarioSchema)
