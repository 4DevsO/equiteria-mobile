import React from 'react';

import {Container, Dot} from './styles';

export default function PageIndicator({size = 1, active = 0}) {
  const dots = [];
  for (let i = 0; i < size; i++) {
    dots.push(<Dot key={i} active={i === active} />);
  }

  return <Container>{dots}</Container>;
}
