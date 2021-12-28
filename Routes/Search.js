const {Router} = require('express');

const Search = (props) =>{
    const router = Router();
    const db = props.db;
    const db_size = props.db_size;

    router.get('/', async(req, res)=>{
        const col = db.collection('rawCrimeData');
        const {limit, neighborhood, occur_day, npu, type: UC2_Literal, zone, occur_day_number} = req.query
        let query = {}
            if(!limit || parseInt(limit) <= 0 || isNaN(parseInt(limit))){
                res.status(400).render("404", {error_no: 400});
                return;
            }
            if((parseInt(zone) < 1 && parseInt(zone)>7) ||(parseInt(occur_day_number)<1 || parseInt(occur_day_number)>7) ){
                res.status(400).render("404", {error_no: 400});
                return;
            }
        const limitsize = (Number(limit) < db_size) ? parseInt(limit) : db_size;
            if(neighborhood) Object.assign(query, {neighborhood:neighborhood})
            if(occur_day) Object.assign(query, {occur_day: occur_day})
            if(npu) Object.assign(query, {npu: npu})
            if(UC2_Literal) Object.assign(query, {UC2_Literal: UC2_Literal})  
            if(zone) Object.assign(query, {zone: zone}) 
            if(occur_day_number) Object.assign(query, {occur_day_number: occur_day_number}) 
        const result = await col.aggregate([{$match: query},{$project: {_id: 0}}]).limit(limitsize).toArray();
            if(result) res.send(result);
            else res.status(400).render("404", {error_no: 400});
    })


    return router;
}

module.exports = Search;