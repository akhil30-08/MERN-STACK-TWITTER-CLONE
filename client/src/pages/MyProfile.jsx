import React from 'react';
import { useEffect, useState } from 'react';
import '../css/tweetlist.css';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Sidebar from '../components/Sidebar';
import Tweet from '../components/Tweet';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import MyProfileTweet from '../components/MyProfileTweet';
import axios from 'axios';
import { updateUser } from '../redux/userSlice';
import '../css/myprofile.css';

const MyProfile = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  // state to handle Edit Profile Modal
  const [showEdit, setShowEdit] = useState(false);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);

  //state to handle Upload Profile Modal
  const [showUpload, setShowUpload] = useState(false);
  const handleCloseUpload = () => setShowUpload(false);
  const handleShowUpload = () => setShowUpload(true);

  //to handle image preview in tweet modal
  const [selectedImage, setSelectedImage] = useState(null);
  const [Profile_Picture, setProfile_Picture] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
    setProfile_Picture(file);
  };

  //to handle edit-profile modal state

  const [validatedEdit, setValidatedEdit] = useState(false);

  //state to handle input fields of edit profile page
  const [Name, setName] = useState('');
  const [Location, setLocation] = useState('');
  const [DateOfBirth, setDateOfBirth] = useState('');

  const config = {
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  };

  //noti to show when user edits information like name,location,dob
  const notifyEditNLDOB = () =>
    toast.success('Edited Successfully!', {
      position: 'top-right',
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

  //noti to show when user edits Profile Picture
  const notifyProfilePic = () =>
    toast.success('Profile Pic Updated!', {
      position: 'top-right',
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

  //function to edit user Name,Location and Date of Birth
  const handleSubmitEdit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      const updateUserInfo = async () => {
        const update = await axios.put(
          `/api/user/${currentUser._id}`,
          { Name, Location, DateOfBirth },
          config
        );
      };
      await updateUserInfo();

      //now update the current user
      const updatedCurrentUser = await axios.get(
        `/api/user/${currentUser._id}`,
        config
      );
      dispatch(updateUser(updatedCurrentUser.data));
      notifyEditNLDOB();
      setName('');
      setLocation('');
      setDateOfBirth('');
      handleCloseEdit();
      setValidatedEdit(false);
    } else {
      setValidatedEdit(true);
    }
  };

  //function to edit profile pic
  const handleUploadImageSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('Profile_Picture', Profile_Picture);
      const submission = await axios.post(
        `/api/user/${currentUser._id}/uploadProfilePic`,
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
        `/api/user/${currentUser._id}`,
        config
      );
      dispatch(updateUser(updatedCurrentUser.data));
      setSelectedImage(null);
      notifyProfilePic();
    } catch (error) {
      console.log(error);
    }
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
      <Helmet>
        <title>My Profile</title>
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
                      className='btn btn-outline-primary ms-5 mt-2'
                      onClick={handleShowUpload}
                    >
                      Upload Profile Picture
                    </button>
                    <button
                      type='submit'
                      className='btn btn-outline-secondary ms-2 mt-2'
                      onClick={handleShowEdit}
                    >
                      Edit
                    </button>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-12'>
                    <h6>{currentUser.Name}</h6>
                    <p className='text-muted'>
                      @<span>{currentUser.Username}</span>
                    </p>

                    {currentUser.DateOfBirth && (
                      <span className='text-muted'>
                        <i className='fa-solid fa-cake-candles me-2'></i>
                        <span className='me-2'>DOB</span>
                        <span>
                          {format(
                            new Date(currentUser.DateOfBirth),
                            'EE MMM dd yyyy'
                          )}
                        </span>
                      </span>
                    )}

                    {currentUser.Location && (
                      <div
                        className='text-muted mx-4'
                        style={{ display: 'inline-block' }}
                      >
                        <i className='fa-solid fa-location-dot me-2'></i>
                        <span className='me-2'>Location</span>
                        <span>{currentUser.Location}</span>
                      </div>
                    )}

                    <div className='text-muted'>
                      <i className='fa-solid fa-calendar me-2'></i>
                      <span className='me-2'>Joined</span>
                      <span>
                        {format(
                          new Date(currentUser.createdAt),
                          'EE MMM dd yyyy'
                        )}
                      </span>
                    </div>

                    {/* followers and following information */}
                    <span className='fw-medium mt-2 '>
                      <span>{currentUser.Following.length}</span>
                      <span className='mx-1'>Following</span>
                    </span>

                    <span
                      className='fw-medium mt-2 mx-4'
                      style={{ display: 'inline-block' }}
                    >
                      <span>{currentUser.Followers.length}</span>
                      <span className='mx-1'>Followers</span>
                    </span>
                  </div>
                </div>
              </div>

              <h6 className='text-center mt-3'>Tweets and Replies</h6>
              <MyProfileTweet />
            </div>
          </div>
        </div>

        <div className='col-md-3'></div>
      </div>

      {/* for showing modal component of edit profile */}
      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            noValidate
            validated={validatedEdit}
            id='EditForm'
            onSubmit={handleSubmitEdit}
          >
            <Row className='mb-3'>
              <Form.Group as={Col} md='12' controlId='validationCustom01'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  required
                  type='text'
                  value={Name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Form.Control.Feedback type='invalid'>
                  Please provide name.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className='mb-3'>
              <Form.Group as={Col} md='12' controlId='validationCustom03'>
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type='text'
                  required
                  value={Location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <Form.Control.Feedback type='invalid'>
                  Please provide location.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Form.Group className='mb-3'>
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                required
                type='date'
                value={DateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
              <Form.Control.Feedback type='invalid'>
                Please provide date of birth.
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseEdit}>
            Close
          </Button>

          <Button variant='primary' type='submit' form='EditForm'>
            Edit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* for showing modal component of upload profile picture */}
      <Modal show={showUpload} onHide={handleCloseUpload}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Profile Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant='primary' style={{ height: '3.2rem' }}>
            Note: The image should be square in shape
          </Alert>
          <Form id='UploadProfilePic' onSubmit={handleUploadImageSubmit}>
            <Form.Control type='file' onChange={handleImageChange} />
          </Form>

          {selectedImage && (
            <img
              src={selectedImage}
              alt='Selected'
              style={{ marginTop: '10px', maxWidth: '100%' }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseUpload}>
            Close
          </Button>
          <Button
            variant='primary'
            onClick={handleCloseUpload}
            type='submit'
            form='UploadProfilePic'
          >
            Save Profile Pic
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MyProfile;
