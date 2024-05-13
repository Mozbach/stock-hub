import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck, faPersonDigging, faEye } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import defaultLogo from '../assets/stock-hub-logo-4.png';


function Nav() {
  const navigate = useNavigate();
  const location = useLocation();

  const pathMatchRoute = (route) => {
    if(route === location.pathname) {
      return true
    }
  }

  return (
    <>
        <nav className="mainNav">
            {/* We can maybe look at making the logo changeable according to the registering company's logo, if no logo is given, just use the default logo */}
            <img onClick={() => navigate('/')} src={defaultLogo} alt="" className="navLogo" />
            <ul className="navUl">
              <li style={pathMatchRoute('/takestock') ? {color : '#0068b1'} : {}} onClick={() => navigate('/takestock') } className="navLi"><FontAwesomeIcon className="fontAwesomeIconCustom" icon={faListCheck } style={{ fontSize: '18px' }} /><span className="navTextSpan">Take Stock</span></li>

              <li style={pathMatchRoute('/checkstock') ? {color : '#0068b1'} : {}} onClick={() => navigate('/checkstock') } className="navLi"><FontAwesomeIcon className="fontAwesomeIconCustom" icon={faEye} style={{ fontSize: '18px' }} /><span className="navTextSpan">Check Stock</span></li>

              <li style={pathMatchRoute('/profile') ? {color : '#0068b1'} : {}} onClick={() => navigate('/profile') } className="navLi"><FontAwesomeIcon className="fontAwesomeIconCustom" icon={faPersonDigging} style={{ fontSize: '18px' }} /><span className="navTextSpan">Profile</span></li>
            </ul>
        </nav>
    </>
  )
}

export default Nav