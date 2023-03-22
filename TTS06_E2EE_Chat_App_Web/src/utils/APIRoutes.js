const registerRoute = `${process.env.HOST}/api/v1/auth/register`;
const loginRoute = `${process.env.HOST}/api/v1/auth/login`;
const changePasswordRoute = `${process.env.HOST}/api/v1/users/change-password`;
const getChatListRoute = `${process.env.HOST}/api/v1/users/chat-list`;
const addMemberToGroup = `${process.env.HOST}/api/v1/users/add-member-to-group`;
const viewChatRoomMessage = `${process.env.HOST}/api/v1/users/view-chatroom-messages`;
const profileRoute = `${process.env.HOST}/api/v1/users/me`

const Router = {registerRoute, 
                loginRoute, 
                changePasswordRoute, 
                getChatListRoute, 
                addMemberToGroup, 
                viewChatRoomMessage,
                profileRoute
}

export default Router;

