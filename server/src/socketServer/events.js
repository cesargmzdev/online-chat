import { io } from '##/socketServer/socketServerConfig.js'
import { fetchUser, fetchLoggedUser, listRooms } from '##/socketServer/utils.js'

const events = (socket) => {
  socket.on('setUsername', (username) => {
    const users = {}
    users[username] = socket.id
    console.log(users)
  })

  socket.on('globalChat', (data) => {
    io.emit('globalChat', { message: data })
    console.log(`Global - Message: ${data.message}`)
  })

  socket.on('roomChat', (data) => {
    io.to(data.room).emit('roomChat', { message: data })
    console.log(`Room: ${data.room} - Message: ${data.message}`)
  })

  socket.on('joinRoom', async (input, loggedUserToken, time) => {
    const data = await fetchUser(input)
    const loggedUser = await fetchLoggedUser(loggedUserToken)

    if (data.username && loggedUser) {
      const room = [loggedUser, input].sort().join('-')
      console.log('room: ', room)

      // If the room doesn't exist, create it and add the first user
      if (!io.sockets.adapter.rooms.has(room)) {
        socket.join(room)
        console.log('loggedUser: ', loggedUser)
        console.log(`room created: ${room}`)
        socket.emit('room', room)
        io.to(room).emit(
          'roomChat',
          io.to(room).emit('roomChat', {
            message: {
              message: `created the room`,
              username: loggedUser,
              time: time
            }
          })
        )
        listRooms(socket)
      }
      // If the room already exists, add the second user
      else {
        socket.join(room)
        console.log('loggedUser: ', loggedUser)
        console.log(`joined existing room: ${room}`)
        socket.emit('room', room)
        io.to(room).emit('roomChat', {
          message: {
            message: `joined the room`,
            username: loggedUser,
            time: time
          }
        })
      }
    } else if (data.error) {
      socket.emit('error', data.error)
      console.error('Error:', data.error)
    }
  })

  socket.on('listRooms', () => {
    listRooms(socket)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id, io.engine.clientsCount)
  })
}

export default events
