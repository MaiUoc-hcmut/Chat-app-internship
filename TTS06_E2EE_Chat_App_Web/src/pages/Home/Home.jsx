import React, { useEffect, useState, useRef, useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Chat from '../../components/Chat';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { reset, getUser } from './../../redux/userSlice';
import Loading from '../../components/Loading';
// import { io } from 'socket.io-client';
// import PropTypes from 'prop-types'
import { AppContext } from '../../context/appContext';
import './Home.css';
import ModalProfile from '../../components/modal/ModalProfile';
import ModalSettingOption from '../../components/modal/ModalSettingOption';

const Home = (props) => {
    const chatRef = useRef(null);
    const { socket } = useContext(AppContext);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isSuccess, isError } = useSelector((state) => state.user);
    const { loadMessageRoom } = useSelector((state) => state.chat);
    const [recentChat, setRecentChat] = useState(null);
    const [displayModal, setDisplayModal] = useState(false);
    const [screenchatClassName, setScreenchatClassName] = useState('d-flex');
    const [isSetting, setIsSetting] = useState(false)
    useEffect(() => {
        dispatch(getUser());
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            navigate('/login');
            dispatch(reset());
        }
    }, [isError, navigate, dispatch]);

    useEffect(() => {
        socket.on('direct_chat_created', (newchat) => {
            console.log("a")
            setRecentChat((prev) => [newchat, ...prev]);
            navigate(`chat/${newchat._id}`);
        });
    }, [socket]);

    // realtime chat
    useEffect(() => {
        if (user) {
            socket.emit('add-new-user', user);
            socket.emit('get_list_rooms', user._id);
            socket.on("get-onlineUser", (data) => {
                console.log("hehe");
                console.log(data);
            })
        }
    }, [dispatch, socket, user]);

    useEffect(() => {
        socket.on('room_list', (groupChats) => {
            // console.log(groupChats);
            console.log("a")
            setRecentChat(groupChats.filter((e) => e.members?.length === 2));
        });
    }, [socket]);

    useEffect(() => {
        socket.on('refresh_chat', (groupChats) => {
            setRecentChat(groupChats.filter((e) => e.members?.length === 2));
        });
    }, [socket]);

    useEffect(() => {
        if(displayModal) {
            setScreenchatClassName('modal-displayed')
        } else {
            setScreenchatClassName('d-flex')
        }
    }, [displayModal])

    return (
        <Container fluid className="home-container">
            {!user ? (
                <Loading />
            ) : (
                <>
                    <Row className={screenchatClassName}>
                        <Col className="navbar-container">
                            <Navbar 
                                setDisplayModal={setDisplayModal}
                                setIsSetting={setIsSetting}
                                isSetting={isSetting}
                            />
                        </Col>
                        <Col className="sidebar-container">
                            <Sidebar recentChat={recentChat} />
                        </Col>
                        <Col className="chat-container w-100 overflow-hidden">
                            <Chat/>
                        </Col>
                    </Row>
                    {displayModal && (<div className='over-modal-container'>
                        <ModalProfile setDisplayModal={setDisplayModal} />
                    </div>)}

                    {isSetting && (<div className='over-modal-setting-container'>
                        <ModalSettingOption setIsSetting={setIsSetting} />
                    </div>)}
                </>
            )}
        </Container>
    );
};

Home.propTypes = {};

export default Home;
