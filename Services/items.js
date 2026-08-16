const Item = require('../models/Item');

exports.list = async function (req, res) {
    try{
        console.log('Fetching all items',req.body, req.query);
        const offset = req.query.offset || 0;
        const limit = parseInt(req.query.limit) || 10;
        let items = await Item.find({}).lean().limit(limit);
        res.send(items);
    }
    catch(error){
        console.log(error);
        res.status(500);
    }
}