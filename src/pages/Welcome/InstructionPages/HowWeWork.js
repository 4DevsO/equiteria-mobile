import React from 'react';
import {Linking} from 'react-native';

import {Container, AppName, Text, BoldText, Link, Bold} from '../styles';

export default function HowWeWork({key}) {
  return (
    <Container key={key}>
      <AppName>
        O que o <BoldText>e-Quitéria</BoldText> faz
      </AppName>
      <Text>
        Ao avistar algum tipo de ocorrência que tenha sido gerada por conta do
        derramamento de oléo crie um registro no <Bold>e-Quitéria</Bold>.
      </Text>
      <Text>
        Os registros criados dentro do app são categorizados e enviados para a{' '}
        <Bold>UESC</Bold>. Esses dados serão utilizados para caracterizar os
        impactos ambientais e planejar ações mitigatórias.
      </Text>
      <Text>
        {'\n'}Maiores detalhes sobre o app e seus desenvolvedores podem ser
        encontrados em nosso site:
      </Text>
      <Text>
        <Bold>
          <Link
            onPress={() =>
              Linking.openURL('http://nbcgib.uesc.br').catch(e =>
                console.log('<error>', e),
              )
            }>
            {'\n'}nbcgib.uesc.br
          </Link>
        </Bold>
      </Text>
    </Container>
  );
}
