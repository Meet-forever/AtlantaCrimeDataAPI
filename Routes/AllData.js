const {Router} = require('express');

const allData = (props) =>{
    
    const router = Router();
    const db = props.db
    const db_size = props.db_size

    router.get('/rawdata', async(req, res)=>{
        const col = db.collection('rawCrimeData')
        const {limit} = req.query
            const limitsize = (limit && (Number(limit)>0 && Number(limit) < db_size)) ? parseInt(limit) : db_size;
            const result = await col.aggregate([]).limit(limitsize).project({_id:0}).toArray();
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

