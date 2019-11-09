import React from 'react';

import {Container, AppName, Text, BoldText} from '../styles';

export default function Page1({key}) {
  return (
    <Container key={key}>
      <AppName>
        Bem Vindo ao <BoldText>e-Quitéria</BoldText>
      </AppName>
      <Text>Explica a função do app....</Text>
    </Container>
  );
}
