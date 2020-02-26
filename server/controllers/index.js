const express = require('express');

const app = express();
const path = require('path');

let rootPath = path.parse(__dirname).dir


app.use(require(path.join(rootPath,'controllers/navigationController')))

app.use(require(path.join(rootPath,'controllers/userController')))
app.use(require(path.join(rootPath,'controllers/clienteArchivoController')))
//app.use(require(path.join(rootPath,'controllers/uploadFiles')))


module.exports = app
