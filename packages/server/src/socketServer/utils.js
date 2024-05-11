const fetchUser = async (username) => {
  const response = await fetch(`http://localhost:3000/findUser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username })
  });
  const data = await response.json();
  return data;
};

const fetchLoggedUser = async (token) => {
  const response = await fetch(`http://localhost:3000/getUser`, {
    headers: {
      Authorization: token
    }
  });
  const data = await response.json();
  return data.user.username;
};

const listRooms = (socket) => {
  const rooms = Array.from(socket.rooms);
  rooms.shift(); // Remove the first room, which is the socket's own room
  // Ensure 'global' is always in the list of rooms
  if (!rooms.includes('global')) {
    rooms.unshift('global');
  }
  for (const room of rooms) {
    console.log(`room added ${room}`);
  }
  socket.emit('roomCount', rooms);
};

export { fetchUser, fetchLoggedUser, listRooms };
