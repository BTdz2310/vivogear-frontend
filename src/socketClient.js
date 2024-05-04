import io from 'socket.io-client';

// const socket = io('https://vivogear-backend.vercel.app');
const socket = io('https://vivogear-backend.onrender.com/');
// const socket = io('http://localhost:5001');

export default socket;
