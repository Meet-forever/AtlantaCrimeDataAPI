require('dotenv').config();
const express = require('express');
const mongodb = require('mongodb');
const cors = require('cors');
const PORT = process.env.PORT || 8000;
const allData = require('./Routes/AllData')
const top = require('./Routes/Top')
const path = require('path')

const app = express()

app.use(cors({
    methods: "GET"
}))
app.use(express.urlencoded({extended:true}))
app.use(express.json())

/**
 * main function to run database 
 */
async function main(){
    
    uri = process.env.URI;
    const client = new mongodb.MongoClient(uri,{useNewUrlParser: true, useUnifiedTopology: true});
    try{
        await client.connect();
        const db = client.db(`CrimeDataAPI`);

        // To use ejs
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'ejs');
       
        // Static file setup for css and images
        app.use(express.static(__dirname+'/public'))

        // Routes
        app.use('/all', allData({db}));
        app.use('/top', top({db}));
        
        app.get('/', async(req, res)=>{
            // const col = db.collection('rawCrimeData').aggregate({$project:{ _id: 0}});
            // const result = await col.find().sort({occur_date: -1}).toArray();
            res.render('index');
        })

        app.get('/download/csv', (req, res)=>{
            res.redirect('https://www.atlantapd.org/home/showpublisheddocument/4470/637728271158000000');
        })

        app.get('*', (req, res)=>{
            res.render('404');
        })
        
    }
    catch(e){
        console.error(e)
    }
}

main().catch(console.error)

//await listDB(client); to call the function
/**
 * It prints all the available
 * @param {mongodb.MongoClient} client to connect and use database and collections. 
 */
async function listDB(client){
    const list = await client.db().admin().listDatabases()
    list.databases.forEach(i =>  console.log(`-${i.name}`))
}


// await listCol(client, <database_name>); to call the function
/**
 * It prints all the collection in the database.   
 * @param {mongodb.MongoClient} client to connect and use the database and collections.
 * @param {string} database_name to access and print defined collections of a database. 
 */
async function listCol(client, database_name){
    const list = await client.db(database_name).listCollections().toArray();
    list.forEach(i => console.log(`-${i.name}`))
}

app.listen(PORT, ()=>  console.log(`Listening on PORT:${PORT}`))