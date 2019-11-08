import React,{Fragment,useEffect,useContext} from 'react'
import { Link } from 'react-router-dom';
import woodenImg from '../../images/wooden.JPG';
import friendImg from '../../images/friendship.jpg'
import Paracord from '../../images/Paracord.png'
import RedStrings from '../../images/Red_Strings.png'
import AuthContext from '../../context/auth/authContext';

const Home = ()=> {
    const authContext = useContext(AuthContext);
    useEffect(()=>{
        authContext.loadUser();
        //eslint-disable-next-line
    }, []);
    return (
        <Fragment>
        <div className="container-fluid img-cont pt-1">
            <div className="landing-section">
            <h1 className="text-white my-3">Choose Over Thousand of Styles</h1>
            <h1 className="text-white my-3">Makes A Great Gift for Family and Friends</h1>
            <button className="btn btn-light btn-lg text-dark my-3">Shop Now</button>
            </div>
        </div>
        <div className='container-fluid mt-4'>
            <div className='row'>
                <div className='col-lg-4 col-md-4'>
                <div className='card'>
                    <img src={woodenImg} alt='wooden' className='card-img-top'/>
                    <div className='card-body bg-light'>
                        <div className='card-text'>
                            <h5>Wooden</h5>
                            <Link className='btn btn-small btn-dark text-white' to={'/category/wooden'}>Shop</Link>
                        </div>
                    </div>
                </div>
                </div>
                <div className='col-lg-4 col-md-4 '>
                <div className='card'>
                    <img src={RedStrings} alt='wooden' className='card-img-top'/>
                    <div className='card-body bg-light'>
                        <div className='card-text'>
                        <h5>Red Strings</h5>
                        <Link className='btn btn-small btn-dark text-white' to={'/category/red_strings'}>Shop</Link>
                        </div>
                    </div>
                </div>
                </div>
                <div className='col-lg-4 col-md-4'>
                <div className='card'>
                    <img src={Paracord} alt='wooden' className='card-img-top'/>
                    <div className='card-body bg-light'>
                        <div className='card-text'>
                        <h5>Paracord</h5>
                        <Link className='btn btn-small btn-dark text-white' to={'/category/paracord'}>Shop</Link>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
        <div className='fluid-container mt-4 body-content'>
            <img src={friendImg} alt='friendshipImg' className='img-desc'/>
            <div className='body-desc text-white'>
                <h1><b>Friendship Bracelets</b></h1>
                <h3>Simple gifts that mean more</h3>
                <Link to={'/category/friendship'} className='sub-btn'>Explore Now</Link>
            </div>
        </div>
        <div className='fluid-container body-content bg-dark mb-5' style={{marginTop:'4rem'}}>
            <img src={friendImg} alt='friendshipImg' className='img-desc float-right'/>
            <div className='body-desc-2 text-white'>
                <h1><b>Family Tradition</b></h1>
                <h3>What started <b>Warrior Bracelets</b></h3>
                <a href='/about' className='sub-btn'>Learn More</a>
            </div>
        </div>
        </Fragment>
    )
}

export default Home
