import React from 'react';

import {Container, AppName, Text, Bold} from '../styles';

export default function Page2({key}) {
  return (
    <Container key={key}>
      <AppName>
        O nome <Bold>e-Quitéria</Bold>
      </AppName>
      <Text>
        <Bold>Maria Quitéria</Bold> foi uma baiana, da região de Feira de
        Santana, e a primeira mulher em integrar o exército brasileiro. Ela se
        tornou uma heroína da independência e um exemplo de dedicação. Hoje,
        Quitéria se levanta novamente para nos ajudar a combater os impactos da
        tragédia ambiental em nosso litoral nordestino.
      </Text>
    </Container>
  );
}
