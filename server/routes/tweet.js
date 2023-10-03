const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const TweetModel = mongoose.model('TweetModel');
const UserModel = mongoose.model('UserModel');
const authMiddleware = require('../middleware/authorisation');
const multer = require('multer');
const uploadImage = require('../imageUpload');

const upload = multer({
  storage: multer.diskStorage({}),
});

//API to create a tweet
router.post('/', authMiddleware, upload.single('Image'), async (req, res) => {
  try {
    const { Content } = req.body;

    if (!Content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const tweet = new TweetModel({
      ...req.body,
      TweetedBy: req.user._id,
    });

    if (req.file && Content) {
      const upload = await uploadImage(req.file.path);
      tweet.Image = upload;
    }

    await tweet.save();
    return res.status(201).json(tweet);
  } catch (error) {
    return res.json(error);
  }
});

//API to like a tweet
router.post('/:id/like', authMiddleware, async (req, res) => {
  //check if tweet is present in databse
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Tweet not Found' });
  }

  //fetch tweet from database
  const tweet = await TweetModel.findById(req.params.id);

  //if LoggedIn user's id  is not present in Likes array, update it using updateOne method and use $addtoSet to store loggedIn user's id
  if (!tweet.Likes.includes(req.user._id)) {
    await tweet.updateOne(
      {
        $addToSet: { Likes: req.user._id },
      },
      { new: true }
    );

    return res.status(200).json({ message: 'Liked' });
  }

  return res.status(400).json({ message: 'Already Liked' });
});

//API to unlike a tweet
router.post('/:id/dislike', authMiddleware, async (req, res) => {
  //check if tweet is present in databse
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Tweet not Found' });
  }

  //fetch tweet from database
  const tweet = await TweetModel.findById(req.params.id);

  //if LoggedIn user's id is  present in Likes array, update it using updateOne method and use $pull to remove it
  if (tweet.Likes.includes(req.user._id)) {
    await tweet.updateOne(
      {
        $pull: { Likes: req.user._id },
      },
      { new: true }
    );

    return res.status(200).json({ message: 'Disliked' });
  }

  return res.status(400).json({ message: 'Already not liking the tweet' });
});

//API to get details of a tweet
router.get('/:id', authMiddleware, async (req, res) => {
  //check if tweet is present in databse
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Tweet not Found' });
  }

  //fetch tweet from database and populate it with data from UserModel
  const tweet = await TweetModel.findById(req.params.id).populate(
    'TweetedBy',
    'Likes, RetweetBy, Replies'
  );

  return res.status(200).json(tweet);
});

//API to get all tweets
router.get('/', authMiddleware, async (req, res) => {
  //fetch all tweets and populate them and sort them in descending order by the time they were created at
  const tweets = await TweetModel.find()
    .populate('TweetedBy', 'Likes, RetweetBy, Replies')
    .sort({ createdAt: -1 });

  return res.status(200).json(tweets);
});

//API to get a particular user tweet
router.get('/tweets/user/:id', authMiddleware, async (req, res) => {
  //fetch all tweets and populate them and sort them in descending order by the time they were created at
  const tweets = await TweetModel.find({ TweetedBy: req.params.id })
    .populate('TweetedBy', 'Likes, RetweetBy, Replies')
    .sort({ createdAt: -1 });

  return res.status(200).json(tweets);
});

//API to delete a tweet
router.delete('/:id', authMiddleware, async (req, res) => {
  //check if tweet is present in databse
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Tweet not Found' });
  }

  //fetch tweet from database
  const tweet = await TweetModel.findById(req.params.id);

  //check if the tweet to be deleted is being deleted by the user who created it and use .equals() method to check that and use .deleteOne() method to delete
  if (req.user._id.equals(tweet.TweetedBy)) {
    // Remove the tweet ID from the replies array of main tweets
    const mainTweets = await TweetModel.find({ Replies: tweet._id });
    for (const mainTweet of mainTweets) {
      if (mainTweet.Replies.includes(tweet._id)) {
        mainTweet.Replies.pull(tweet._id);
        await mainTweet.save();
      }
    }

    await tweet.deleteOne();
    return res.status(200).json({ message: 'Deleted' });
  } else {
    return res.status(400).json({ message: 'Not Authorized' });
  }
});

//API to retweet a tweet
router.post('/:id/retweet', authMiddleware, async (req, res) => {
  //check if tweet is present in databse
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Tweet not Found' });
  }

  //fetch tweet from database
  const tweet = await TweetModel.findById(req.params.id);

  //check if Logged in user's id is present in RetweetBy Array of the tweet and use updateOne method to update the field
  if (!tweet.RetweetBy.includes(req.user._id)) {
    await tweet.updateOne(
      {
        $addToSet: { RetweetBy: req.user._id },
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: 'Successfully Retweeted the tweet' });
  }

  return res.status(400).json({ message: 'Already Retweeted' });
});

//API to undo retweet a tweet
router.post('/:id/undort', authMiddleware, async (req, res) => {
  //check if tweet is present in databse
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Tweet not Found' });
  }

  //fetch tweet from database
  const tweet = await TweetModel.findById(req.params.id);

  //check if Logged in user's id is present in RetweetBy Array of the tweet and use updateOne method to update the field
  if (tweet.RetweetBy.includes(req.user._id)) {
    await tweet.updateOne(
      {
        $pull: { RetweetBy: req.user._id },
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: 'Successfully Unretweeted the tweet' });
  }

  return res
    .status(400)
    .json({ message: 'You are already not retweeting this' });
});

//API to reply to a tweet
router.post('/:id/reply', authMiddleware, async (req, res) => {
  const parentTweet = await TweetModel.findById(req.params.id);
  const { Content } = req.body;

  if (!Content) {
    return res.status(400).json({ message: 'Content is required' });
  }

  const tweet = new TweetModel({
    ...req.body,
    TweetedBy: req.user._id,
  });
  await tweet.save();

  await parentTweet.updateOne(
    {
      $addToSet: { Replies: tweet._id },
    },
    { new: true }
  );

  return res
    .status(201)
    .json({ message: `Replied successfully`, reply: tweet });
});

module.exports = router;
