//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
//                               SEVER              
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_

require('./config/config');
const tools = require('./tools/watcher');

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
    
        
        tools.writelog(`Server ONLINE on port: ${process.env.PORT}`)
        console.log('la fck lista: ',tools.list);
        // tools.startWatcher()
        // .then((rpta)=>{
        //     console.log('rta: ',rpta);
        //     console.log('gfjhfjhfjgfgj ',tools.watcher.getWatched())
        //     // tools.getWatchedObj()
        //     //     .then((lista)=>{
        //     //         console.log(lista);
        //     //     }).catch((err2)=>{
        //     //         console.log('error: ',err2);
        //     //     })
        // }).catch((err)=>{
        //     console.log('error: ',err);
        // })
        console.info(`Server ONLINE on port: ${process.env.PORT}`)
    })
    
    // console.info(scanner.infoMessages)

});

//➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
