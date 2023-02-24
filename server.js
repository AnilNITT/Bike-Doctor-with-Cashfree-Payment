const express = require("express");
const crypto    = require('crypto');
const app = express();
const path = require('path');
const http = require('http');
const bodyParser = require("body-parser");
const multer = require('multer');
const apiRouter = require("./routes/index");
const db = require("./models/index");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors")
const errorMiddleware = require("./middlewares/error");
const { log } = require("console");



app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  // res.header("Access-Control-Allow-Headers", "Content-Type",'Authorization');
  res.header("Access-Control-Allow-Headers", " Origin, X-Requested-With, Content-Type, Accept, form-data,Authorization");
  // res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});



// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//   if (req.method === 'OPTIONS') {
//       res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
//       return res.status(200).json({});
//   }
//   next();
// });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// Create Server
var server = http.createServer(app);

// parse requests of content-type - application/json
app.use(cors())
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static('images'));
// parse requests of content-type - application/x-www-form-urlencoded


// app.get('/cashfreepayment', function(req, res, next) {
//   res.render('index', { title: 'Cashfree PG simulator' });
// });

app.get("/bikedoctor",(req,res)=>{
  const name = require(__dirname + '/package.json').name;
  res.status(200).json({App_Name:name,message:"API Working"})
})

app.use("/bikedoctor", apiRouter);


// DataBase Connection;
const DB_URL = "mongodb://0.0.0.0:27017/mechanic";
// const DB_URL = process.env.MONGO_URI

db.mongoose
  .connect(DB_URL , {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((data) => {
    console.log(`Mongodb connected with : ${data.connection.host} server`);
  })
  .catch((err) => {
    console.log("mongodb error", err);
});


db.mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});


db.mongoose.connection.on('error', (error) => {
    console.log(error);
});


const port = process.env.PORT || 8088;
server.listen(port , ()=>{
    console.log(`Server is working on port : ${port}`)
})


function errHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
      res.json({
          success: 0,
          message: err.message
      })
  }
}

app.use(errHandler);
app.use(errorMiddleware);