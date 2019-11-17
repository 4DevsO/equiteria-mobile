import React from 'react';

import {Container, AppName, Text, Bold} from '../styles';

export default function Page1({key}) {
  return (
    <Container key={key}>
      <AppName>
        Bem Vindo ao <Bold>e-Quitéria</Bold>
      </AppName>
      <Text>
        O <Bold>e-Quitéria</Bold> é uma iniciativa da <Bold>UESC</Bold> através
        do <Bold>NBCGIB</Bold> para coleta de dados sobre o efeito do derrame de
        óleo no litoral nordestino.
      </Text>
    </Container>
  );
}
