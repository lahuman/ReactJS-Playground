import React from 'react';
import {
  Typography,
} from '@material-ui/core';

let Row = ({ title, children }) => (
  <div css={`
    display: flex;
    padding: 8px 24px;
  `}>
    {title !== undefined && (
      <Typography noWrap css={`
        width: 150px;
        flex-shrink: 0;
        padding-top: 8px;
      `}>{title}</Typography>
    )}
    <div css="flex: 1">{children}</div>
  </div>
);

export default Row;
