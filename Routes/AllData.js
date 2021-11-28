const {Router} = require('express');

const allData = (props) =>{
    
    const router = Router();
    const db = props.db

    router.get('/rawdata', async (req, res) =>{
        const col = db.collection('rawCrimeData');
        // const result = await col.find({}, {projection: {_id: 0}}).toArray();
        const result = await col.find({}).project({_id:0}).toArray();
        res.send(result);
    })

    router.get('/nbhd_names', async (req, res) =>{
        const col = db.collection('rawCrimeData');
        const result = await col.distinct("neighborhood");
        result.shift();
        res.send(result);
    })

return router;
}

module.exports = allData

