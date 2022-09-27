import React from 'react'

const Footer=()=> {
    return (
        <footer className='container-fluid px-3 py-3'>
         <div className='row pt-3'> 
            <div className='col-6 col-sm-6 col-md-3'>
            <ul>
                <li><p><b>Contact Us</b></p></li>
                <li>WBracelets@gmail.com</li>
                <li>+1(832)-455-4305</li>
                <li>Houston, TX 77055</li>
            </ul>
            </div>
            <div className='col-6 col-sm-6 col-md-3'>
            <ul>
                <li><p><b>Social Media</b></p></li>
                <li>Instagram</li>
                <li>Facebook</li>
                <li>Twitter</li>
                <li>YouTube</li>
            </ul>
            </div>
            <div className='col-6 col-sm-6 col-md-3'>
            <ul>
                <li><p><b>Brand</b></p></li>
                <li>Story Behind</li>
                <li>Wholesale</li>
                <li>Ambassador</li>
                <li>Student Discount</li>
                <li>Customize</li>
            </ul>
            </div>
            <div className="col-6 col-sm-6 col-md-3">
            <ul>
                <li><p><b>Help</b></p></li>
                <li>FAQ</li>
                <li>Legal Disclosure</li>
                <li>Other</li>
            </ul>
            </div>
            </div>
            <span className='text-center text-white d-block pt-3'>&copy; 2019 Warrior.com</span>
        </footer>
    
    )
}

export default Footer
