import React from 'react';
import { TextField } from '@material-ui/core';

export default React.forwardRef(function TextInput({ ...props }, ref) {
  return (
    <TextField
      css="margin: 0"
      ref={ref}
      fullWidth
      margin="dense"
      variant="outlined"
      {...props}
    />
  );
});
