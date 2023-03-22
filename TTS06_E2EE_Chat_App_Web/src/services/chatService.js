import axiosClient from './../axiosConfig';
const getRoomMessages = async (roomId) => {
    try {
        const response = await axiosClient.get(`messages/${roomId}`)
        return response;
    }catch (err) {
        return err;
    }
};

const chatService = {
    getRoomMessages,
};

export default chatService;
