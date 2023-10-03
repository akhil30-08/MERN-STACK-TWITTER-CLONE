import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import '../css/sidebar.css';
import { logout } from '../redux/userSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import axios from 'axios';

//importing navbar items
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

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
      const picture = await axios.get(`/files/${currentUser.Profile_Picture}`, {
        responseType: 'blob',
      });
      setPictureToShow(URL.createObjectURL(picture.data));
    }
  };

  useEffect(() => {
    getProfilePicture();
  }, [currentUser.Profile_Picture]);

  return (
    <>
      <Navbar expand='lg'>
        <Container>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav
              style={{ height: '100vh' }}
              className='me-auto d-flex flex-column justify-content-between navbarr'
            >
              {/* div containing buttons */}
              <div className='d-flex flex-column nav-section'>
                <i
                  className='fa-brands fa-twitter  my-3 fa-lg'
                  style={{ color: 'rgb(22, 161, 225)' }}
                ></i>
                <NavLink to='/home'>
                  <button className='btn btn-primary home-button mx-lg-4 mx-xl-5'>
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
                  <button
                    type='submit'
                    className='btn btn-primary profile-button mx-lg-4 mx-xl-5'
                  >
                    <span>
                      <i className='fa-solid fa-user' />
                    </span>{' '}
                    Profile
                  </button>
                </NavLink>

                <NavLink to='/'>
                  <button
                    onClick={handleLogOut}
                    className='btn btn-primary mx-lg-4 mx-xl-5'
                  >
                    <span>
                      <i className='fa-solid fa-right-from-bracket'></i>
                    </span>{' '}
                    Logout
                  </button>
                </NavLink>
              </div>

              {/* div containing info */}
              <div className='mb-3 d-flex username-info'>
                <NavLink to='/my-profile' className='text-decoration-none '>
                  {!PictureToShow ? (
                    <img
                      src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR82DN9JU-hbIhhkPR-AX8KiYzA4fBMVwjLAG82fz7GLg&s'
                      alt='profile-pic'
                      className=' side-bar-profile-icon ms-2 ms-md-5 img-fluid d-inline-block mb-4'
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
                    className='text-black d-inline-block me-md-3'
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
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Sidebar;
