//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
//                               SEVER              
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_

require('./config/config');
const mWatcher = require('./tools/watcher');
const writelog = require('./tools/writeLog').writelog;

const express = require('express');
const mongoose = require('mongoose');
const hbs = require('hbs');
const path = require('path');
const bodyParser = require('body-parser');

const formatDate = require('date-format');
const fs = require('graceful-fs');



const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const rootPath = path.parse(__dirname).dir;
const partialsPath = path.join(rootPath, "/views/partials");
const publicPath = path.join(rootPath, '/public');


// Handlebars register partials...
hbs.registerPartials(partialsPath);


//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
//        MIDDLEWARES              
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
app.use(express.static(publicPath))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))


app.use(require('./controllers/index'));
//app.use(require('./config/watcher'));


app.set('view engine', 'hbs')

mongoose.set('useCreateIndex', true)

process.on('unhandledRejection', function (err) {
    console.error(err);
    // sendInTheCalvary(err);
});


app.watcher = new mWatcher(); //si no se envía nada en el parámetro inicia
                              //escaenando el directorio /files, de lo contrario
                              //escanea el directorio indicado en el parámetro  

(function waitfor(stop){ //Este metodo espera a que finalice el escaneo...
    console.log('Server starting...please wait');
    if (stop) {            
        
        console.log('directories watcher ready? ', app.watcher.ready);
        //console.log(watcher.getlist());
        console.log('stating mongo db...');
        mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {

            if (err) {
                throw err
            }
            console.info("Mongo ONLINE...");
            
            app.listen(process.env.PORT, (err) => {
                //console.info(`Escuchando el puerto ${ process.env.PORT  } en ${__dirname} partials path= ${partialsPath} public path = ${publicPath}`)
                if (err) {
                    throw err;
                }
            
                writelog(`Server ONLINE on port: ${process.env.PORT}`)
                console.info(`Server ONLINE on port: ${process.env.PORT}`)
            })
        });
        
        return;
    }

    if (!app.watcher.ready) {
        //console.log('not ready: ',app.watcher.ready );
        setTimeout(()=>{
            waitfor(false);
        },500);
    }else{
        waitfor(true);
    }
}
)()

//const waitfor;
// const waitfor = function (stop){
//     if (stop) {            
//         console.log(mWatcher.list);
//         console.log('stop');
//         return;
//     }

//     if (!mWatcher.ready) {
//         console.log('not ready: ',mWatcher.ready );
//         setTimeout(()=>{
//             waitfor(false);
//         },500);
//     }else{
//         waitfor(true);
//     }

// };


// const startObserver = async ()=>{
//     const r1 = await mWatcher.startWatcher();
//     const r2 = await mWatcher.waitFor(false);

//     console.log(r1);
//     console.log(r2);   
    
// }





//➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
