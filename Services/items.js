const Item = require('../models/Item');

exports.list = async function (req, res) {
    try{
        console.log('get all items',req.body);
        let items = await Item.find({}).lean();
        res.send(items);
    }
    catch(error){
        console.log(error);
        res.status(500);
    }
}