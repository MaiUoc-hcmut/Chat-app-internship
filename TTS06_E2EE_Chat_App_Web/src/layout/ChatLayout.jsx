import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
// import PropTypes from 'prop-types';

import './ChatLayout.css';

function ChatLayout(props) {
    return (
        <>
            <div className="layout">
                <Sidebar />
                <div className="layout__content">
                    <Header />
                    <Outlet />
                </div>
            </div>
        </>
    );
}

ChatLayout.propTypes = {};

export default ChatLayout;
