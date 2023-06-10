const items = require('../Services/items');

test('Should retrive items list',async ()=>{
    const req ={};
    const res ={render:jest.fn()};
    items.list(req,res)
    expect(res.render.mock.calls.length).toBe(1);
})