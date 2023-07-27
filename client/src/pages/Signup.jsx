import React, { useState } from 'react';
import '../css/login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

//import reacttoastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
  const navigate = useNavigate();
  //to handle state of signup form fields

  const [Name, setName] = useState('');
  const [Username, setUsername] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');

  //notification function
  const notify = () =>
    toast.success('Signed Up Successfully!', {
      position: 'top-right',
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

  const notifyError = () =>
    toast.error('Username/Email already exists', {
      position: 'top-right',
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

  //function to submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const request = await axios.post('/api/auth/signup', {
        Name,
        Username,
        Email,
        Password,
      });
      console.log(request.data);
      navigate('/');
      notify();
    } catch (error) {
      notifyError();
      console.log(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Signup</title>
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
                <h4>Join Us </h4>
                <div className='mt-2'>
                  <i className='fa-brands fa-twitter fs-1'></i>
                </div>

                <i className='fa-solid fa-messages' />
              </div>
              <div className='col-md-7'>
                <h4 className='mt-5 ms-4'>Register</h4>
                <form className='mt-2 px-4' onSubmit={handleSubmit}>
                  <input
                    type='text'
                    className='form-control mt-3'
                    placeholder='Full Name'
                    value={Name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete='current-password'
                  ></input>
                  <input
                    type='email'
                    className='form-control mt-3'
                    id='exampleFormControlInput1'
                    placeholder='Email'
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                  ></input>
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
                  <button type='submit' className='mt-3 px-3'>
                    Register
                  </button>
                </form>
                <p className='mt-4 ms-4 '>
                  <span className='text-muted'>Already Registered?</span>{' '}
                  <Link to='/' className='text-primary'>
                    LogIn Here
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

export default Signup;
