import React from 'react';
import Row from 'react-bootstrap/Row';
import { FaUserCircle } from 'react-icons/fa';
import { BiChat, BiPhoneCall , BiMoon} from 'react-icons/bi';
import { BsFillChatLeftTextFill } from 'react-icons/bs';
import { FiSettings } from 'react-icons/fi';
import {useSelector} from "react-redux"
// import PropTypes from 'prop-types';
import avt from './../assets/img/avt.jpg'

const Navbar = (props) => {
    const { user } = useSelector((state) => state.user);
    return (
        <Row className="flex-lg-column navbar-wrapper pt-4 pb-4 position-relative h-100">
            <div className="d-flex justify-content-center align-items-center navbar-icon">
                <BsFillChatLeftTextFill fontSize={'24px'} color="#7269EF" />
            </div>

            <div className="d-flex justify-content-center align-items-center navbar-icon">
                <FaUserCircle 
                    fontSize={'24px'} 
                    color="#878a92"
                    cursor={'pointer'}
                    onClick={() => props.setDisplayModal(true)}
                />
            </div>

            <div className="d-flex justify-content-center align-items-center navbar-icon active-icon">
                <BiChat fontSize={'24px'} color="#878a92" />
            </div>

            <div className="d-flex justify-content-center align-items-center navbar-icon">
                <BiPhoneCall fontSize={'24px'} color="#878a92" cursor={'pointer'} />
            </div>

            <div className="d-flex justify-content-center align-items-center navbar-icon">
                <FiSettings 
                    fontSize={'24px'} 
                    color="#878a92" 
                    cursor={'pointer'} 
                    onClick={() => props.setIsSetting(!props.isSetting)}
                />
            </div>

            <div className="d-flex justify-content-center align-items-center navbar-icon">
                <BiMoon fontSize={'24px'} color="#878a92" cursor={'pointer'} />
            </div>

            <div className="d-flex justify-content-center align-items-center navbar-icon mt-auto rounded-circle">
                <div className="avatar-xs avatar">
                    <img src={user.avatar} alt="" />
                </div>
            </div>
        </Row>
    );
};

Navbar.propTypes = {};

export default Navbar;
