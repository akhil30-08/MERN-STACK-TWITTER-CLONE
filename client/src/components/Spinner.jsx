import React from 'react';

const Spinner = () => {
  return (
    <Spinner animation='border' role='status'>
      <span className='visually-hidden'>Loading...</span>
    </Spinner>
  );
};

export default Spinner;
