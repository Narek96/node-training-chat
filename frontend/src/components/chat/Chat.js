import React, { Component } from 'react';
import ChatInput from './ChatInput';
import { Input, Container, Label, Button } from 'semantic-ui-react';
import ChatMessage from './ChatMessage';

import io from 'socket.io-client';
const socket = io('http://chat.local/');


class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      nickName: '',
      serverName: '',
      messages: [],
    };
  }

  componentDidMount() {
    socket.on('serverUser', (name) => {
      this.setState({serverName: name})
    });

    socket.on('serverMessage', (data) => {
      if (this.state.serverName !== data.message.name) {
        this.addMessage(data.message);
      }
    });
    console.log(this.state.name)
  }

  addMessage = message => {
    this.setState(state => ({messages: [message, ...state.messages]}));
  };

  formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm;
  };


  removeUser = () => {
    const nickName = this.state.name;
    socket.emit("remove_user", {nickName: nickName, socketId: socket.id});
    socket.close(socket.id);
    this.setState({nickName: '', name: '', messages: []});
    console.log("Socket Closed. ");
  };

  submitMessage = messageString => {
    const message = {
      name: this.state.nickName,
      message: messageString,
      date: this.formatAMPM(new Date())
    };

    socket.emit('connected_user', message.name);
    socket.emit('userMessage', message);
    if (this.state.serverName === this.state.nickName) {
      this.addMessage(message);
    }
  };

  getAllMessages = () => {
    if (socket.id) {
      socket.emit('get_messages', () => {
      });
      socket.on('get_all_messages', (data) => {
        let parsedArray = [];
        data.message.forEach(message => {
          parsedArray.push(JSON.parse(message))
        });
        this.setState({messages: parsedArray.reverse()})
      });
    }
  };

  onSave = () => {
    const nickName = this.state.name;
    if (nickName) {
      socket.connect();
      socket.emit('create_username', {nickName: nickName});
      this.setState({nickName: nickName});
      this.getAllMessages();
    }
  };

  render() {
    return (
      <Container>
        <Label htmlFor="name">
          Name:&nbsp;
          <Input
            type="text"
            id={'name'}
            placeholder={'Enter your name...'}
            value={this.state.name}
            onChange={e => this.setState({name: e.target.value})}>
            <input/>
            <Button.Group floated='left'>
              <Button onClick={this.onSave}>Connect</Button>
              <Button onClick={this.removeUser}>Disconnect</Button>
              <Button onClick={this.getAllMessages}>Get messages</Button>
            </Button.Group>
          </Input>
        </Label>

        {!!this.state.nickName &&
        <ChatInput
          onSubmitMessage={messageString => this.submitMessage(messageString)}
        />
        }

        {!!this.state.nickName && this.state.messages.map((message, index) =>
          <ChatMessage
            key={index}
            message={message.message}
            name={message.name}
            date={message.date}
          />
        )}
      </Container>
    )
  }
}

export default Chat
