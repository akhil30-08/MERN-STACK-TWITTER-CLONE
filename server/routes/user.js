const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const UserModel = mongoose.model('UserModel');
const TweetModel = mongoose.model('TweetModel');
const authMiddleware = require('../middleware/authorisation');
// const { upload } = require('../multer-configuration/profile-image');
const uploadImage = require('../imageUpload');
const multer = require('multer');
const upload = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 5000000000 },
});

// API to get details of a user
router.get('/user/:id', authMiddleware, async (req, res) => {
  try {
    //shows "Invalid UserId" when User's Object Id is invalid
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send('Invalid user ID');
    }

    //fetch user with the id coming from req.params.id and exclude the field "Password using .select method"
    const user = await UserModel.findById(req.params.id)
      .select('-Password')
      .populate('Followers', 'Following');

    return res.status(200).json(user);
  } catch (error) {
    // To handle errors
    return res.status(404).send(error);
  }
});

// API to follow a user
router.put('/user/:id/follow', authMiddleware, async (req, res) => {
  const loggedInUser = await UserModel.findById(req.user.id);
  const userToFollow = await UserModel.findById(req.params.id);

  //check if user is not following himself
  if (req.params.id == req.user.id) {
    return res.status(400).send('You cannot follow yourself');
  }

  //check if user to follow doesn't exist
  if (!userToFollow) {
    return res.status(404).send('User not found');
  }

  //check if loggedInUser is already following userToFollow
  if (loggedInUser.Following.includes(userToFollow._id)) {
    return res.status(400).send('You are already following this user');
  }

  //if user to follow exists, update Followers and Following Array of both Users
  await loggedInUser.updateOne({
    $addToSet: { Following: userToFollow.id },
  });

  await userToFollow.updateOne({
    $addToSet: { Followers: loggedInUser.id },
  });

  return res
    .status(200)
    .send(
      `Followed user Successfully with id: ${userToFollow.id} and name: ${userToFollow.Name}`
    );
});

// API to unfollow a user
router.put('/user/:id/unfollow', authMiddleware, async (req, res) => {
  const loggedInUser = await UserModel.findById(req.user.id);
  const userToUnfollow = await UserModel.findById(req.params.id);

  //check if user is not following himself
  if (req.params.id == req.user.id) {
    return res.status(400).send('You cannot unfollow yourself');
  }

  //check if user to unfollow doesn't exist
  if (!userToUnfollow) {
    return res.status(404).send('User not found');
  }

  //check if loggedInUser is already not following userToFollow
  if (!loggedInUser.Following.includes(userToUnfollow._id)) {
    return res.status(400).send('You are already not following this user');
  }

  //if user to unfollow exists, update Followers and Following Array of both Users
  await loggedInUser.updateOne({
    $pull: { Following: userToUnfollow.id },
  });

  await userToUnfollow.updateOne({
    $pull: { Followers: loggedInUser.id },
  });

  return res
    .status(200)
    .send(
      `Unfollowed user Successfully with id: ${userToUnfollow.id} and name: ${userToUnfollow.Name}`
    );
});

//API to edit user's details
router.put('/user/:id', authMiddleware, async (req, res) => {
  //check if user is not editing other users details
  if (req.params.id !== req.user.id) {
    return res.status(400).send("You cannot edit other's details");
  }

  // take fields from req.body
  const { Name, Location, DateOfBirth } = req.body;

  const updatedUser = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      $set: { Name, Location, DateOfBirth },
    },
    { new: true }
  ).select('-Password');

  await updatedUser.save();
  return res
    .status(200)
    .json({ message: 'User Edited Successfully', result: updatedUser });
});

//API to get the user's tweets
router.post('/user/:id/tweets', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).send('User not found');
    }
    // get the tweets from TweetModel collection by using the user coming from req.params id
    const user = await UserModel.findById(req.params.id);
    const tweets = await TweetModel.find({ TweetedBy: user._id });
    return res.status(200).json(tweets);
  } catch (error) {
    console.log(error.message);
    return res.status(404).send(error);
  }
});

//API to upload profile picture
router.post(
  '/user/:id/uploadProfilePic',
  authMiddleware,
  upload.single('Profile_Picture'),
  async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).send('User not found');
      }

      //upload Image
      console.log(req.file);
      const upload = await uploadImage(req.file.path);

      const user = await UserModel.findById(req.params.id);
      user.Profile_Picture = upload;
      await user.save();
      return res
        .status(200)
        .json({ user: user, message: 'Uploaded Succesfully' });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

module.exports = router;
