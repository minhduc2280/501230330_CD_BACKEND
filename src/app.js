import express from 'express';
import path from "path"
  import router from './routers/index.js';
  import mongoConnect from "./mongo/mongoConnecter.js"
import bodyParser from 'body-parser';

const app = express();
const port = 5001
const __dirname = path.resolve()

mongoConnect()
app.use("/static",express.static(path.join(__dirname, 'public')))

app.set('view engine','ejs')
app.set('views',__dirname + "/src/views")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

router(app)

app.listen(port, function(){
  console.log("localhost:" + port);
})