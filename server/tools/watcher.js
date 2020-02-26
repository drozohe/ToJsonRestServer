//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
//                      
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_

const waitForAll = require('wait-for-event').waitForAll;
const path = require('path');
const chokidar = require('chokidar')
const formatDate = require('date-format');
const fs = require('graceful-fs');

const rootPath = path.parse(__dirname).dir;
const pathToScan = path.join(rootPath, '../files');
const fecha = formatDate.asString('dd_MM_yyyy', new Date());

writelog = async (registro) => {

    try {
        const fecha = formatDate.asString('dd_MM_yyyy|hh:mm:ss.SSS', new Date());
        logFile.write(`${fecha}|${registro}\n`);

    } catch (e) {
        //throw e
        logFile.write(`|error| ${e.message}`)
    }

}

let list ={}



let watcher = chokidar.watch(pathToScan, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    ignoreInitial: false,
    usePolling: true,
    interval: 100,
    binaryInterval: 300,
    awaitWriteFinish: true,
    alwaysStat: true
}).setMaxListeners(50)
// .on('all', (event, path, stats) => {
    //     writelog(`event: ${event}|path: ${path}|stats size: ${stats ? stats.size : 'no size'}`);
    
    
    // })
    // .on('ready', ()=>{
        //     lkt(watcher.getWatched())
        
        // })
        // .on('error', (err) => {
            //     throw new Error(`Se produjo un error en watcher. ${err.name}: ${err.messages}`)
            // })
            
const emitters = [
    watcher.on('all', (event, path, stats) => {
            writelog(`event: ${event}|path: ${path}|stats size: ${stats ? stats.size : 'no size'}`);
    }),
    watcher.on('ready', ()=>{
            console.log('ready');
        
    }),
    watcher.on('error', (err) => {
                throw new Error(`Se produjo un error en watcher. ${err.name}: ${err.messages}`)
    })
];
    
waitForAll('done', emitters, err => console.log('Yay, all the things are done!'));


// emitters[0].emit('done');
// emitters[1].emit('done');
// emitters[2].emit('done');


let logFile = fs.createWriteStream(path.join(rootPath, `/log/log_${fecha}.txt`), { flags: 'a' });



startWatcher = async () => {

    if (!fs.existsSync(pathToScan)) {
        throw new Error(`Error al intentar iniciar el observador de directorios. El directorio ${pathToScan} no existe. Verifique y vuelva a intentarlo`)
    }

    writelog(`Inicializado para escanear en: ${pathToScan}`)
    watcher.setMaxListeners = 20;

    watcher.on('all', (event, path, stats) => {
        writelog(`event: ${event}|path: ${path}|stats size: ${stats ? stats.size : 'no size'}`);

    })
    .on('ready', ()=>{
        return 'ready ready hpta'
    })
    .on('error', (err) => {
        throw new Error(`Se produjo un error en el observer. ${err.name}: ${err.messages}`)
    })

    // return {
    //     message: 'watcher ready... ',
    //     lista: watcher.getWatched()
    // }


}

getWatchedObj = async () => {
    console.log('w: ', watcher);
    return watcher.getWatched();
}

module.exports = {
    writelog,
    startWatcher,
    getWatchedObj,
    watcher,
    list
}
