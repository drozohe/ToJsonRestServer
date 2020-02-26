//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
//                      
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
const writelog = require('./writeLog').writelog;

const path = require('path');
const chokidar = require('chokidar')

const rootPath = path.parse(__dirname).dir;
const pathToScan = path.join(rootPath, '../files');



class WatcherClass {
    constructor(cPath) {
        cPath ? this.pathToScan= cPath :this.pathToScan = path.join(rootPath, '../files')
        console.log('cpath:', this.pathToScan);
        this.ready = false;
        this.chokidaroptions = {
            ignored: /(^|[\/\\])\../, // ignore dotfiles
            depth:4,
            persistent: true,
            ignoreInitial: false,
            usePolling: true,
            interval: 100,
            binaryInterval: 300,
            awaitWriteFinish: true,
            awaitWriteFinish: {
                stabilityThreshold: 2000,
                pollInterval: 1000
            }
        };

        this.watcher = chokidar.watch(this.pathToScan, this.chokidaroptions)
            .on('all', (event, path, stats) => {
                writelog(`event: ${event}|path: ${path}|stats size: ${stats ? stats.size : 'no size'}`);
            })
            .on('ready', () => {
                this.ready = true;
            
            })
            .on('error', (err) => {
                writelog(`Error: ${err}`);
            });        

    }

    getlist(){
        return this.watcher.getWatched();
    }
}




module.exports = WatcherClass;

// const chokidaroptions = {
//     ignored: /(^|[\/\\])\../, // ignore dotfiles
//     persistent: true,
//     ignoreInitial: false,
//     usePolling: true,
//     interval: 100,
//     binaryInterval: 300,
//     awaitWriteFinish: true,
//     awaitWriteFinish: {
//         stabilityThreshold: 2000,
//         pollInterval: 1000
//     }
// }

// let list = {};
// let ready = false;

// let watcher = chokidar.watch(pathToScan, chokidaroptions)
// watcher.on('all', (event, path, stats) => {
//     writelog(`event: ${event}|path: ${path}|stats size: ${stats ? stats.size : 'no size'}`);
// })
// .on('ready', () => {
//     ready = true;

// })
// .on('error', (err) => {
//     writelog(`Error: ${err}`);
// })


// async function startWatcher() {

//     watcher.on('all', (event, path, stats) => {
//     writelog(`event: ${event}|path: ${path}|stats size: ${stats ? stats.size : 'no size'}`);
//     })
//     .on('ready', ()=>{
//         ready = true;
//         console.log('event ready');
//         list = watcher.getWatched();

//     })
//     .on('error', (err) => {
//         throw new Error(`Se produjo un error en watcher. ${err.name}: ${err.messages}`)
//     })
//     return {
//         err:false
//     }


// }



// async function waitFor(stop) {
//     if (stop) {
//         list = watcher.getWatched();
//         console.log('stop RDY: ', ready);
//         return {
//             lst: watcher.getWatched(),
//             err: false
//         }
//     }

//     if (!ready) {
//         console.log('not ready');
//         setTimeout(() => {
//             waitFor(false);
//         }, 100)
//     } else {
//         waitFor(true)
//     }
// }



// module.exports = {

//     watcher,
//     list,
//     ready,
//     waitFor
// }
