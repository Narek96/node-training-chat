import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Input, Button } from 'semantic-ui-react';

class ChatInput extends Component {
  static propTypes = {
    onSubmitMessage: PropTypes.func.isRequired,
  };
  state = {
    message: '',
  };

  render() {
    return (
      <form
        action="../.."
        onSubmit={e => {
          e.preventDefault();
          this.props.onSubmitMessage(this.state.message);
          this.setState({ message: '' })
        }}
      >
        <Input
          type="text"
          placeholder={'Enter message...'}
          value={this.state.message}
          onChange={e => this.setState({ message: e.target.value })}>
        </Input>
        <Button>Send</Button>
      </form>
    )
  }
}

export default ChatInput
