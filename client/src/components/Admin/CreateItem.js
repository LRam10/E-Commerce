import React, {useState,useContext,useEffect} from 'react'
import ItemContext from '../../context/item/itemContext';
import AlertContext from '../../context/alerts/alertContext';

const CreateItem = () => {
    //ItemContext
    const itemContext = useContext(ItemContext);
    const {addItem,success,error,clearErrors,loading} = itemContext;
    const alertContext = useContext(AlertContext);
    const [item,setItem] = useState({
        sku:'',
        name:'',
        description:'',
        category:'Red_Strings',
        price:0,
        img_url:'',
        qty:0,
        
    });
    useEffect(()=>{
        if(error){
            alertContext.setAlert(error,'danger');
        }
        if(success){
            alertContext.setAlert(success,'success');
            clearErrors();
        }
        //eslint-disable-next-line
    }, [error,success]);
    const {sku,description,category,price,img_url,qty,name} = item;
    const onChange = e => setItem({...item,[e.target.name]:e.target.value});
    const onChangeFile = (e) =>{
        setItem({...item,img_url:e.target.files[0]});
    } 
    const createItem = e =>{
        e.preventDefault();
        const data = new FormData();
        data.append('name',name);
        data.append('sku',sku);
        data.append('description',description);
        data.append('category',category);
        data.append('price',price);
        data.append('qty',qty);
        data.append('img_url',img_url,img_url.name);
        addItem(data);
        setItem({
        sku:'',
        description:'',
        category:'',
        name:'',
        price:0,
        img_url:'',
        qty:0
        })
    }
    return (
        <form  onSubmit={createItem}>
            <div className='form-row mx-auto p-3 bg-light'>
            <div className='from-group col-lg-6'>
                <label htmlFor='name'>Product Name</label>
                <input className='form-control' type='text' name='name' value={name} onChange={onChange} />
            </div>
            <div className='from-group col-lg-6'>
                <label htmlFor='SKU'>SKU</label>
                <input className='form-control' type='text' name='sku' value={sku} onChange={onChange}></input>
            </div>
            <div className='form-group col-lg-8'>
                <label htmlFor='Description'>Description</label>
                <textarea className='form-control' type='text' name='description' value={description} onChange={onChange}></textarea>
            </div>
            <div className='form-group col-lg-8'>
            <label htmlFor='Description'>Category</label>
                <select className='form-control'name='category' value={category} onChange={onChange}>
                    <option value='Red_strings'>Red Strings</option>
                    <option value='Wooden'>Wooden</option>
                    <option value='Paracord'>Paracord</option>
                    <option value='Friendship'>Friendship</option>
                </select>
            </div>
            <div className='form-group col-lg-4'>
                <label htmlFor='Description'>Price</label>
                <input className='form-control' type='number' step='0.01' value={price} name='price' onChange={onChange}></input>
            </div>
            <div className='form-group col-lg-8'>
                <label htmlFor='img-upload'>Upload Image</label>
                <input className='form-control-file' type='file' name='img_url' onChange={onChangeFile}></input>
            </div>
            <div className='form-group col-lg-4'>
                <label htmlFor='Description'>Qty</label>
                <input className='form-control' type='number' value={qty} name='qty' onChange={onChange}></input>
            </div>
                {loading === true ?
                <div className='spinner-border text-primary' role='status'>
                        <span class="sr-only">Loading...</span>
                </div>:<input type='submit' className='btn btn-md btn-dark text-white mt-1' value='Add Item'/>}
              </div>  
        </form>
    )
}

export default CreateItem
