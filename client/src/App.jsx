import Login from './pages/Login.jsx';
import { Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup.jsx';
import Homepage from './pages/Homepage.jsx';
import MyProfile from './pages/MyProfile.jsx';
import TweetPage from './pages/TweetPage.jsx';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UsersProfile from './pages/UsersProfile.jsx';
import Spinner from './components/Spinner.jsx';

function App() {
  return (
    <>
      <Routes>
        <Route exact path='/' element={<Login />} />
        <Route exact path='/signup' element={<Signup />} />
        <Route exact path='/home' element={<Homepage />} />
        <Route exact path='/my-profile' element={<MyProfile />} />
        <Route exact path='/user-profile/:id' element={<UsersProfile />} />
        <Route exact path='/tweet/:id' element={<TweetPage />} />
      </Routes>
      <ToastContainer autoClose={600} />
    </>
  );
}

export default App;
