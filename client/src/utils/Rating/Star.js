import React from 'react';
import PropTypes from 'prop-types';
const Star = ({selected=false,onSelect}) => {
  return (
    <div>
      <i className={(selected)? 'fa fa-star text-black':'far fa-star text-dark' } onClick={onSelect}></i>
    </div>
  )
}

Star.propTypes ={
    selected:PropTypes.bool,
    onSelect:PropTypes.func
}

export default Star