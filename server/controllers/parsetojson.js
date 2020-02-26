const express = require('express');
const fileUpload = require('express-fileupload');
const clienteArchivoModel = require('../models/datosClienteModel')
const fs = require('graceful-fs');

const app = express();
const path = require('path')

const rootPath = path.parse(__dirname).dir





//➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
app.put('/tojson/:codsubprod',async (req, res) => {
    
    const codsubprod = req.params.codsubprod;
    let filterOptions = {
        activo: true
    }

    clienteArchivoModel.find({cod_subproducto:codsubprod, activo : true })
    .exec((err, ds_datosCliente)=>{
        if (err) {
            return res.status(400).json({
                error: true,
                msj: err
            })
        }

        clienteArchivoModel.countDocuments({cod_subproducto:codsubprod, activo : true }, (err, recordsCount)=>{
            if (err) {
                return res.status(400).json({
                    error: true,
                    msj: err
                })
            }

            if (recordsCount===0) {
                return res.status(400).json({
                    error: true,
                    msj: 'No encontré nada (.. )( ..)'
                })
            }

            let clientFolder = `${ ds_datosCliente[0].cod_cliente }@${ds_datosCliente[0].cod_producto}@${ds_datosCliente[0].cod_subproducto}`
            const pathToScan = path.join(rootPath, "../files/",clientFolder)
            if (!fs.existsSync(pathToScan)) {
                return res.status(400).json({
                    path:pathToScan,
                    error: true,
                    msj: `El directorio ${ clientFolder } no existe... (.. )( ..)`
                })
            }


            res.json({
                error: false,
                ds_datosCliente,
                quantity: recordsCount,
                folder:clientFolder,
                fullPath: pathToScan
            })
        })

     })
       
})



//➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
//➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
//➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
//➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
//➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
//➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
//➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
//➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
//➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
//➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
//➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
//➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖

module.exports = app;