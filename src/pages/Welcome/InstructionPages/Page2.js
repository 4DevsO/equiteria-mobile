import React from 'react';

import {Container, AppName, Text, BoldText} from '../styles';

export default function Page2({key}) {
  return (
    <Container key={key}>
      <AppName>
        Bem Vindo ao <BoldText>e-Quitéria</BoldText>
      </AppName>
      <Text>
        O nome deste app <BoldText>e-Quitéria</BoldText> é uma homenagem a{' '}
        <BoldText>Maria Quitéria</BoldText>, baiana da região de Feira de
        Santana, foi a primeira mulher em integrar o exército brasileiro,
        tornando-se heroína da independência, um exemplo de dedicação e
        patriotismo. Hoje, Quitéria se levanta novamente para nos ajudar a
        combater os impactos da tragédia ambiental no litoral nordestino.
      </Text>
    </Container>
  );
}
