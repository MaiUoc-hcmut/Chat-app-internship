import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Register.css';
import authImg from './../../assets/img/login1.png';
import { BsFillChatLeftTextFill, BsGoogle, BsFacebook, BsTwitter } from 'react-icons/bs';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import i18n from '../../translation/i18n';
import { toastError, toastSuccess } from '../../utils/toast';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { registerUser, reset } from '../../redux/authSlice';

const Register = () => {
	const [values, setValues] = useState({
		fullname: '',
		email: '',
		password: '',
		confirmPassword: ''
	})

	const {t} = useTranslation();

    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();
	const navigate = useNavigate();
	
    const { isSuccess, isError } = useSelector(state => state.auth);
    const onSubmit = (data) => {
        if(handleValidation()) {
			dispatch(registerUser(data))
		}
    };

	const handleValidation = () => {
		const {fullname, email, password, confirmPassword} = values;
		if (!fullname.length) {
			toastError(t('content.fullnameValid'));
			return false;
		} else if (!email.length) {
			toastError(t('content.emailValid'));
			return false;
		} else if (password !== confirmPassword) {
			toastError(t('content.passwordValid'));
			return false;
		} else if (password.length < 8 || password.length > 30) {
			toastError(t('confirmPasswordValid'));
			return false;
		}
		return true;
	}

	useEffect(() => {
		console.log('isSuccess:', isSuccess)
        if (isSuccess) {
			dispatch(reset());
            navigate('/login')
			toastSuccess(
				t('content.registerSuccess')
			)
        }
		if (isError) {
			dispatch(reset());
		}
    }, [isSuccess, isError, dispatch, navigate, t]);
	const handleChange = (e) => {
		setValues({...values, [e.target.name]: e.target.value});
	}

	const changeLang = (e) => {
		i18n.changeLanguage(e.target.value);
	}
	return (
		<Container fluid>
			<Row className="register-container main-bg">
				<Col xl={4} lg={5} className="register-wrapper">
					<h3>
						<BsFillChatLeftTextFill fontSize="2.6rem" color="white" />
						<span>Chatgram</span>
					</h3>
					<p className="mt-3">{t('content.intro')}</p>
					<div className="mt-auto register-img-container">
						<img src={authImg} alt="" className="register-img" />
					</div>
				</Col>

				<Col xl={8} lg={7} className="position-relative register-page-content">
					<div className='dropdown-language'>
						<select name='language' onChange={changeLang}>
							<option value='vi'>{t('content.vietnamese')}</option>
							<option value='en'>{t('content.english')}</option>
						</select>
					</div>
					<Row className="my-auto justify-content-center h-100 w-100 px-5 py-5">
						<div className="register-form-wrapper register-input">
							<h2 className="text-center mb-4">{t('content.registerHeader')}</h2>
							<form className="register-form" onSubmit={handleSubmit(onSubmit)}>
								<div className="email-field mb-3">
									<label htmlFor="fullname" className="d-block mb-2">
										{t('content.fullname')}
									</label>
									<input	
										type="text" 
										name="fullname" 
										id="fullname" 
										className="inp-fullname w-100" 
										{...register('fullname')}
										onChange={(e) => handleChange(e)} />
								</div>

								<div className="email-field mb-3">
									<label htmlFor="" className="d-block mb-2">
										Email
									</label>
									<input 
										type="email" 
										name="email" 
										id="email" 
										className="inp-email w-100" 
										{...register('email')}
										onChange={(e) => handleChange(e)} />
								</div>

								<div className="password-field mb-3">
									<label htmlFor="" className="d-block mb-2">
										{t('content.password')}
									</label>
									<input 
										type="password" 
										name="password" 
										id="password" 
										className="inp-password w-100" 
										{...register('password')}
										onChange={(e) => handleChange(e)} />
								</div>

								<div className="password-field mb-3">
									<label htmlFor="" className="d-block mb-2">
										{t('content.confirmPassword')}
									</label>
									<input 
										type="password" 
										name="confirmPassword" 
										id="confirmPassword" 
										className="inp-password w-100" 
										onChange={(e) => handleChange(e)} />
								</div>

								<input type="submit" value={t('content.register')} className="d-inline-block w-100" />
							</form>

							<div className="social-register mt-5 text-center">
								<p>{t('content.otherWay')}</p>
								<div className="d-flex gap-4 justify-content-center">
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
								{t('content.alreadyHaveAccount')} <Link to="/login">{t('content.login')}</Link>
							</p>
						</div>
					</Row>
				</Col>
			</Row>
		</Container>
	)
}


export default Register;
