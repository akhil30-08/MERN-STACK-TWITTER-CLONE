import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import '../css/sidebar.css';
import { logout } from '../redux/userSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Sidebar = () => {
  const { currentUser } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //const notify on logging out
  const notify = () =>
    toast.success('Logged Out Successfully!', {
      position: 'top-right',
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

  //handle logout feature
  const handleLogOut = () => {
    localStorage.clear();
    navigate('/');
    dispatch(logout());
    notify();
  };

  const [PictureToShow, setPictureToShow] = useState(null);
  //now get the profile picture of the current user
  const getProfilePicture = async () => {
    if (
      currentUser.Profile_Picture &&
      !currentUser.Profile_Picture.includes(
        'https://1fid.com/wp-content/uploads/2022/06/no-profile-picture-4-1024x1024.jpg'
      )
    ) {
      const picture = await axios.get(
        `http://localhost:8000/files/${currentUser.Profile_Picture}`,
        { responseType: 'blob' }
      );
      setPictureToShow(URL.createObjectURL(picture.data));
    }
  };

  useEffect(() => {
    getProfilePicture();
  }, [currentUser.Profile_Picture]);

  return (
    <>
      <div className='d-flex flex-column nav-section'>
        <i
          className='fa-brands fa-twitter ms-5 my-3 fa-lg'
          style={{ color: 'rgb(22, 161, 225)' }}
        ></i>
        <NavLink to='/home'>
          <button className='btn btn-primary home-button'>
            <span>
              <i className='fa-solid fa-home' />
            </span>{' '}
            Home
          </button>
        </NavLink>

        <NavLink
          to='/my-profile
        '
        >
          <button type='submit' className='btn btn-primary profile-button'>
            <span>
              <i className='fa-solid fa-user' />
            </span>{' '}
            Profile
          </button>
        </NavLink>

        <NavLink to='/'>
          <button onClick={handleLogOut} className='btn btn-primary'>
            <span>
              <i className='fa-solid fa-right-from-bracket'></i>
            </span>{' '}
            Logout
          </button>
        </NavLink>
      </div>
      <div className='mb-3 d-flex username-info'>
        <NavLink to='/my-profile' className='text-decoration-none '>
          {!PictureToShow ? (
            <img
              src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR82DN9JU-hbIhhkPR-AX8KiYzA4fBMVwjLAG82fz7GLg&s'
              alt='profile-pic'
              className=' side-bar-profile-icon ms-2 img-fluid d-inline-block mb-2'
            />
          ) : (
            <img
              src={PictureToShow}
              alt='profile-pic'
              className=' side-bar-profile-icon ms-4 img-fluid d-inline-block mb-2'
            />
          )}
          <ul
            style={{ listStyleType: 'none' }}
            className='text-black d-inline-block'
          >
            <li>
              <h6>{currentUser.Name}</h6>
            </li>
            <li>
              <p>
                @ <span>{currentUser.Username}</span>
              </p>
            </li>
          </ul>
        </NavLink>
      </div>
    </>
  );
};

export default Sidebar;