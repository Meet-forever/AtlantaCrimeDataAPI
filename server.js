require('dotenv').config();
const express = require('express');
const mongodb = require('mongodb');
const cors = require('cors');
const PORT = process.env.PORT || 8000;
const allData = require('./Routes/AllData')
const top = require('./Routes/Top')
const search = require('./Routes/Search')
const path = require('path')
const fs = require('fs');

const app = express()

app.use(cors({
    methods: "GET"
}))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.locals.url = "https://atlanta-crime-data-api.herokuapp.com"
// app.locals.url = "http://localhost:8000"

/**
 * main function to run database 
 */
async function main(){
    
    uri = process.env.URI;
    const client = new mongodb.MongoClient(uri,{useNewUrlParser: true, useUnifiedTopology: true});
    try{
        await client.connect();
        const db = client.db(`CrimeDataAPI`);
        const databaseMaxSize = await db.collection('rawCrimeData').countDocuments();
        // To use ejs
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'ejs');
    
        // Static file setup for css and images
        app.use(express.static(__dirname+'/public'))

        
        app.get('/', async(req, res)=>{
            // const col = db.collection('rawCrimeData').aggregate({$project:{ _id: 0}});
            // const result = await col.find().sort({occur_date: -1}).toArray();
            res.render('index');
        })

        // Routes
        app.use('/all', allData({db:db, db_size: databaseMaxSize}));
        app.use('/top', top({db:db, db_size: databaseMaxSize}));
        app.use('/search', search({db:db, db_size: databaseMaxSize}));
        app.get('/download/csv', (req, res)=>{
            let datafilepath = path_joinner(['ScriptPy', 'Data'])
            fs.readdir(datafilepath, (err, files) => {
                if(files){
                    let abspath = path.join(datafilepath, files[0]);   
                    fs.readFile(abspath, (err, data) => {
                        if (data) {
                            res.header({'Content-Type':'text/csv', 
                            'Content-Disposition': `attachment; filename=${files[0]}`
                        });
                        res.send(data);
                    }
                    else{
                        res.status(500).send({'Error' : 'Failed to read the file.'});
                    }
                })
            }
            else res.status(500).send({'Error' : 'Failed to get the file.'})
        })
    })
    
    app.get('*', (req, res)=>{
        res.render('404');
    })

        //Helper function
        const path_joinner = (arr) =>{
            let abspath = __dirname
            arr.forEach( i =>{
                abspath = path.join(abspath, i); 
            })
            return abspath;
        }
        
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
