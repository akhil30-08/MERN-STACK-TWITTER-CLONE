import { useState } from 'react';
import '../css/login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import LoadingSpinner from '../components/Spinner';
import Base_URL from '../utils';

//import reacttoastify
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
  const navigate = useNavigate();
  //to handle state of signup form fields

  const [Name, setName] = useState('');
  const [Username, setUsername] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');

  //state to handle the loading spinner
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      const request = await axios.post(`${Base_URL}/api/auth/signup`, {
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
      setLoading(true);
    }
  };

  return (
    <>
      <Helmet>
        <title>Signup</title>
      </Helmet>

      <div>
        <h4 className='mt-3 ms-4'>Register</h4>
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
          <button type='submit' className='mt-3 px-3 btn btn-dark'>
            Register
          </button>

          {loading && <LoadingSpinner />}
        </form>
        <p className='mt-4 ms-4 '>
          <span className='text-muted'>Already Registered?</span>{' '}
          <Link to='/' className='text-primary'>
            LogIn Here
          </Link>
        </p>
      </div>
    </>
  );
}

export default Signup;
