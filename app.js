const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const debug = require('debug')('app')
const ejs = require('ejs');
const { MongoClient, ObjectID } = require('mongodb')

 const adminRoute = require('./routes/adminRoute');
const moviesRoute = require('./routes/moviesRoute');
const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var originsWhitelist = [
    'http://localhost:4200',      //this is my front-end url for development
     'http://www.myproductionurl.com'
  ];
  var corsOptions = {
    origin: function(origin, callback){
          var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
          callback(null, isWhitelisted);
    },
    credentials:true
  }
  //here is the magic
  app.use(cors(corsOptions));


 app.use('/admin/movies', adminRoute);
app.use('/api/movies', moviesRoute );

app.set('view engine', ejs)

app.get('/',(req, res)=>{
  res.send('route for movies')
})

app.listen(port,() => {
    debug("server running at port"+ port)
})