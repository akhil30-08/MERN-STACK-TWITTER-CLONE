import { Helmet } from 'react-helmet-async';
import Login from './Login';

import { useSelector } from 'react-redux';
import TimelineTweet from '../components/TimelineTweet';
import '../css/tweetlist.css';
import 'react-toastify/dist/ReactToastify.css';

const Homepage = () => {
  //to handle image preview in tweet modal and also content

  const { currentUser } = useSelector((state) => state.user);

  return (
    <>
      {!currentUser ? (
        <Login />
      ) : (
        <>
          <Helmet>
            <title>Homepage</title>
          </Helmet>

          {/* Tweets section */}
          <div className='row mt-3'>
            <div className='col-12 '>
              <TimelineTweet />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Homepage;
