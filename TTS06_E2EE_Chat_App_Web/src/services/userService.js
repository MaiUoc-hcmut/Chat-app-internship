import axiosClient from './../axiosConfig'

// const API_URL = process.env.REACT_APP_API_ENDPOINT + '/users';
const getUser = async () => {
    try {
    
        const response = await axiosClient.get('users/me');
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        return response.data;
    } catch (err) {
        return err;
    }
};

const getAllUsers = async () => {
    try {
        const response = await axiosClient.get('users');
        return response.data;
    }catch (err) {
        return err;
    }
}

const userService = {
    getUser,
    getAllUsers
}
export default userService;