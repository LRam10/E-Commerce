import React,{useContext,useEffect} from 'react'
import ItemContext from '../../context/item/itemContext';
import AlertContext from '../../context/alerts/alertContext';
//Destructuring same as props.item
const Item= ({item,toggleModal})=> {
    const {img_url,category,price,description,sku,_id} = item
    //Item context init
    const itemContext = useContext(ItemContext);
    const {deleteItem,clearCurrentItem,error,setCurrentItem} = itemContext;
    //Alert context
    const alertContext = useContext(AlertContext);
    const onDelete = ()=>{
        if(window.confirm("Are you sure you want to delete this item") == true){
            deleteItem(_id);
            clearCurrentItem();
        }
        else return;
    }
    const onEdit = ()=>{
        setCurrentItem(item);
        toggleModal();
    }
    useEffect(()=>{
        if(error){
            alertContext.setAlert(error,"danger");
        }
    },[error]);
    return (
            <div className='card'>
                <img src={img_url} className='card-img-top' alt={`${category}-pic`}/>
                <div className='card-body'>
                    <span>{sku}</span>
                    <h4>{category}</h4>
                    <h5>${price}</h5>
                    <div className='card-text'>
                        <p>{description}</p>
                    </div>
                    <div className='text-center'>
                        <button className='btn btn-md btn-danger' onClick={onDelete}>Delete</button>
                        <button className='ml-2 btn btn-md btn-success' onClick={onEdit}>Edit</button>
                    </div>
                </div>
            </div>
    )
}

export default Item