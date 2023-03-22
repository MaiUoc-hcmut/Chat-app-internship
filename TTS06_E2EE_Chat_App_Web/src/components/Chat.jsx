import React, { useState, useEffect, useRef, useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useForm } from 'react-hook-form';
import {
    BiSearch,
    BiPhoneCall,
    BiVideo,
    BiDotsVerticalRounded,
    BiDotsHorizontalRounded,
    BiSmile,
    BiMicrophone,
    BiTime,
} from 'react-icons/bi';
import { BsFillInfoCircleFill, BsArrowLeft } from 'react-icons/bs';
import { MdSend } from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux';
import GetStarted from './GetStarted';
import i18n from 'i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/appContext';
import { addNotifications, lastestMessage, loadMessageRoom } from './../redux/chatSlice';
import {getTimeline} from './../utils/dateFormat'
// import PropTypes from 'prop-types';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const renderMessages = (list, scroll) => {
    const currentUserId = JSON.parse(localStorage.getItem('user'))._id;
    const currentChatId = window.location.pathname.split('/').pop();
    list = list.filter((message) => message.chatGroupID === currentChatId);
    let htmlMessage = [];
    if (list.length === 0){
        return;
    }
    htmlMessage = list.map((message) => {
        const authorId = message.author?._id || message.author;
        return authorId === currentUserId ? (
            <li className="d-flex conversation-item-right" key={message._id} ref={scroll}>
                <div className="conversation-item d-flex align-items-end">
                    <div className="conversation-content flex-grow-1">
                        <div className="message-wrap primary-bgcolor color-white">
                            <div>
                                {message.body}
                                <div className="text-end mt-2">
                                    <BiTime />
                                    <span className="message-time">{dayjs(message.createAt).format('HH:mm')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        ) : (
            <li className="d-flex" key={message._id} ref={scroll}>
                <div className="conversation-item d-flex align-items-end">
                    <div className="conversation-avt me-3 avatar-xs avatar">
                        <img
                            src={message.author?.avatar || message?.avatar}
                            alt=""
                            // width="100%"
                        />
                    </div>
                    <div className="conversation-content flex-grow-1 w-100">
                        <div className="message-wrap secondary-bgcolor text-color-dark">
                            <div>
                                {message.body}
                                <div className="text-end mt-2">
                                    <BiTime />
                                    <span className="message-time">{dayjs(message.createAt).format('h:mm')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        );
    });

    htmlMessage.unshift(
        <div className="chat-day">
            <span className="chat-day-title">{getTimeline(list[0]?.createAt)}</span>
        </div>
    );

    let j = 1;
    // tạo time line nhóm các tin nhắn cùng ngày
    for (let i = 1; i < list.length; i++) {
        if (
            dayjs(list[i].createAt).format('DD/MM/YYYY').toString() !==
            dayjs(list[i - 1].createAt)
                .format('DD/MM/YYYY')
                .toString()
        ) {
            htmlMessage.splice(
                j +1,
                0,
                <div className="chat-day">
                    <span className="chat-day-title">{getTimeline(list[i]?.createAt)}</span>
                </div>
            );
            j++;
        }
        j++;
    }

    return htmlMessage;
};

const Chat = (props) => {
    const { socket } = useContext(AppContext);
    const dispatch = useDispatch();
    const scroll = useRef(null);
    const inp = useRef();
    const location = useLocation();
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const { roomMessage, selectedChat,newDirectChat } = useSelector((state) => state.chat);
    const [listMessage, setListMessage] = useState(roomMessage);
    const user = useSelector((state) => state.user);

    const onSendMessage = (data) => {
        if (!inp.current.value) return;
        console.log(data);
        let message = {
            author: user.user._id,
            avatar: user.user.avatar || '',
            body: inp.current.value,
            chatGroupID: location.pathname.split('/').pop(),
            createAt: new Date(),
            receiver: newDirectChat? newDirectChat[1]: null
        };

        socket.emit('send_message', message);
        setListMessage((prev) => [...prev, message]);
      
        message['isYours'] = true;
        message.createAt = message.createAt.toString();
        dispatch(lastestMessage(message));
        inp.current.value = '';
        inp.current.focus();
    };

    const handleGoback = () => {
        document.querySelector('.sidebar-container').classList.remove('hidden');
        document.querySelector('.navbar-container').classList.remove('hidden');
        document.querySelector('.chat-container').classList.remove('un-hidden');
        navigate('/');
    };

    useEffect(() => {
        socket.on('receive_message', (data) => {
            console.log(data);
            if (data.body || data.avatar || user.user._id !== data.author) {
                // setReceivedMessage((prev) => [...prev, data]);
                setListMessage((prev) => [...prev, data]);
                // console.log(listMessage)
                console.log('alo');
            }
        });
    }, [dispatch, socket, user.user._id]);

    // real time notification
    useEffect(() => {
        socket.on('notification', (data) => {
            if (data.body) {
                console.log(data)
                dispatch(addNotifications(data.chatGroupID));
                data['isYours'] = false;
                data.createAt = data.createAt.toString();
                dispatch(lastestMessage(data));
            }
        });
    }, [dispatch, socket]);

    useEffect(() => {
        if (roomMessage) {
            setListMessage(roomMessage);
        }
    }, [roomMessage]);

    // scroll to last message
    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: 'smooth' });
    }, [listMessage]);

    useEffect(() => {
        socket.on('messages_room', (data) => {
            dispatch(loadMessageRoom(data));
        });
    }, [socket, dispatch]);

    return selectedChat ? (
        <Row className="h-100 ">
            <div className="user-chat position-relative d-flex flex-column">
                <div className="chat-header">
                    <Row className="align-items-center">
                        <Col lg={4} xs={8}>
                            <div className="d-flex align-items-center">
                                <div id="goback" onClick={handleGoback}>
                                    <BsArrowLeft />
                                </div>
                                <div className="me-4 position-relative">
                                    <div className="avatar-xs avatar">
                                        <img
                                            src={selectedChat?.targetAvatar}
                                            alt=""
                                            // className="rounded-circle"
                                            // width="100%"
                                        />
                                    </div>

                                    <div className="active-status online"></div>
                                </div>
                                <div className="flex-grow-1 overflow-hidden">
                                    <p className="chat-header-name">{selectedChat?.targetFullname}</p>
                                    <span className="sub-text">{i18n.t('content.onlineText')}</span>
                                </div>
                            </div>
                        </Col>
                        <Col lg={8} xs={4}>
                            <ul className="chat-header-nav d-flex justify-content-end align-items-center gap-3">
                                <li>
                                    <BiSearch fontSize="22px"/>
                                </li>
                                <li>
                                    <BiPhoneCall fontSize="22px" />
                                </li>
                                <li>
                                    <BiVideo fontSize="22px" />
                                </li>
                                <li>
                                    <BsFillInfoCircleFill fontSize="22px" />
                                </li>
                                <li>
                                    <BiDotsVerticalRounded fontSize="22px" />
                                </li>
                            </ul>
                        </Col>
                    </Row>
                </div>
                <div className="chat-conversation px-3 flex-grow-1 position-relative">
                    <div>
                        <ul className="list-unstyled chat-conversation-list mt-0">
                            {listMessage?.length > 0 ? renderMessages(listMessage, scroll) : null}
                        </ul>
                    </div>
                </div>
                <div className="chat-input mt-auto p-3 p-lg-4">
                    <form id="chatinput-form" onSubmit={handleSubmit(onSendMessage)}>
                        <Row className="align-items-center">
                            <Col className="col-auto">
                                <button className="input-chat-icon">
                                    <BiDotsHorizontalRounded fontSize="22px" color='#6159CB' />
                                </button>
                                <button className="input-chat-icon">
                                    <BiSmile fontSize="22px" color='#6159CB' />
                                </button>
                            </Col>

                            <Col className="h-100">
                                <input
                                    type="text"
                                    {...register('inp_message')}
                                    id="inp-message"
                                    placeholder="Soạn tin nhắn..."
                                    autoComplete="off"
                                    ref={inp}
                                />
                            </Col>

                            <Col className="col-auto">
                                <button className="input-chat-icon">
                                    <BiMicrophone fontSize="22px" color='#6159CB'/>
                                </button>
                                <button type="submit" className="input-chat-icon bg-main">
                                    <MdSend fontSize="22px" />
                                </button>
                            </Col>
                        </Row>
                    </form>
                </div>
            </div>
        </Row>
    ) : (
        <Row className="h-100 ">
            <GetStarted />
        </Row>
    );
};

Chat.propTypes = {};

export default Chat;
