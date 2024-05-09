import { io } from '##/socketServer/socketServerConfig.js';
import { fetchUser, fetchLoggedUser, listRooms } from '##/socketServer/utils.js';

const events = (socket) => {
  socket.on('setUsername', (username) => {
    const users = {};
    users[username] = socket.id;
    console.log(users);
  });

  socket.on('globalChat', (data) => {
    io.emit('globalChat', { message: data });
    console.log(`Global - Message: ${data.message}`);
  });

  socket.on('roomChat', (data) => {
    io.to(data.room).emit('roomChat', { message: data });
    console.log(`Room: ${data.room} - Message: ${data.message}`);
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

      // If the room doesn't exist, create it and add the first user
      if (!io.sockets.adapter.rooms.has(room)) {
        socket.join(room);
        console.log('loggedUser: ', loggedUsername);
        console.log(`room created: ${room}`);
        socket.emit('room', room);
        io.to(room).emit('roomChat', {
          message: {
            message: `created the room ${room} and joined the room`,
            username: loggedUsername,
            time: time
          }
        });
        listRooms(socket);
      }
      // If the room already exists, add the second user
      else {
        socket.join(room);
        console.log('loggedUser: ', loggedUsername);
        console.log(`joined existing room: ${room}`);
        socket.emit('room', room);
        io.to(room).emit('roomChat', {
          message: {
            message: `joined the room`,
            username: loggedUsername,
            time: time
          }
        });
      }
    } else if (fetchedUserData.error) {
      socket.emit('error', fetchedUserData.error);
      console.error('Error:', fetchedUserData.error);
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
