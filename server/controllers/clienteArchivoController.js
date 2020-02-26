const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const _ = require('underscore')

const clienteArchivoModel = require('../models/datosClienteModel')

//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
//                      DATOS CLIENTE 
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_


//.-.-.-.-.-.-.-.-.-.-.    listar    -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-
app.get('/datos_cliente', (req, res) => {
    let from = Number(req.query.from) || 0

    let maxCantRecords = Number(req.query.cant) || 10

    console.log(from, maxCantRecords);
    console.log('appWatcher: ', app.watcher);
    let filterOptions = {
        activo: true
    }

    clienteArchivoModel.find(filterOptions) //este metodo tiene varia opciones para filtrar el resultado, y filtrar los campos 
        //que se devuelven en la consulta
        .skip(from)
        .limit(maxCantRecords)
        .exec((err, ds_datosCliente) => {
            if (err) {
                return res.status(400).json({
                    error: true,
                    msj: err
                })
            }
            clienteArchivoModel.countDocuments(filterOptions, (err, recordsCount) => {

                if (err) {
                    return res.status(500).json({
                        error: true,
                        msj: err
                    })
                }

                if (!ds_datosCliente) {
                    return res.status(400).json({
                        error: true,
                        msj: 'No encontré nada (.. )( ..)'
                    })
                }


                res.json({
                    error: false,
                    ds_datosCliente,
                    quantity: recordsCount
                })
            })
        })
})


//.-.-.-.-.-.-.-.-.-.-.    listar x id   -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-
app.get('/datos_cliente/:id', (req, res) => {
    try {
        let from = Number(req.query.from) || 0

        let maxCantRecords = Number(req.query.cant) || 10

        let id = req.params.id
        console.log(from, maxCantRecords);
        let filterOptions = {
            activo: true
        }

        clienteArchivoModel.findById(id, filterOptions)
            .skip(from)
            .limit(maxCantRecords)
            .exec((err, ds_datosCliente) => {
                if (err) {
                    return res.status(400).json({
                        error: true,
                        msj: err
                    })
                }

                clienteArchivoModel.countDocuments(filterOptions, (err, recordsCount) => {

                    if (err) {
                        return res.status(400).json({
                            error: true,
                            msj: err
                        })
                    }

                    if (!ds_datosCliente) {
                        return res.status(400).json({
                            error: true,
                            msj: 'El ID no es correcto. No se encontró nada (.. )( ..)'
                        })
                    }


                    res.json({
                        error: false,
                        ds_datosCliente,
                        quantity: recordsCount
                    })
                })



            })

    } catch (e){
        throw {
                error: true,
                msj: e.message
        }
    }

})
//.-.-.-.-.-.-.-.-.-.-.    crear    -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-
app.post('/datos_cliente', (req, res) => {
    let body = req.body
    let datosClienteArchivo = new clienteArchivoModel({
        cod_cliente: body.cod_cliente,
        razon_social: body.razon_social,
        cod_producto: body.cod_producto,
        descripcion_producto: body.descripcion_producto,
        cod_subproducto: body.cod_subproducto,
        descripcion_subproducto: body.descripcion_subproducto
    })

    datosClienteArchivo.save((err, datosCliente_resp_db) => {
        if (err) {
            return res.status(500).json({
                error: true,
                msj: err
            })
        }

        if (!datosCliente_resp_db) {
            return res.status(400).json({
                error: true,
                msj: err
            })
        }

        res.json({
            error: false,
            datosClienteDB: datosCliente_resp_db
        })

    })
})

//.-.-.-.-.-.-.-.-.-.-.    update    -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-
app.put('/datos_cliente/:id', function (req, res) {
    let id = req.params.id;

    //la funcion pick del paquete underscore hace una lista blanca de los
    //atributos que deben quedar disponibles para actualizacion...
    let body = _.pick(req.body, ['cod_cliente', 'razon_social', 'cod_producto', 'descripcion_producto', 'cod_subproducto', 'descripcion_subproducto', 'activo'])


    let mongoUpdateOptions = {
        new: true,
        runValidators: true
    }

    //para devolver el objeto modificado, se deben enviar las opciones
    //dentro de los parametros, de lo contrario devuelve el objeto original(sin cambios)
    //pero los cambios si quedan actualizados en la BD...

    //Para evitar que se actualicen campos que no se deben actualizar, se debe enviar
    //dentro de las opciones el parámetro "runValidators:true" y esto ejecutará todas
    //las validaciones del modelo...

    clienteArchivoModel.findByIdAndUpdate(id, body, mongoUpdateOptions, (err, datosCliente_resp_db) => {
        if (err) {
            return res.status(400).json({
                error: true,
                msj: err
            })
        }

        if (!datosCliente_resp_db) {
            return res.status(400).json({
                error: true,
                msj: 'Documento no encontrado... (.. )( ..)'
            })
        }

        res.json({
            error: false,
            datosClienteDB: datosCliente_resp_db //documento actualizado...
        })
    })


})

//.-.-.-.-.-.-.-.-.-.-.    delete    -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-

app.delete('/datos_cliente/:id', function (req, res) {
    //Lo mas recomendable es que no se borren registros de la BD
    //para esto se maneja el campo estado y así mantener la integridad de los datos
    //por lo tanto lo que se hace es un UPDATE

    let id = req.params.id

    let mongoUpdateOptions = {
        new: true,
        runValidators: false
    }



    clienteArchivoModel.findByIdAndUpdate(id, { activo: false }, mongoUpdateOptions, (err, datosCliente_resp_db) => {
        if (err) {
            return res.status(400).json({
                error: true,
                msj: err
            })
        }

        if (!datosCliente_resp_db) {
            return res.status(400).json({
                error: true,
                msj: 'Documento no encontrado... (.. )( ..)'
            })
        }

        res.json({
            error: false,
            datosClienteDB: datosCliente_resp_db //documento actualizado...
        })
    })
})


module.exports = app