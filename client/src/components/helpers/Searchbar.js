import React, { Fragment,useContext,useRef,useEffect } from 'react';
import ItemContext from '../../context/item/itemContext';

const Searchbar = () => {
const itemContext = useContext(ItemContext);
const { filterItems,clearFilter,filter,items } = itemContext;
const text = useRef(' ');

useEffect(()=>{
    if(filter === null){
        text.current.value='';
    }
    clearFilter();
    // eslint-disable-next-line
},[items])
const onSearch = e=>{
        if(text.current.value !== '')
            filterItems(e.target.value);
        else
            clearFilter();
    }
    return (
        <Fragment>
            <form className="input-group w-25">
             <input ref={text} type="text" name="filter" className="form-control" onChange={onSearch}></input>
             <div className="input-group-prepend">
            <span className="input-group-text"><i className="fas fa-search"></i></span>
            </div>
            </form>
        </Fragment>
    )
}

export default Searchbar;
