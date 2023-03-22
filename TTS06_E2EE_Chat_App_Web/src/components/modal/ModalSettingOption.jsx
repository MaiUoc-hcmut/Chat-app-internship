import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import './ModalSettingOption.css';
import { useNavigate } from "react-router-dom";

const ModalSettingOption = ({setIsSetting}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear();
        navigate('/login')
    } 
    
    return (
        <div className="setting-wrapper">
            <div className="modal-setting-container">
                <div className="setting-logout">
                    <button onClick={handleLogout}>{t('content.logout')}</button>
                </div>
                {/* <div className="setting-change-password">
                    Change password
                </div> */}
            </div>
        </div>
    )
}

export default ModalSettingOption;