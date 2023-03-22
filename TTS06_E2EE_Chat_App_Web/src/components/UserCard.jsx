import React, {useContext} from 'react';
// import PropTypes from 'prop-types';
import defaultAvatar from './../assets/img/default-avatar.png';
import { AppContext } from './../context/appContext';
import { useDispatch } from 'react-redux';
import {addChat, selectChat} from './../redux/chatSlice'

function UserCard({userId, targetId, avatar, fullname, onHide}) {
    const dispacth = useDispatch()
    const { socket } = useContext(AppContext);
    avatar = !avatar? defaultAvatar : avatar

    const onSelectUser = () => {
        const data = {
            socketId: socket.id,
            userId,
            targetId,
        }
        // TODO: tạo mới phòng chat nếu chưa tạo trước đó, ngược lại load tin nhắn cũ
        console.log(data)
        socket.emit('create_direct_chat', data);
        dispacth(addChat([userId, targetId]))
        dispacth(selectChat({ targetAvatar: avatar, targetFullname: fullname }))
        onHide()
    }

    
    return (
        <div className="usercard px-3 py-4 d-flex gap-4 align-items-center" onClick={() => onSelectUser()}>
            <div className="avatar-xs avatar">
                <img src={avatar} alt="user-avatar" />
            </div>
            <p>{fullname}</p>
        </div>
    );
}

UserCard.propTypes = {};

export default UserCard;
