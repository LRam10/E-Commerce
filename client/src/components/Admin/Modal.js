import React,{useContext,useState} from 'react'
import ItemContext from '../../context/item/itemContext';
const Modal = ({toggleModal}) => {
    const itemContext = useContext(ItemContext);
    const {sku,description,category,price,qty} = itemContext.currentItem;
    const [item,setItem] = useState(itemContext.currentItem);
    const onChange = (e)=> setItem({...item,[e.target.name]:e.target.value});
    //save changes
    const onSaveEdit = e =>{
        e.preventDefault();
        itemContext.updateItem(item);
        itemContext.clearCurrentItem();
        toggleModal();
    }
    return (
        <div className='modal'>
         <div className="modal-dialog">
           <div className="modal-content">
             <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">{category}</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                     <span aria-hidden="true" onClick={toggleModal}>&times;</span>
                    </button>
             </div>
             <div className="modal-body bg-light">
                  <form className='form-group mx-auto bg-light' onSubmit={onSaveEdit}>
                  <label htmlFor='SKU'>SKU</label>
                    <input className='form-control' type='text' name='sku' defaultValue={sku} onChange={onChange}/>
                    <label htmlFor='Description'>Description</label>
                    <textarea className='form-control' type='text' name='description' defaultValue={description} onChange={onChange}></textarea>
                    <label htmlFor='Description'>Category</label>
                    <select className='form-control'name='category' defaultValue={category} onChange={onChange}>
                        <option value='Red_strings'>Red Strings</option>
                        <option value='Wooden'>Wooden</option>
                        <option value='Paracord'>Paracord</option>
                        <option value='Friendship'>Friendship</option>
                    </select>
                    <label htmlFor='Description'>Price</label>
                    <input className='form-control' type='number' step='0.01' name='price' defaultValue={price} onChange={onChange}/>
                    <label htmlFor='Description'>Qty</label>
                    <input className='form-control' type='number' name='qty' defaultValue={qty} onChange={onChange}/>
                    <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={toggleModal}>Cancel</button>
                    <input type="submit" className="btn btn-primary" value='Save Changes'/>
                   </div>
                  </form>
             </div>
            
         </div>
         </div>
        </div>
    )
}

export default Modal
