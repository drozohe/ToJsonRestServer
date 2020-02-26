const path = require('path');
const formatDate = require('date-format');
const fs = require('graceful-fs');

const rootPath = path.parse(__dirname).dir;
const fecha = formatDate.asString('dd_MM_yyyy', new Date());

let logFile = fs.createWriteStream(path.join(rootPath, `/log/log_${fecha}.txt`), { flags: 'a' });


writelog = async (registro) => {

    try {
        const fecha = formatDate.asString('dd_MM_yyyy|hh:mm:ss.SSS', new Date());
        logFile.write(`${fecha}|${registro}\n`);

    } catch (e) {
        //throw e
        if (logFile) {
            logFile.write(`|error| ${e.message}`)
            
        }else{
            throw e
        }
    }

}

module.exports = {
    logFile,
    writelog
}

