const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const debug = require('debug')('app')
const ejs = require('ejs');
const { MongoClient, ObjectID } = require('mongodb')

//  const adminRoute = require('../adminRoute');
// const moviesRoute = require('./routes/moviesRoute');
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


//  app.use('/admin/movies', adminRoute);
// app.use('/api/movies', moviesRoute );


app.get('/',(req, res)=>{

  const url = process.env.MONGODB_URL || 'mongodb://localhost:27017'
  const dbName = 'moviesApp';
  (async function mongo(){
      let client;
      try{
          client = await MongoClient.connect(url);
          debug('connected with server successfully')

          const db = client.db(dbName);

          const col = await db.collection('movies');

          const movies = col.find().toArray()
          .then( resolve=> res.json( resolve) )

      
          // res.json(movies);
      }catch(error){
          debug(error.stack);

      }
      client.close(); 
  }())
})

app.get('/:id',(req, res) => {
  const { id } = req.params;
  const url = 'mongodb://localhost:27017'
  const dbName = 'moviesApp';
  (async function mongo(){
      let client;
      try{
          client = await MongoClient.connect(url);
          debug('connected with server successfully')

          const db = client.db(dbName);

          const col = await db.collection('movies');

          const movie = await col.findOne({ _id: new ObjectID(id)});
          //  .then( resolve=> res.json( resolve) )
      
           res.json(movie);
      }catch(error){
          debug(error.stack);

      }
      client.close(); 
  }())
})




app.listen(port,() => {
    debug("server running at port"+ port)
})