const socketIo = require('socket.io');
const UserService = require('./UserService');
const MessageService = require('./MessageService');

class ChatSocketService {
  constructor(port) {
    if (port) {
      this.userService = new UserService();
      this.messageService = new MessageService();
      this.connect(port);
    }
  }

  connect(port) {
    this.io = socketIo(port);
    this.setupConnectionListener(this.io);

    // this.logIntervalId = setInterval(() => {
    //   const sockets = this.io.sockets.clients().sockets;
    //   console.log(Object.keys(sockets));
    //   console.log(`Client connected: ${Object.keys(sockets).length}`)
    // }, 5000);
  }

  setupConnectionListener(io) {
    io.on('connection', this.onConnected.bind(this));
  }

  onConnected(socket){

    socket.on('create_username', (data) => this.registerUser(socket, data));

    socket.on('userMessage', (data) => this.newMessage(socket, data))

    socket.on('get_messages', () => this.getMessages(socket));

    socket.on('remove_user', (data) => this.remove(data));

    socket.on('connected_user', (nickName) => this.getConnectedUser(nickName, socket));
  }


  remove(data) {
     this.userService.removeUser(data.nickName)
  }

  newMessage(socket, data) {
    socket.broadcast.emit('serverMessage', {message : data, username : socket.username});
    this.messageService.addUserMessage(data);
  }

  async getMessages(socket) {
    try {
      let messages = await this.messageService.getMessages();
      socket.emit('get_all_messages', {message: messages});
    } catch (e) {
      console.log(e)
    }
  }

  async getConnectedUser(nickName, socket) {
    const userExist = await this.userService.hasUser(nickName);
    if (userExist) {
      socket.emit('serverUser', userExist);
    }
  }

  async registerUser(socket, data) {
    const userExist = await this.userService.hasUser(data.nickName);
    if (userExist) {
      return socket.emit('serverUser', userExist);
    }
    let user = await this.userService.addUser(data);
    socket.emit('serverUser', user)
  }
}

module.exports = ChatSocketService;
