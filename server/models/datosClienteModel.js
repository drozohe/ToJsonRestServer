const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator')


let Schema = mongoose.Schema;

let datosClienteSchema = new Schema({
   
    cod_cliente:{
        type:Number,
        required :[true, 'El código de cliente no puede estar vacío']
    },
    razon_social:{
        type: String,
        required: [false,'']
    },
    cod_producto:{
        type: Number,
        required : [true, 'El código del producto no puede estar vacío']

    },
    descripcion_producto:{
        type: String,
        required: [false,'']
    },
    cod_subproducto:{
        type: Number,
        unique:true,
        required: [true, 'El código de subproducto no puede estar vacío']
    },
    descripcion_subproducto:{
        type: String,
        required: [false,'']
    },
    activo:{
        type: Boolean,
        required: [false,''],
        default: true
    }
});

datosClienteSchema.plugin(mongooseUniqueValidator,{message: '{PATH} debe ser unico'})


module.exports = mongoose.model('TB_CLIENTE_ARCHIVO',datosClienteSchema)


