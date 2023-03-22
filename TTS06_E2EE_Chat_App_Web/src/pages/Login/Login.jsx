import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// import PropTypes from 'prop-types'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import * as Yup from 'yup';
import { BsFillChatLeftTextFill, BsGoogle, BsFacebook, BsTwitter } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from './../../redux/authSlice';
import { useTranslation } from 'react-i18next';
import './Login.css';
import authImg from './../../assets/img/login1.png';

const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/g;

const Login = (props) => {
    const { t } = useTranslation();
    const schema = Yup.object().shape({
        email: Yup.string().required(t("content.emailRequired")).matches(emailPattern, t("content.emailInvalid")),
        password: Yup.string().required(t("content.passwordRequired")).min(4, t("content.passwordInvalid")),
    });
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isSuccess } = useSelector((state) => state.auth);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onLoginSubmit = (data) => {
        dispatch(login(data));
    };

    useEffect(() => {
        dispatch(reset());
        if (isSuccess) {
            navigate('/');
        }
        dispatch(reset());
    }, [isSuccess, dispatch, navigate]);

    return (
        <Container fluid>
            <Row className="login-container main-bg ">
                <Col xl={4} lg={5} className="login-wrapper">
                    <h3>
                        <BsFillChatLeftTextFill fontSize="2.6rem" color="white" />
                        <span>{t('content.title')}</span>
                    </h3>
                    <p className="mt-3">{t('content.intro')}</p>
                    <div className="mt-auto login-img-container">
                        <img src={authImg} alt="" className="login-img" />
                    </div>
                </Col>
                <Col xl={8} lg={7} className="position-relative login-page-content">
                    <Row className="my-auto justify-content-center h-100 w-100 px-5 py-5">
                        <div className="login-form-wrapper">
                            <h2 className="text-center mb-4">{t('content.welcomeback')}</h2>
                            <p className="text-center">{t('content.loginToUse')}</p>
                            <form onSubmit={handleSubmit(onLoginSubmit)} className="login-form">
                                <div className="email-field mb-4">
                                    <label htmlFor="inp-email" className="d-block mb-2">
                                        Email
                                    </label>
                                    <input id="email" className="inp-email w-100" {...register('email')} />
                                    {errors.email ? <h6 className="danger mt-2"> {errors.email?.message}</h6> : null}
                                </div>

                                <div className="password-field mb-4">
                                    <label htmlFor="inp-password" className="d-block mb-2">
                                        {t('content.password')}
                                    </label>
                                    <input
                                        id="password"
                                        className="inp-password w-100"
                                        {...register('password')}
                                        type="password"
                                    />
                                    {errors.password ? (
                                        <h6 className="danger mt-2"> {errors.password?.message}</h6>
                                    ) : null}
                                </div>

                                <div className="login-option mb-5 d-flex justify-content-between">
                                    <div>
                                        <input type="checkbox" name="remember-password" id="remember-password" className="inp-password" />
                                        <label htmlFor="remember-password">{t('content.rememberPassword')}</label>
                                    </div>
                                    <Link to="/forgot-password">{t('content.forgotPassword')}</Link>
                                </div>

                                <input type="submit" value={t('content.login')} className="d-inline-block w-100 btn-primary btn-login" />
                            </form>

                            <div className="social-login mt-5 text-center">
                                <p>{t('content.otherWayLogin')}</p>
                                <div className="d-flex gap-4 justify-content-center mt-3">
                                    <div className="facebook-conn">
                                        <BsFacebook fontSize="2.6rem" color="#1877F2" />
                                    </div>
                                    <div className="twitter-conn">
                                        <BsTwitter fontSize="2.6rem" color="#1D9BF0" />
                                    </div>
                                    <div className="google-conn">
                                        <BsGoogle fontSize="2.6rem" color="#E94235" />
                                    </div>
                                </div>
                            </div>

                            <p className="mt-3 text-center">
                                {t('content.dontHaveAccount')} <Link to="/register">{t('content.register')}</Link>
                            </p>
                        </div>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

Login.propTypes = {};

export default Login;
