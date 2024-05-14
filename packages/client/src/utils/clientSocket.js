//client socket.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

socket.on('connect', () => console.log('connected to server'));
socket.on('disconnect', () => console.log('disconnected from server'));

export default socket;
