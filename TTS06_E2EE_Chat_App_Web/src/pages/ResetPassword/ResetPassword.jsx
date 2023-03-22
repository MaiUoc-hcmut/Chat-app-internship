import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './ResetPassword.css';
import authImg from './../../assets/img/login1.png';
import { BsFillChatLeftTextFill } from 'react-icons/bs';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import i18n from '../../translation/i18n';
import { toastError, toastSuccess } from '../../utils/toast';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { resetPassword, reset } from '../../redux/userSlice';

const ResetPassword = () => {
	const [values, setValues] = useState({
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
			//console.log('data', data)
			dispatch(resetPassword(data))
		}
    };

	const handleValidation = () => {
		const {password, confirmPassword} = values;
		console.log('newPassword', password)
		console.log('confirmPassword', confirmPassword)
		if (password !== confirmPassword) {
			toastError(t('content.confirmPasswordValid'));
			return false;
		} 
		else if (password.length < 8 || password.length > 30) {
			toastError(t('content.passwordValid'));
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
				t('content.reset-passwordSuccess')
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
			<Row className="reset-password-container main-bg">
				<Col xl={4} lg={5} className="reset-password-wrapper">
					<h3>
						<BsFillChatLeftTextFill fontSize="2.6rem" color="white" />
						<span>Chatgram</span>
					</h3>
					<p className="mt-3">{t('content.intro')}</p>
					<div className="mt-auto reset-password-img-container">
						<img src={authImg} alt="" className="reset-password-img" />
					</div>
				</Col>

				<Col xl={8} lg={7} className="position-relative reset-password-page-content">
					<div className='dropdown-language'>
						<select name='language' onChange={changeLang}>
							<option value='vi'>{t('content.vietnamese')}</option>
							<option value='en'>{t('content.english')}</option>
						</select>
					</div>
					<Row className="my-auto justify-content-center h-100 w-100 px-5 py-5">
						<div className="reset-password-form-wrapper reset-password-input">
							<h2 className="text-center mb-4">{t('content.youraccount')}</h2>
							<form className="reset-password-form" onSubmit={handleSubmit(onSubmit)}>
								<div className="email-field mb-3">
									<label htmlFor="" className="d-block mb-2">
										{t('content.newPassword')}
									</label>
									<input 
										type="passsword" 
										name="newPassword" 
										id="newPassword" 
										className="inp-email w-100" 
										{...register('password')}
										onChange={(e) => handleChange(e)}
									/>
								</div>

								<div className="email-field mb-3">
									<label htmlFor="" className="d-block mb-2">
										{t('content.confirmPassword')}
									</label>
									<input 
										type="passsword" 
										name="confirmPassword" 
										id="confirmPassword" 
										className="inp-email w-100" 
										onChange={(e) => handleChange(e)}
									/>
								</div>

								<input type="submit" value={t('content.changePassword')} className="d-inline-block w-100" />
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


export default ResetPassword;
