import React from 'react';

import {Container, AppName, Text, BoldText} from '../styles';

export default function Page2({key}) {
  return (
    <Container key={key}>
      <AppName>
        Bem Vindo ao <BoldText>e-Quitéria</BoldText>
      </AppName>
      <Text>Explica o nome do app....</Text>
    </Container>
  );
}
