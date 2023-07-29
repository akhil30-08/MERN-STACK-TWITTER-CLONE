import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Tweet from './Tweet';
import { useParams } from 'react-router-dom';

const UserProfileTweet = () => {
  let { id } = useParams();

  const [timeline, setTimeline] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timelinetweets = await axios.get(`/api/tweet/tweets/user/${id}`, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });

        setTimeline(timelinetweets.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {!timeline ? (
        <h5 className='my-4 mx-5'>
          User has no tweets. Please Tweet something 😄
        </h5>
      ) : (
        timeline.map((tweet) => {
          return <Tweet key={tweet._id} tweet={tweet} setData={setTimeline} />;
        })
      )}
    </>
  );
};

export default UserProfileTweet;
