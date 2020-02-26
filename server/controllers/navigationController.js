const express = require('express')

const app = express()

app.get('/', (req, res)=> {
    res.render('home',{
     nombre:'Diego Rozo',
     CardTitle:'Web server'
    })
 })
 
 app.get('/home', (req, res)=> {
     res.render('home',{
      nombre:'Diego Rozo',
      CardTitle:'Web server'
     })
  })
  
 
 app.get('/about', (req, res)=> {
     res.render('about',{
      nombre:'Diego Rozo',
      CardTitle:'Web server'
     })
  })
 
 
 
 app.post('/', function (req, res) {
     let body = req.body
     res.json({
         datosPostHome: body
     })
 })
 
 app.delete('/', function (req, res) {
     res.json('home delete')
 })
 
 app.put('/', function (req, res) {
     res.json('home put')
 })

module.exports = app