import React, {useState,useContext} from 'react'
import ItemContext from '../../context/item/itemContext';

const CreateItem = () => {
    const itemContext = useContext(ItemContext);
    const [item,setItem] = useState({
        sku:'',
        description:'',
        category:'',
        price:0,
        img_url:'',
        qty:0,
        
    });
    // const {sku,description,category,price,img_url,qty} = item;
    const onChange = e =>{
        setItem({...item,[e.target.name]:e.target.value});
    }
    const createItem = e =>{
        e.preventDefault();
        itemContext.addItem(item);
        setItem({
        sku:'',
        description:'',
        category:'',
        price:0,
        img_url:'',
        qty:0
        })
    }
    return (
        <form className='form-group mx-auto mt-4' onSubmit={createItem}>
            <label htmlFor='SKU'>SKU</label>
            <input className='form-control' type='text' name='sku' onChange={onChange}></input>
            <label htmlFor='Description'>Description</label>
            <input className='form-control' type='text' name='description' onChange={onChange}></input>
            <label htmlFor='Description'>Category</label>
            <select className='form-control'name='category' value={item.category} onChange={onChange}>
                <option value='Red_strings'>Red Strings</option>
                <option value='Wooden'>Wooden</option>
                <option value='Paracord'>Paracord</option>
                <option value='Friendship'>Friendship</option>
            </select>
            <label htmlFor='Description'>Price</label>
            <input className='form-control' type='number' step='0.01' name='price' onChange={onChange}></input>
            <label htmlFor='img-upload'>Upload Image</label>
            <input className='form-control-file' type='file' name='img_url' onChange={onChange}></input>
            <label htmlFor='Description'>Qty</label>
            <input className='form-control' type='number' name='qty' onChange={onChange}></input>
            <input type='submit' className='btn btn-md btn-dark text-white mt-1' value='Add Item'/>
        </form>
    )
}

export default CreateItem
