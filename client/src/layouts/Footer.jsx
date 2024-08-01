import React from 'react'

const Footer=()=> {
    return (
        <footer className='px-[64px] py-[50px] bg-[#17151A] text-white'>
         <div className='grid grid-cols-4'> 
            <div className='col-6 col-sm-6 col-md-3'>
            <ul className="flex flex-col gap-3">
                <li className="font-semibold text-[16px] text-[#d60c37] underline-offset-1">Contact Us</li>
                <li>WBracelets@gmail.com</li>
                <li>+1(832)-455-4305</li>
                <li>Houston, TX 77055</li>
            </ul>
            </div>
            <div className='col-6 col-sm-6 col-md-3'>
            <ul className="flex flex-col gap-3">
                <li className="font-semibold text-[16px] text-[#d60c37] underline-offset-1">Social Media</li>
                <li>Instagram</li>
                <li>Facebook</li>
                <li>Twitter</li>
                <li>YouTube</li>
            </ul>
            </div>
            <div className='col-6 col-sm-6 col-md-3'>
            <ul className="flex flex-col gap-3">
                <li className="font-semibold text-[16px] text-[#d60c37] underline-offset-1">Brand</li>
                <li>Story Behind</li>
                <li>Wholesale</li>
                <li>Ambassador</li>
                <li>Student Discount</li>
                <li>Customize</li>
            </ul>
            </div>
            <div className="col-6 col-sm-6 col-md-3">
            <ul className="flex flex-col gap-3">
                <li className="font-semibold text-[16px] text-[#d60c37] underline-offset-1">Help</li>
                <li>FAQ</li>
                <li>Legal Disclosure</li>
                <li>Other</li>
            </ul>
            </div>
            </div>
            <div className='text-center w-full mt-5'>&copy; 2019 Warrior.com</div>
        </footer>
    
    )
}

export default Footer
