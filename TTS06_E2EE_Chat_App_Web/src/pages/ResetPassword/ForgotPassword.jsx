import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './ForgotPassword.css';
import authImg from './../../assets/img/login1.png';
import { BsFillChatLeftTextFill, BsGoogle, BsFacebook, BsTwitter } from 'react-icons/bs';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import i18n from '../../translation/i18n';
import { toastError, toastSuccess } from '../../utils/toast';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { sendVerifyEmail, reset } from '../../redux/userSlice';

const ForgotPassword = () => {
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
		dispatch(sendVerifyEmail(data))
    };

	// const handleValidation = () => {
	// 	return true;
	// }

	useEffect(() => {
		console.log('isSuccess:', isSuccess)
        if (isSuccess) {
			dispatch(reset());
            navigate('/login')
			toastSuccess(
				t('content.linkResetSent')
			)
        }
		if (isError) {
			dispatch(reset());
		}
    }, [isSuccess, isError]);
	const handleChange = (e) => {
		setValues({...values, [e.target.name]: e.target.value});
	}
	const changeLang = (e) => {
		i18n.changeLanguage(e.target.value);
	}
	return (
		<Container fluid>
			<Row className="sendemail-container main-bg">
				<Col xl={4} lg={5} className="sendemail-wrapper">
					<h3>
						<BsFillChatLeftTextFill fontSize="2.6rem" color="white" />
						<span>Chatgram</span>
					</h3>
					<p className="mt-3">{t('content.intro')}</p>
					<div className="mt-auto sendemail-img-container">
						<img src={authImg} alt="" className="sendemail-img" />
					</div>
				</Col>

				<Col xl={8} lg={7} className="position-relative sendemail-page-content">
					<div className='dropdown-language'>
						<select name='language' onChange={changeLang}>
							<option value='vi'>{t('content.vietnamese')}</option>
							<option value='en'>{t('content.english')}</option>
						</select>
					</div>
					<Row className="my-auto justify-content-center h-100 w-100 px-5 py-5">
						<div className="sendemail-form-wrapper sendemail-input">
							<h2 className="text-center mb-4">{t('content.youraccount')}</h2>
							<form className="sendemail-form" onSubmit={handleSubmit(onSubmit)}>
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

								<input type="submit" value={t('content.sentVerifyCode')} className="d-inline-block w-100" />
							</form>
                            
                            <p className="mt-3 text-center">
								{t('content.wantToHaveNewAccount')} <Link to="/register">{t('content.register')}</Link>
							</p>

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


export default ForgotPassword;
