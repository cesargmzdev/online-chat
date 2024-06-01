import { io } from '##/socketServer/socketServerConfig.js';
import { fetchUser, fetchLoggedUser, listRooms } from '##/socketServer/utils.js';

const USERS = new Map();

const events = (socket) => {
  socket.on('setUserId', async (loggedUserToken) => {
    const user = await fetchLoggedUser(loggedUserToken);
    console.log(`new connection ${user}`);
    USERS.set(user, socket.id);
    console.log(`socket ${user} connected`, USERS.get(user), io.engine.clientsCount);
  });

  socket.on('globalChat', (messageData) => {
    if ((messageData.message === '' && messageData.fileUrl === '') || !messageData) {
      socket.emit('error', 'MessageData received error');
      console.log('Message cannot be empty');
      return;
    }
    io.emit('globalChat', { messageData: messageData });
    console.log(`Global - Message: ${messageData.message}`);
  });

  socket.on('roomChat', (messageData) => {
    if (
      (messageData.message === '' && messageData.fileUrl === '') ||
      !messageData.room ||
      !messageData
    ) {
      socket.emit('error', 'MessageData received error');
      console.log('Message cannot be empty');
      return;
    }
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
              room: room,
              message: `created the room ${room} and joined the room`,
              username: loggedUsername,
              time: time
            }
          });
          // Send a notification to the invited user
          io.to(USERS.get(fetchedUserDataUsername)).emit(
            'newRoomNotification',
            `${loggedUsername} created the room ${room} with you`
          );
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
            room: room,
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
        room: room,
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
