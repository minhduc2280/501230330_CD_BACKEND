import categoryRoute from "./categoryRoute.js"
import productRoute from "./productRoute.js"
import orderRoute from "./orderRoute.js"

export default function router(app){
  app.use("/categories", categoryRoute)
  app.use("/products", productRoute)
  app.use("/orders", orderRoute)

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
}