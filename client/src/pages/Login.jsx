import React, { useState } from 'react';
import '../css/login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { loginFailed, loginStart, loginSuccess } from '../redux/userSlice';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../components/Spinner';

function Login() {
  //to handle state of Email and Password
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  //initialise usenavigate and usedispatch
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //toast functions
  const notify = () =>
    toast.success('Logged In Successfully!', {
      position: 'top-right',
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

  const notifyError = () =>
    toast.error('Invalid Credentials !', {
      position: 'top-right',
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

  //function to call LogIn API
  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    setLoading(true);
    try {
      const request = await axios.post('/api/auth/login', {
        Username,
        Password,
      });
      dispatch(loginSuccess(request.data.user));

      //store the token, username and fullname and in local storage
      localStorage.setItem('token', request.data.token);
      localStorage.setItem('username', request.data.user.Username);
      localStorage.setItem('full_name', request.data.user.Name);
      localStorage.setItem('_id', request.data.user._id);
      notify();
      navigate('/home');
    } catch (error) {
      dispatch(loginFailed());
      notifyError();
      console.log(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <section className='mt-5'>
        <div
          className='card mx-auto mt-2 '
          style={{ width: '75vw', height: '27rem' }}
        >
          <div className='card-body'>
            <div className='row' style={{ height: '100%' }}>
              <div
                className='col-md-5 d-flex flex-column justify-content-center align-items-center'
                id='left-box-login'
              >
                <h4>Welcome Back </h4>
                <div className='mt-2'>
                  <i className='fa-brands fa-twitter fs-1'></i>
                </div>
              </div>
              <div className='col-md-7 '>
                <h4 className='ms-4' id='login-text'>
                  Log In
                </h4>
                <form className='mt-2 px-4' onSubmit={handleLogin}>
                  <input
                    type='text'
                    className='form-control mt-3'
                    placeholder='Username'
                    value={Username}
                    onChange={(e) => setUsername(e.target.value)}
                  ></input>
                  <input
                    type='password'
                    className='form-control mt-3'
                    id='exampleInputPassword1'
                    placeholder='Password'
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                  ></input>
                  <button type='submit' className='mt-3 px-3 btn btn-dark'>
                    Login
                  </button>
                </form>
                <p className='mt-4 ms-4 '>
                  <span className='text-muted'>Don't have an account?</span>{' '}
                  <Link to='/signup' className='text-primary'>
                    Register Here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;
