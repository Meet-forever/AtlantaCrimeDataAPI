const {Router} = require('express');

const top = (props) =>{
    
    const router = Router();
    const db = props.db

    router.get('/nbhds', async(req, res)=>{
        const result = await db.collection('topCrimeNeighborhoods').find().toArray();
        res.send(result);
    })

    router.get('/nbhds/:num', async(req, res) =>{
        let prm = req.params.num;
        if (!isNaN(prm) && Number(prm) > 0) {
            prm = Number(prm);
            const col = db.collection('topCrimeNeighborhoods');
            const size = await col.estimatedDocumentCount()
            if (prm <=size){
                const result = await col.find({}).limit(prm).toArray();
                res.send(result)
            }
            else res.status(400).send([-1]);
        }
        else res.status(400).send("Bad Request");
    });

return router;
}

module.exports = top

