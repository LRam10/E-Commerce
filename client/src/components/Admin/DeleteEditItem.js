import React,{useState} from 'react'
import Item from '../Admin/Item'
import Modal from '../Admin/Modal'

const DeleteEditItems = (props) => {
    const [modal,setModal] = useState(false);
    const {items} = props;
    //Close/Open Modal coming from Item and Modal components
    const toggleModal = ()=>{
        setModal(!modal);
    }
    return (
        <div className='container-fluid mt-4'>
            <div className='row'>
             {items.map(item =>(
            <div className='col-lg-4 mb-3' key={item._id}>
               <Item item={item} toggleModal={toggleModal}></Item>
           </div>
            ))}
            {modal === true && (
                <Modal toggleModal={toggleModal}/>
            )}
            </div> 
         </div>
    )
}

export default DeleteEditItems
