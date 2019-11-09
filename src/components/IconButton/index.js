import React from 'react';
import {Icon} from 'react-native-elements';

import {Container} from './styles';

export default function IconButton({name, type, color, size = 25, ...rest}) {
  return (
    <Container {...rest}>
      <Icon
        color={color ? color : '#0d9c60'}
        size={size}
        type={type}
        name={name}
      />
    </Container>
  );
}
