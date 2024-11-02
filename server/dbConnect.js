const mongoose = require('mongoose');

let isConnected = false;

export const dBConnect = async () => {
   if (isConnected) {
      console.log('Database connection already established');
      return;
   }

   try {
      const db = await mongoose.connect(process.env.MONGODBURL);
      console.log('Database connection established');
      isConnected = true;
   } catch (error) {
      console.log('Database connection error', error);
      isConnected = false;
   }
};
