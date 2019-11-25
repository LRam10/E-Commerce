import React,{useContext} from 'react';
import { Link } from 'react-router-dom';
import ItemContext from '../../context/item/itemContext';


const Item= ({item})=> {
    const {img_url,category,price,description,name} = item
    const itemContext = useContext(ItemContext);

    const onSetItem = ()=>{
        itemContext.setCurrentItem(item);
    }
    return (
            <div className='card'>
                <Link to={`/item/${item.name}`} onClick={onSetItem}>
                <img src={img_url} className='card-img-top' alt={`${category}-pic`}/></Link>
                <div className='card-body card-container'>
                    <h4>{name}</h4>
                    <h5>${price}</h5>
                    <div className='card-text'>
                        <p>{description}</p>
                    </div>
                </div>
            </div>
    )
}

export default Item
