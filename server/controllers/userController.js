const express = require('express')

const app = express()

const bcrypt = require('bcrypt')

const _ = require('underscore')



const UsuarioModel = require('../models/userModel')


//.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-
//obtener
app.get('/user', function (req, res) {
    let from = Number(req.query.from) || 0
    
    let maxCantRecords = Number(req.query.cant) || 10

    console.log(from,maxCantRecords);

    let filterOptions = {
        estado:true
    }

    UsuarioModel.find(filterOptions) //este metodo tiene varia opciones para filtrar el resultado, y filtrar los campos 
                          //que se devuelven en la consulta
                .skip(from)
                .limit(maxCantRecords)
                .exec((err,resultUsersDataset)=>{
                    if (err) {
                        return res.status(400).json({
                            error: true,
                            msj: err
                        })
                    }
                    
                    UsuarioModel.countDocuments(filterOptions, (err, recordsCount)=>{

                        if (err) {
                            return res.status(400).json({
                                error: true,
                                msj: err
                            })
                        }


                        res.json({
                            error: false,
                            resultUsersDataset,
                            quantity: recordsCount
                        })
                    })
                })

    
    // res.render('home', {
    //     nombre: 'Diego Rozo',
    //     CardTitle: 'Web server'
    // })
})
//.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-
//crear
app.post('/user', function (req, res){
    let body = req.body
    let user = new UsuarioModel({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        //password: body.password,
        role: body.role
    })

    user.save((err, usr_resp_db) => {
        if (err) {
            return res.status(400).json({
                error: true,
                msj: err
            })
        }

        res.json({
            error: false,
            usrDB: usr_resp_db
        })

    })
})
//.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-
//update en la base de datos
app.put('/user/:id', function (req, res){
    let id = req.params.id;
    //la funcion pick del paquete underscore hace una lista blanca de los
    //atributos que deben quedar disponibles para actualizacion...
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado'])

    
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

    UsuarioModel.findByIdAndUpdate(id, body, mongoUpdateOptions, (err, usr_resp_db) => {
        if (err) {
            return res.status(400).json({
                error: true,
                msj: err
            })
        }

        if (!usr_resp_db) {
            return res.status(400).json({
                error: true,
                msj: err
            })
        }

        res.json({
            error: false,
            usrDB: usr_resp_db //documento actualizado...
        })
    })


})
//.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-
//eliminar
app.delete('/user/:id', function (req, res){
    //Lo mas recomendable es que no se borren registros de la BD
    //para esto se maneja el campo estado y así mantener la integridad de los datos
    //por lo tanto lo que se hace es un UPDATE

    let id = req.params.id

    let mongoUpdateOptions = {
        new: true,
        runValidators: false
    }

    UsuarioModel.findByIdAndUpdate(id, {estado:false}, mongoUpdateOptions, (err, usr_resp_db) => {
        if (err) {
            return res.status(400).json({
                error: true,
                msj: err
            })
        }

        res.json({
            error: false,
            usrDB: usr_resp_db //documento actualizado...
        })
    })

    // UsuarioModel.findByIdAndRemove(id, (err, usrDeleted)=>{
    //     if (err) {
            
    //     }

    // })
})
//.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-
module.exports = app