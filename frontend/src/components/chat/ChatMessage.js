import React from 'react'
import { Message } from 'semantic-ui-react'

export default ({ name, message, date }) =>
  <Message
    header={`${date} ${name}`}
    content={message}
  />

