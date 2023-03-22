import React from 'react';
import i18n from 'i18next';
// import PropTypes from 'prop-types'
import { BsChatLeftTextFill } from 'react-icons/bs';
const GetStarted = (props) => {
    return (
        <div className="getstarted-container mx-auto my-auto">
            <div className="d-flex flex-column justify-content-center align-items-center">
                <div className="icon-big mb-4">
                    {' '}
                    <BsChatLeftTextFill fontSize={'3.2rem'} color="#7269EF" />
                </div>
                <h3 className='mb-3'>{i18n.t("content.greeting")}</h3>
                <p className='mb-5'>{i18n.t("content.greetingIntroduce")}</p>
                <button className="btn-primary">{i18n.t("content.getStartBtn")}</button>
            </div>
        </div>
    );
};

GetStarted.propTypes = {};

export default GetStarted;
