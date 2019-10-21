const express = require('express');
const debug = require('debug')('app:moviesRoute');
const { MongoClient, ObjectID } = require('mongodb')

const moviesRoute = express.Router();   


moviesRoute.route('/')
.get((req, res) => {
    const url = process.env.MONGODB_URL || 'mongodb://localhost:27017/movieApp'
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

moviesRoute.route('/:id')
.get((req, res) => {
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


module.exports = moviesRoute;