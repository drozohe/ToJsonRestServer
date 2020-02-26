const mWatch = require('./mWatcher')

const express = require('express');
const fileUpload = require('express-fileupload');
const fileExists = require('file-exists');
const fileUrl = require('file-url');
const clienteArchivoModel = require('../models/datosClienteModel')


const app = express();
const path = require('path');

let rootPath = path.parse(__dirname).dir
let tmpPath;

let optUseTempFiles = false;
let allowedExtensions = ['.txt', '.csv']

tmpPath = path.join(rootPath, "../files/tmp")

app.use(fileUpload({
    useTempFiles: optUseTempFiles,
    tempFileDir: tmpPath
}));


// let clientFolderFiles = '76@2223@2742'//get from BD... 
// let scanner = new mWatch()
//➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
app.put('/tojson', (req, res) => {

    let start = req.query.start
    let stop = req.query.stop
    
    //let clientFolderFiles = '76@2223@2742'//get from BD... 
    //const scanner = new mWatch(clientFolderFiles)
    let clientFolderFiles = '76@2223@2742'//get from BD... 
    let scanner = new mWatch()
    
    if ((start === "true") && (start !== "undefined")) {
        (async function () {
            try {
                const resultado = await scanner.setWatcher(clientFolderFiles);
                const resultado2 = await scanner.startToWatch();
                //await scanner.startToWatch();
                const resultado3 = ""
                //const resultado3 = await scanner.getDirectoryList();

                return res.json({
                    rta: resultado,
                    rta2: resultado2,
                    rta3: resultado3
                })
            } catch (error) {
                return res.json({
                    message: error.message,
                    error: true
                })
            }
        })()


    } else if ((stop === "true") && (stop !== "undefined")) {

        (async function () {
            try{
                const resultado3 = await scanner.stopWatch();
                return res.json({
                    rta:resultado3
                })
            } catch (error) {
                return res.json({
                    message: error.message,
                    error: true
                })
            }    
        })()



    } else {
        return res.json({
            m: "Parametro no identificado. (debe ser start || stop",
            p: "toJson (.. )( ..)"
        })

    }



})

//➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
app.get('/tojson/list', (req, res) => {
    if (scanner) {
        return res.json({
            dirs: scanner.getListOfFiles()
        })
        
    }else{
        return res.status(501).json({
            error:true,
            message: 'Observer down...'
        })
    }

})

//➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖


//➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
app.put('/upload', function (req, res) {
    let pathByParam = escape(req.query.pathDirectory) || "0"

    if ((pathByParam !== "0") && (pathByParam !== "undefined")) {
        return res.json({
            err: false,
            msg: `path: ${path.parse(unescape(pathByParam))}`,
            pathx: unescape(pathByParam).replace(/(\s+)/g, '\\$1'),
            p: pathByParam
        })
    } else {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.sendStatus(400)
                .json({
                    error: true,
                    msg: 'No ha seleccionado ningun archivo (.. ) ( ..)'
                })
        }

        let uploadedFile = req.files.archivo //"pathfile" lllega en la peticion put
        // console.log(uploadedFile);
        //console.log(path.extname(uploadedFile.name));
        //console.log('size:', uploadedFile.size);

        if (!uploadedFile.name) {
            return res.status(400)
                .json({
                    error: true,
                    msg: 'No ha seleccionado ningun archivo (.. ) ( ..)'
                })
        } else if (uploadedFile.size === 0) {
            return res.status(400)
                .json({
                    error: true,
                    msg: 'El archivo está vacío (.. ) ( ..)'
                })
        } else {
            let extensionFileIn = path.extname(uploadedFile.name).toLowerCase();
            if (allowedExtensions.indexOf(extensionFileIn) < 0) {
                return res.status(400)
                    .json({
                        error: true,
                        msg: `Extensión ${extensionFileIn} no válida. Las extensiones permitidas son: ` + allowedExtensions.join(', ')
                    })
            }
        }


        uploadedFile.mv(path.join(tmpPath, `//${uploadedFile.name}`), (err) => {
            if (err) {
                return res.status(500)
                    .json({
                        error: true,
                        msg: err
                    })
            }

            res.json({
                error: false,
                msg: `Archivo ${uploadedFile.name} cargado...`
            })
        })
    }


})

//app.scanner = scanner;

//➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
module.exports = app;