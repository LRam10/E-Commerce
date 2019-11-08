import React,{useContext} from 'react'
import ItemContext from '../../context/item/itemContext';
//Destructuring same as props.item
const Item= ({item,toggleModal})=> {
    const {img_url,category,price,description,sku,id} = item
    const itemContext = useContext(ItemContext);
    const onDelete = ()=>{
        itemContext.deleteItem(id);
        itemContext.clearCurrentItem();
    }
    const onEdit = ()=>{
        itemContext.setCurrentItem(item);
        toggleModal();
    }
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