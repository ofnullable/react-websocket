import React, { useState, useRef } from 'react';
import { TextField } from '@material-ui/core';

const ChatInput = ({ value, handleChange }) => {
  const ref = useRef();

  return (
    <form>
      <TextField
        inputRef={ref}
        fullWidth
        id="message"
        label="Message"
        value={value}
        margin="normal"
        variant="outlined"
        onChange={handleChange}
      />
    </form>
  );
};

export default ChatInput;
