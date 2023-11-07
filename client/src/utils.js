const Base_URL =
  process.env.NODE_ENV !== 'development'
    ? 'https://twitter-akhil-backend.onrender.com'
    : '';

export default Base_URL;
