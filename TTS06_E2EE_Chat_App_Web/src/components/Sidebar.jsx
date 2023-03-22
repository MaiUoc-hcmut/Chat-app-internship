import React, { useEffect, useState, useRef, useContext } from 'react';
import Row from 'react-bootstrap/Row';
import UserChatCard from './UserChatCard';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { selectChat, addNotifications, removeNotifications, reset } from './../redux/chatSlice.js';
import defaultAvatar from './../assets/img/default-avatar.png';
import UserModal from './UserModal';
import { AppContext } from './../context/appContext';
// import PropTypes from 'prop-types'
import { BiPlus, BiSearch } from 'react-icons/bi';
import userService from '../services/userService';

const getChatInfo = (chats, userId) => {
    const result = [];
    chats.forEach((chat) => {
        const [{ avatar, fullname }] = chat.members.filter((i) => i.id !== userId);
        console.log(chat);
        const author = chat.lastMessage?.author;
        const messContent = chat.lastMessage?.body;
        const createAt = chat.lastMessage?.createAt;
        const isYours = author === userId ? true : false;
        const chatId = chat._id;
        result.push({ avatar, fullname, isYours, messContent, createAt, chatId });
    });

    return result;
};

function Sidebar({ recentChat }) {
    const { socket } = useContext(AppContext);
    const sidebarRef = useRef(null);
    const { user } = useSelector((state) => state.user);
    const { lastMessage } = useSelector((state) => state.chat);
    const [chatArray, setChatArray] = useState([]);
    const dispatch = useDispatch();
    const [modalShow, setModalShow] = useState(false);
    const [listUsers, setlistUsers] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (recentChat) {
            const userId = user._id;
            const res = getChatInfo(recentChat, userId);
            res.sort(function (a, b) {
                return new Date(b.createAt) - new Date(a.createAt);
            });

            res.forEach((chat) => {
                const data = {
                    userId: user._id,
                    fullname: user.fullname,
                    room: chat.chatId,
                };
                // add notifycation if there are messages were sent while user offline
                const x = user.lastSeen.filter((e) => e.chatGroupID === chat.chatId);
                let time = null;
                if (x.length > 0) {
                    time = x[0].time;
                }
                console.log(chat.createAt === time);
                console.log('chat = ' + chat.createAt + ' time = ' + time);
                const temp = new Date(time);
                temp.setSeconds(temp.getSeconds() + 1);
                if (new Date(chat.createAt) > temp) {
                    dispatch(addNotifications(chat.chatId));
                }
                socket.emit('join_room', data);
            });

            setChatArray(res);
        }
    }, [recentChat, user._id, socket, user.fullname, user.lastSeen, dispatch]);

    const navLinkClass = ({ isActive }) => {
        return isActive ? 'nav-link activated' : 'nav-link';
    };

    const onSelectRoom = (roomId, prevRoomId) => {
        if (window.innerWidth < 900) {
            document.querySelector('.sidebar-container').classList.add('hidden');
            document.querySelector('.navbar-container').classList.add('hidden');
            document.querySelector('.chat-container').classList.add('un-hidden');
        }

        const [currentChat] = recentChat.filter((e) => e._id === roomId);
        if (!currentChat) return;
        const [{ avatar: targetAvatar, fullname: targetFullname }] = currentChat?.members.filter(
            (e) => e._id !== user._id
        );

        dispatch(selectChat({ targetAvatar, targetFullname }));
        dispatch(removeNotifications(roomId));
        const data = {
            socketId: socket.id,
            roomId,
            userId: user._id,
            prevRoomId,
        };

        socket.emit('load_room_message', data);
        // dispatch(reset);
    };

    const onSearchUser = () => {
        console.log("Search User")
    }

    useEffect(() => {
        socket.on('direct_chat_existed', (chat) => {
            // console.log(recentChat);
            if (recentChat) {
                onSelectRoom(chat._id, chat._id);
                navigate(`chat/${chat._id}`);
            }
            // onSelectRoom(chat._id, chat._id);
        });
    }, [recentChat, socket]);

    useEffect(() => {
        if (lastMessage) {
            let tempArr = [...chatArray];
            for (let i = 0; i < tempArr.length; i++) {
                if (lastMessage.chatGroupID === tempArr[i].chatId) {
                    tempArr[i].author = lastMessage.author;
                    tempArr[i].messContent = lastMessage.body;
                    tempArr[i].createAt = lastMessage.createAt;
                    tempArr[i].isYours = lastMessage.isYours;
                }
            }
            tempArr.sort(function (a, b) {
                return new Date(b.createAt) - new Date(a.createAt);
            });
            console.log(tempArr);
            setChatArray(tempArr);
        }
    }, [socket, lastMessage]);

    const onCreateDirectChat = async () => {
        try {
            const users = await userService.getAllUsers();
            setlistUsers(users.data.users);
            // console.log(users.data.users);
            setModalShow(true);
        } catch (err) {}
    };
    // console.log(recentChat)
    const { t } = useTranslation();
    return (
        <Row className="pt-4">
            <UserModal show={modalShow} onHide={() => setModalShow(false)} listuser={listUsers} />
            <div className="sidebar-header pt-4 mb-4">
                <h3 className="mb-5">{t('content.title')}</h3>
                <div className="d-flex align-items-center sidebar-search mx-auto">
                    <input
                        type="text"
                        name="sidebar-search"
                        id="sidebar-search"
                        className="d-inline-block bg-light"
                        placeholder={t('content.searchPlaceholder')}
                    />
                    <div className='bg-light' onClick={onSearchUser}>
                        <BiSearch fontSize={'24px'} />
                    </div>
                </div>
            </div>
            <div className="recent-chat my-4">
                <div className="d-flex justify-content-between align-items-center mb-4" onClick={onCreateDirectChat}>
                    <h4>{t('content.privateChatTitle')}</h4>
                    <div className="new-direct-chat">
                        <BiPlus fontSize="22px" />
                    </div>
                </div>
                <ul className="chat-list">
                    {chatArray.length > 0
                        ? chatArray.map((chat, idx) => {
                              const prevRoom = window.location.pathname.split('/').pop();
                              return (
                                  <li key={idx}>
                                      <NavLink
                                          key={idx}
                                          to={`chat/${chat.chatId}`}
                                          className={navLinkClass}
                                          onClick={() => onSelectRoom(chat.chatId, prevRoom)}
                                          ref={sidebarRef}
                                      >
                                          <UserChatCard
                                              avatar={chat.avatar}
                                              fullname={chat.fullname}
                                              isYours={chat.isYours}
                                              messContent={chat.messContent}
                                              createAt={chat.createAt}
                                              chatId={chat.chatId}
                                          />
                                      </NavLink>
                                  </li>
                              );
                          })
                        : null}
                </ul>
            </div>

            <div className="group-chat">
                <h4>{t('content.groupChatTitle')}</h4>
            </div>
        </Row>
    );
}

Sidebar.propTypes = {};

export default Sidebar;
