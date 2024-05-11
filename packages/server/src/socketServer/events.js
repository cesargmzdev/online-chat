import { io } from '##/socketServer/socketServerConfig.js';
import { fetchUser, fetchLoggedUser, listRooms } from '##/socketServer/utils.js';

const events = (socket) => {
  socket.on('setUsername', (username) => {
    const users = {};
    users[username] = socket.id;
    console.log('User connected', socket.id, io.engine.clientsCount);
  });

  socket.on('globalChat', (messageData) => {
    io.emit('globalChat', { messageData: messageData });
    console.log(`Global - Message: ${messageData.message}`);
  });

  socket.on('roomChat', (messageData) => {
    io.to(messageData.room).emit('roomChat', { messageData: messageData });
    console.log(`Room: ${messageData.room} - Message: ${messageData.message}`);
  });

  socket.on('joinRoom', async (input, loggedUserToken, time) => {
    const fetchedUserData = await fetchUser(input);
    const loggedUsername = await fetchLoggedUser(loggedUserToken);

    const fetchedUserDataUsername = fetchedUserData.username.username.toString().toLowerCase();
    loggedUsername.toString().toLowerCase();

    console.log(`events: ${fetchedUserDataUsername} - ${loggedUsername}`);

    if (fetchedUserDataUsername === loggedUsername) {
      socket.emit('error', 'You cannot chat with yourself');
      console.log('You cannot chat with yourself');
      return;
    }

    if (fetchedUserData.username && loggedUsername) {
      const room = [loggedUsername, input].sort().join('-');
      console.log('room: ', room);

      // If the user is already in the room, don't add them again
      if (io.sockets.adapter.sids.get(socket.id).has(room)) {
        socket.emit('error', 'You are already in this room');
        console.log('You are already in this room');
        return;
      }

      // If the room doesn't exist in the server, create it and add the first user and return
      if (!io.sockets.adapter.rooms.has(room)) {
        socket.join(room);
        console.log('loggedUser: ', loggedUsername);
        console.log(`room created: ${room}`);
        socket.emit('room', room);
        io.to(room).emit('roomChat', {
          messageData: {
            message: `created the room ${room} and joined the room`,
            username: loggedUsername,
            time: time
          }
        });
        listRooms(socket);
        return;
      }

      // If there is an error fetching the user data, send the error to the client and return
      if (fetchedUserData.error) {
        socket.emit('error', fetchedUserData.error);
        console.error('Error:', fetchedUserData.error);
        return;
      }

      // If the room already exists, add the second user
      socket.join(room);
      console.log('loggedUser: ', loggedUsername);
      console.log(`joined existing room: ${room}`);
      socket.emit('room', room);
      io.to(room).emit('roomChat', {
        messageData: {
          message: `joined the room - ${room}`,
          username: loggedUsername,
          time: time
        }
      });
      listRooms(socket);
    }
  });

  socket.on('listRooms', () => {
    listRooms(socket);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id, io.engine.clientsCount);
  });
};

export default events;
