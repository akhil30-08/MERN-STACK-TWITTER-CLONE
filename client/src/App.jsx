import Login from './pages/Login.jsx';
import { Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup.jsx';
import Homepage from './pages/Homepage.jsx';
import MyProfile from './pages/MyProfile.jsx';
import TweetPage from './pages/TweetPage.jsx';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UsersProfile from './pages/UsersProfile.jsx';
import './index.css';
import AuthLayout from './layout/AuthLayout.jsx';
import RootLayout from './layout/RootLayout.jsx';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    if (currentUser === null || !localStorage.getItem('token')) {
      if (pathname !== '/signup') {
        navigate('/');
      }
    }
  }, []);

  return (
    <>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route exact path='/' element={<Login />} />
          <Route exact path='/signup' element={<Signup />} />
        </Route>

        <Route element={<RootLayout />}>
          <Route exact path='/home' element={<Homepage />} />
          <Route exact path='/my-profile' element={<MyProfile />} />
          <Route exact path='/user-profile/:id' element={<UsersProfile />} />
          <Route exact path='/tweet/:id' element={<TweetPage />} />
        </Route>
      </Routes>
      <ToastContainer autoClose={600} />
    </>
  );
}

export default App;
