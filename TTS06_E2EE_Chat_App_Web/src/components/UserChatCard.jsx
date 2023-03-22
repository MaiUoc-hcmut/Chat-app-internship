import React, { useContext } from 'react';
import defaultAvatar from './../assets/img/default-avatar.png';
import Row from 'react-bootstrap/Row';
import Badge from 'react-bootstrap/Badge';
import PropTypes from 'prop-types';
import * as dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { removeNotifications } from './../redux/chatSlice.js';
import { AppContext } from './../context/appContext';
import { useEffect } from 'react';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const UserChatCard = ({ avatar, fullname, isYours, messContent, createAt, chatId }) => {
    const { socket } = useContext(AppContext);
    const dispatch = useDispatch();
    const { countNewMessages, selectedChat } = useSelector((state) => state.chat);
    let unreadMessages = countNewMessages?.[chatId];
    let location = useLocation();
    // console.log(fullname);
    useEffect(() => {
        if (location.pathname.split('/').pop() === chatId) {
            dispatch(removeNotifications(chatId));
            unreadMessages = undefined;
        }
    });

    return (
        <Row className="chat-card-container">
            <div className="d-flex gap-3">
                <div className="me-1 position-relative">
                    <div className="avatar-xs avatar">
                        <img src={avatar === '' ? defaultAvatar : avatar} alt="user-avatar" />
                    </div>

                    <div className="active-status online"></div>
                </div>
                <div className="position-relative chat-user-content">
                    <h5>{fullname}</h5>
                    <p className="last-message sub-text">
                        {' '}
                        {isYours ? <span>Bạn: </span> : null} {messContent}
                    </p>
                </div>
                <div className="d-flex flex-column chat-card-info gap-2">
                    <div className="last-chat-time sub-text">{dayjs(createAt).fromNow(true)}</div>
                    <div>
                        {unreadMessages ? (
                            <Badge bg="danger" className="badge">
                                {unreadMessages}
                            </Badge>
                        ) : null}
                    </div>
                </div>
            </div>
        </Row>
    );
};

UserChatCard.propTypes = {
    avatar: PropTypes.string,
    fullname: PropTypes.string,
};

UserChatCard.defaultProps = {
    avatar: defaultAvatar,
    fullname: 'Nguyễn Văn A',
};

export default UserChatCard;
