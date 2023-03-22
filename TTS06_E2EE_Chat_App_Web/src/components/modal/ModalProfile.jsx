import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { useTranslation } from "react-i18next";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './ModalProfile.css';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { updateProfile } from "../../redux/userSlice";
import axios from "axios";
import {toastSuccess} from '../../utils/toast';
import ModalButtonUpdate from "./ModalButtonUpdate";

const ModalProfile = ({setDisplayModal}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { register, handleSubmit } = useForm();

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
    const [isEditting, setIsEditting] = useState(false)
    const [toggleDisable, setToggleDisable] = useState(true);
    const [contentButton, setContentButton] = useState(t('content.editProfile'))
    const [classname, setClassname] = useState('fullname-information-hidden')
    const [avatar, setAvatar] = useState(user.avatar)
    const [avatarPreview, setAvatarPreview] = useState(null)
    const [isSelectAvatar, setIsSelectAvatar] = useState(false)

    const { isLoading, isSuccess, isError, message } = useSelector(state => state.auth);

    const [values, setValues] = useState({
        fullname: user.fullname,
        gender: user.gender,
        birthDay: user.birthDay,
        avatar: user.avatar
    })

    const onSubmit = (data) => {
        setIsEditting(false)
        console.log('onSubmit')
        dispatch(updateProfile(data))
    }

    const handleEditButton = async () => {
        setToggleDisable(false)
        setContentButton(t('content.saveChange'))
        setClassname('fullname-information-show')
        setIsEditting(true)
    }

    const handleSubmitAvatar = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('photo', avatar)

        const accessToken = JSON.parse(localStorage.getItem('accessToken'));    
        const configHeaders = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data'
            }
        }

        const data = await axios.post('https://chatapp-server-dev.herokuapp.com/api/v1/users/uploadAvatar', formData, configHeaders)
        //console.log(data)
        toastSuccess(t('content.updateAvatarSuccess'))
        localStorage.setItem('user', JSON.stringify({...user, avatar: data.data.data.url}))
        setIsSelectAvatar(false)
    }
    
    const handleChangeAvatar = (e) => {
        const file = e.target.files[0]
        setAvatar(file)
        file.preview = URL.createObjectURL(file)
        setAvatarPreview(file.preview)
        setValues({...values, avatar: e.target.value})
        setIsSelectAvatar(true)
    }

    useEffect(() => {
        return () => {
            URL.revokeObjectURL(avatarPreview)
        }
    }, [avatarPreview])

    useEffect(() => {
        if(!isEditting) {
            setToggleDisable(true)
            setContentButton(t('content.editProfile'))
            setClassname('fullname-information-hidden')
        }
    }, [isEditting])

    const handleChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value})
    }
    
    return (
        <div className="profile-wrapper">
            <div className="modal-profile-container">
                <div className="header-profile">
                    <div className="header-profile-text">{t('content.accountInformation')}</div>
                    <div className="close-button"><button onClick={() => setDisplayModal(false)}>X</button></div>
                </div>
                <div className="avatar-profile">
                    <img 
                        src={!avatarPreview ? values.avatar : avatarPreview}  
                        alt="avatar"
                        className="image"
                    />
                    <div className="option-on-avatar">
                        <form onSubmit={handleSubmitAvatar}>
                            <div className="change-avatar">
                                <input 
                                    type="file" 
                                    name="avatar-change" 
                                    id="avatar-change" 
                                    //{...register('avatar')}
                                    onChange={handleChangeAvatar}
                                />
                                <label htmlFor="avatar-change">{t('content.changeAvatar')}</label>
                                {isSelectAvatar && <ModalButtonUpdate />}
                            </div>
                        </form>
                    </div>
                </div>
                <div className="profile-detail-wrapper">
                    <div className="profile-detail-header">{t('content.personalInformation')}</div>
                    <div className="profile-detail">
                        <Row>
                            <Col md={4}>
                                <div className="profile-fullname profile-detail-element">
                                    {t('content.fullname')}
                                </div>

                                <div className="profile-gender profile-detail-element">
                                    {t('content.gender')}
                                </div>

                                <div className="profile-birthday profile-detail-element">
                                    {t('content.birthday')}
                                </div>
                            </Col>

                            <Col>
                                <div>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="profile-detail-infor-element">
                                            {
                                                isEditting ? (
                                                    <input 
                                                        type="text" 
                                                        name="fullname-information" 
                                                        id="fullname-information" 
                                                        className={classname}
                                                        value={values.fullname}
                                                        disabled={toggleDisable}
                                                        {...register('fullname')}
                                                        onChange={handleChange}
                                                    />
                                                ) : (
                                                    <div className="values-fullname">{values.fullname}</div>
                                                )
                                            }
                                        </div>

                                        <div className="profile-detail-infor-element">
                                            {
                                                isEditting ? (
                                                    <Row>
                                                        <Col md={4}>
                                                            <input 
                                                                type='radio' 
                                                                id="male" 
                                                                name="gender" 
                                                                value="male" 
                                                                className="gender-option" />
                                                            <label htmlFor="male">{t('content.male')}</label>
                                                        </Col>
                                                        <Col>
                                                            <input 
                                                                type='radio' 
                                                                id="female" 
                                                                name="gender" 
                                                                value="female" 
                                                                className="gender-option" />
                                                            <label htmlFor="male">{t('content.female')}</label>
                                                        </Col>
                                                    </Row>
                                                ) : (
                                                    <div>Nam</div>
                                                )
                                            }
                                            
                                        </div>

                                        <div className="profile-detail-infor-element">
                                            <input 
                                                type="text" 
                                                name="birthday-information" 
                                                id="birthday-information" 
                                                value={values.birthDay}
                                                disabled={toggleDisable}
                                                {...register('birthDay')}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="edit-profile">
                                            {isEditting && <button type="submit">{contentButton}</button>}
                                            {!isEditting && <button type="button" onClick={handleEditButton}>{contentButton}</button>}
                                        </div>
                                    </form>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ModalProfile;