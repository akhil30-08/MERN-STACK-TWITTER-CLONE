import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import OffCanvas from '../components/Offcanvas';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import Base_URL from '../utils';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateUser } from '../redux/userSlice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RootLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser === null || !localStorage.getItem('token')) {
      navigate('/');
    }
  }, []);

  // state to handle Tweet Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const config = {
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  };

  //to handle image preview in tweet modal and also content
  const [selectedImage, setSelectedImage] = useState(null);
  const [Image, setImage] = useState(null);
  const [Content, setContent] = useState('');

  //function to post the tweet
  const handlePostTweet = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('Content', Content);
      if (Image) {
        formData.append('Image', Image);
      }

      const submission = await axios.post(`${Base_URL}/api/tweet`, formData, {
        headers: {
          Authorization: localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data',
        },
      });
      //now update the current user
      const updatedCurrentUser = await axios.get(
        `${Base_URL}/api/user/${currentUser._id}`,
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
    setImage(file);
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
    <section>
      <div className='row'>
        {/* SideBar */}
        <div className='col-md-3 d-none d-md-block'>
          <div className='side-bar-row d-flex flex-column align-items-center justify-content-between  '>
            <Sidebar />
          </div>
        </div>

        {/* OutLet */}

        <div className='col-sm-12 col-md-8 col-lg-6 second-column'>
          <div className='row sticky-top-sm bg-white py-1'>
            <div className='col-12 d-flex'>
              <OffCanvas />

              <div className='d-flex justify-content-between' style={{ width: '30rem' }}>
                <h5 className='ms-1 align-self-baseline'>Profile</h5>
                <button
                  type='submit'
                  className='btn btn-primary homepage-tweet-btn me-1 float-end'
                  onClick={handleShow}
                >
                  Tweet
                </button>
              </div>
            </div>
          </div>

          <Outlet />
        </div>

        <div className='col-md-1 col-lg-3 d-none d-md-block'></div>
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
            onClick={() => document.getElementById('tweet-picture-form-input').click()}
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
    </section>
  );
};

export default RootLayout;
