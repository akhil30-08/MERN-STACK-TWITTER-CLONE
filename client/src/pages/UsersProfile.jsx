import { useState, useEffect } from 'react';
import '../css/tweetlist.css';
import '../css/myprofile.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import Sidebar from '../components/Sidebar';
import Tweet from '../components/Tweet';
import { format } from 'date-fns';
import UserProfileTweet from '../components/UserProfileTweet';
import { updateUser } from '../redux/userSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './Login';

const MyProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //get id from req.params
  let { id } = useParams();

  const { currentUser } = useSelector((state) => state.user);

  const [user, setUser] = useState(null);
  const [followState, setFollowState] = useState(
    currentUser.Following.includes(id) ? 'Following' : 'Follow'
  );

  const config = {
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const findUser = await axios.get(`/api/user/${id}`, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        console.log('fetch data');
        setUser(findUser.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  //to handle follow/unfollow user

  const handleFollowUnfollow = async (e) => {
    e.preventDefault();

    try {
      //if followState==Follow we will follow the user and set the state to Following

      if (followState == 'Follow') {
        const followUser = await axios.put(
          `/api/user/${id}/follow`,
          {},
          config
        );

        //now update the current user
        const updatedCurrentUser = await axios.get(
          `/api/user/${currentUser._id}`,
          config
        );
        dispatch(updateUser(updatedCurrentUser.data));
        notifyFollow();
        setFollowState('Following');
      } else {
        const unfollowUser = await axios.put(
          `/api/user/${id}/unfollow`,
          {},
          config
        );

        //now update the current user
        const updatedCurrentUser = await axios.get(
          `/api/user/${currentUser._id}`,
          config
        );
        dispatch(updateUser(updatedCurrentUser.data));
        notifyUnfollow();
        setFollowState('Follow');
      }
    } catch (error) {
      console.log(error);
    }
  };

  //to handle notifications

  const notifyFollow = () =>
    toast.success('Followed User Successfully!', {
      position: 'top-right',
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

  const notifyUnfollow = () =>
    toast.success('Unollowed User Successfully!', {
      position: 'top-right',
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

  const [PictureToShow, setPictureToShow] = useState(null);
  //now get the profile picture of the current user
  const getProfilePicture = async () => {
    if (user && user.Profile_Picture) {
      const picture = await axios.get(`/files/${user.Profile_Picture}`, {
        responseType: 'blob',
      });
      console.log('ok');
      setPictureToShow(URL.createObjectURL(picture.data));
    }
  };

  useEffect(() => {
    if (user && user.Profile_Picture) {
      getProfilePicture();
    }
  }, [user]);
  return (
    <>
      <Helmet>
        <title>User Profile</title>
      </Helmet>

      {currentUser ? (
        <div className='row'>
          <div className='col-md-3 '>
            <div className='side-bar-row d-flex flex-column align-items-center justify-content-between  '>
              <Sidebar />
            </div>
          </div>

          <div className='col-md-6 second-column'>
            <div className='row my-2'>
              <div className='col-12 d-flex justify-content-between'>
                <h5 className='ms-1'>Profile</h5>
              </div>
            </div>

            {/* Profile section */}
            <div className='row'>
              <div className='col-12'>
                <div className='container mt-2'>
                  {/* blue colour div */}
                  <div id='blue-box'></div>

                  {/* information-box */}
                  <div className='row profile-icon-row'>
                    <div className='col-5'>
                      <span className='ms-3'>
                        {PictureToShow ? (
                          <img
                            src={PictureToShow}
                            className='img-fluid'
                            id='profilePicture'
                          />
                        ) : (
                          <img
                            src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR82DN9JU-hbIhhkPR-AX8KiYzA4fBMVwjLAG82fz7GLg&s'
                            className='img-fluid'
                            id='profilePicture'
                          />
                        )}
                      </span>
                    </div>

                    <div className='col-7 '>
                      <button
                        type='submit'
                        style={{ width: '8rem' }}
                        className='btn btn-dark ms-2 mt-2 float-end me-2'
                        onClick={handleFollowUnfollow}
                      >
                        {followState}
                      </button>
                    </div>
                  </div>

                  {user && (
                    <div className='row'>
                      <div className='col-12'>
                        <h6>{user.Name}</h6>
                        <p className='text-muted'>@{user.Username}</p>

                        {user.DateOfBirth && (
                          <span className='text-muted'>
                            <i className='fa-solid fa-cake-candles me-2'></i>
                            <span className='me-2'>DOB</span>
                            <span>
                              {format(
                                new Date(user.DateOfBirth),
                                'EE MMM dd yyyy'
                              )}
                            </span>
                          </span>
                        )}

                        {user.Location && (
                          <div
                            className='text-muted mx-4'
                            style={{ display: 'inline-block' }}
                          >
                            <i className='fa-solid fa-location-dot me-2'></i>
                            <span className='me-2'>Location</span>
                            <span>{user.Location}</span>
                          </div>
                        )}

                        <div className='text-muted'>
                          <i className='fa-solid fa-calendar me-2'></i>
                          <span className='me-2'>Joined</span>
                          <span>
                            {format(new Date(user.createdAt), 'EE MMM dd yyyy')}
                          </span>
                        </div>

                        {/* followers and following information */}
                        <span className='fw-medium mt-2 '>
                          <span>{user.Following.length}</span>
                          <span className='mx-1'>Following</span>
                        </span>

                        <span
                          className='fw-medium mt-2 mx-4'
                          style={{ display: 'inline-block' }}
                        >
                          <span>{user.Followers.length}</span>
                          <span className='mx-1'>Followers</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <h6 className='text-center mt-3'>Tweets and Replies</h6>
                <UserProfileTweet />
              </div>
            </div>
          </div>

          <div className='col-md-3'></div>
        </div>
      ) : (
        <Login />
      )}
    </>
  );
};

export default MyProfile;
