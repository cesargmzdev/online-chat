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

  socket.on('joinRoom', async (input, loggedUserToken, time, reJoin) => {
    const fetchedUserData = await fetchUser(input);
    const loggedUsername = await fetchLoggedUser(loggedUserToken);

    if (fetchedUserData.error) {
      socket.emit('error', 'User not found in the database');
      console.error('User not found in the database');
      return;
    }

    if (loggedUsername.error) {
      socket.emit('error', 'User not found in the database');
      console.error('User not found in the database');
      return;
    }

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
        if (!reJoin) {
          // Only send join messages if it's not a rejoin
          io.to(room).emit('roomChat', {
            messageData: {
              message: `created the room ${room} and joined the room`,
              username: loggedUsername,
              time: time
            }
          });
        }
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
      if (!reJoin) {
        // Only send join messages if it's not a rejoin
        io.to(room).emit('roomChat', {
          messageData: {
            message: `joined the room - ${room}`,
            username: loggedUsername,
            time: time
          }
        });
      }
      listRooms(socket);
    }
  });

  socket.on('listRooms', () => {
    listRooms(socket);
  });

  socket.on('leaveRoom', async (room, loggedUserToken, time) => {
    if (socket.rooms === 1) {
      socket.emit('error', 'You are not in any room');
      console.log('You are not in any room');
      return;
    }
    const loggedUsername = await fetchLoggedUser(loggedUserToken);
    socket.leave(room);
    // logs what rooms the user has left
    console.log('Left rooms:', socket.rooms);
    io.to(room).emit('roomChat', {
      messageData: {
        message: `left the room - ${room}`,
        username: loggedUsername,
        time: time
      }
    });
    listRooms(socket);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id, io.engine.clientsCount);
  });
};

export default events;
