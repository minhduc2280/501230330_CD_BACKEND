import express from 'express';
import path from "path"
const app = express();
const port = 5001
const __dirname = path.resolve()

app.use("/static",express.static(path.join(__dirname, 'public')))

app.set('view engine','ejs')
app.set('views',__dirname + "/src/views")

app.get('/components', (req,res) =>{
  res.render("pages/components")
})

app.get('/forms', (req,res) =>{
  res.render("pages/forms")
})
app.get('/icon', (req,res) =>{
  res.render("pages/icon")
})

app.get('/notif', (req,res) =>{
  res.render("pages/notif")
})

app.get('/tables', (req,res) =>{
  res.render("pages/tables")
})

app.get('/typography', (req,res) =>{
  res.render("pages/typography")
})

app.get('/', (req,res) =>{
  res.render("pages/index")
})

app.listen(port, function(){
  console.log("localhost:" + port);
})