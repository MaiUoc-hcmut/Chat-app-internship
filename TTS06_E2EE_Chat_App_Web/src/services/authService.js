import axiosClient, {setAuthToken} from './../axiosConfig';
import axios from 'axios';
const login = async (user) => {
    try {
        const response = await axiosClient.post('auth/login', user);
        if (response.data) {
            localStorage.setItem('accessToken', JSON.stringify(response.data.accessToken));
            localStorage.setItem('refreshToken', JSON.stringify(response.data.refreshToken));
            await setAuthToken(response.data.accessToken)
        }
        return response;
    } catch (err) {
        console.log(err);
        return err.response
    }
};

const refreshToken = async (refreshToken) => {
    try {
        const data = {
            refreshToken,
        }
        const response = await axiosClient.post('auth/refresh-token', data);
        if (response.data) {
            localStorage.setItem('accessToken', JSON.stringify(response.data.accessToken));
            localStorage.setItem('refreshToken', JSON.stringify(response.data.refreshToken));
        }
        return response.data;
    } catch (err) {
        return err.response
    }
};

const register = async (user) => {
    try {
        const response = await axios.post('https://chatapp-server-dev.herokuapp.com/api/v1/auth/register', user)
        let data = response
        if(response.status === 200) {
            localStorage.setItem('user', data)
            return {...data, fullname: user.fullname, email: user.email}
        } else {
            return response
        }
    } catch (error) {
        return error;
    }
}

const authService = {
    login,
    refreshToken,
    register
};
export default authService;
