import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Tweet from './Tweet';

const TimelineTweet = () => {
  const [timeline, setTimeline] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timelinetweets = await axios.get('/api/tweet', {
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
  }, [currentUser]);

  return (
    <>
      {timeline && timeline.length > 0 ? (
        timeline.map((tweet) => {
          return <Tweet key={tweet._id} tweet={tweet} setData={setTimeline} />;
        })
      ) : (
        <p className='my-5 mx-5 fs-3 fw-bolder'>
          No tweets for you. Kindly post something🥲
        </p>
      )}
    </>
  );
};

export default TimelineTweet;
