import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import ForgotPassword from './pages/ResetPassword/ForgotPassword';
// import ChatLayout from './layout/ChatLayout';
import Home from './pages/Home/Home';
//import Chat from './components/Chat';
import Profile from './pages/Profile/Profile';
function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/password-reset/:resettoken" element={<ResetPassword />} />

            <Route path="/*" element={<Home />} />
            {/* <Route path="chat/:id" element={<Chat />} /> */}
            <Route path="profile" element={<Profile />} />

        </Routes>
    );
}

export default App;
