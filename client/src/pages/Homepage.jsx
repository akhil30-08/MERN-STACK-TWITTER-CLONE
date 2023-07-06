import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Sidebar from '../components/Sidebar';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Login from './Login';
import { useDispatch } from 'react-redux';
import { updateUser } from '../redux/userSlice';

import { useSelector } from 'react-redux';
import TimelineTweet from '../components/TimelineTweet';
import '../css/tweetlist.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Homepage = () => {
  const dispatch = useDispatch();
  // state to handle Tweet Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //to handle image preview in tweet modal and also content
  const [selectedImage, setSelectedImage] = useState(null);
  const [Image, setImage] = useState(null);
  const [Content, setContent] = useState('');

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
    setImage(file);
  };

  const { currentUser } = useSelector((state) => state.user);

  const config = {
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  };
  //function to post the tweet
  const handlePostTweet = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('Content', Content);
      if (Image) {
        formData.append('Image', Image);
      }

      const submission = await axios.post(
        `http://localhost:8000/api/tweet`,
        formData,
        {
          headers: {
            Authorization: localStorage.getItem('token'),
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      //now update the current user
      const updatedCurrentUser = await axios.get(
        `http://localhost:8000/api/user/${currentUser._id}`,
        config
      );
      dispatch(updateUser(updatedCurrentUser.data));
      setSelectedImage(null);
      setContent('');
      notifyTweetPosted();
    } catch (error) {
      console.log(error);
    }
  };

  //noti to show when user Posts Tweet
  const notifyTweetPosted = () =>
    toast.success('Tweet Posted!', {
      position: 'top-right',
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

  return (
    <>
      {!currentUser ? (
        <Login />
      ) : (
        <>
          <Helmet>
            <title>Homepage</title>
          </Helmet>

          <div className='row'>
            <div className='col-md-3 '>
              <div className='side-bar-row d-flex flex-column align-items-center justify-content-between  '>
                <Sidebar />
              </div>
            </div>

            <div className='col-md-6 second-column'>
              <div className='row my-2'>
                <div className='col-12 d-flex justify-content-between'>
                  <h5 className='ms-1'>Home</h5>
                  <button
                    type='submit'
                    className='btn btn-primary homepage-tweet-btn'
                    onClick={handleShow}
                  >
                    Tweet
                  </button>
                </div>
              </div>

              {/* Tweets section */}
              <div className='row'>
                <div className='col-12'>
                  <TimelineTweet />
                </div>
              </div>
            </div>

            <div className='col-md-3'></div>
          </div>

          {/* for showing modal component */}
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>New Tweet</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handlePostTweet} id='postTweet'>
                <Form.Control
                  as='textarea'
                  rows={4}
                  placeholder='Write your tweet'
                  value={Content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <Form.Control
                  type='file'
                  className='mt-2'
                  style={{ opacity: 0, width: '1rem' }}
                  onChange={handleImageChange}
                  id='tweet-picture-form-input'
                />
              </Form>

              <i
                className='fa-solid fa-image fa-xl'
                onClick={() =>
                  document.getElementById('tweet-picture-form-input').click()
                }
                style={{
                  position: 'absolute',
                  top: '160px',
                  left: '20px',
                  zIndex: '10',
                  cursor: 'pointer',
                }}
              ></i>

              {selectedImage && (
                <span
                  style={{ position: 'absolute', left: '27rem', top: '150px' }}
                  onClick={() => setSelectedImage(null)}
                >
                  <i className='fa-solid fa-rectangle-xmark fa-lg'></i>
                </span>
              )}

              {selectedImage && (
                <img
                  src={selectedImage}
                  alt='Selected'
                  style={{ marginTop: '10px', maxWidth: '100%' }}
                />
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant='secondary' onClick={handleClose}>
                Close
              </Button>
              <Button
                variant='primary'
                onClick={() => {
                  handleClose();
                }}
                type='submit'
                form='postTweet'
              >
                Tweet
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
};

export default Homepage;
