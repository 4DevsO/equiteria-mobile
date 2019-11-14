import React from 'react';

import {Container, AppName, Text, BoldText, Link} from '../styles';
import {Linking} from 'react-native';

export default function Page1({key}) {
  return (
    <Container key={key}>
      <AppName>
        Bem Vindo ao <BoldText>e-Quitéria</BoldText>
      </AppName>
      <Text>
        O <BoldText>e-Quiteria</BoldText> é uma iniciativa da Universidade
        Estadual de Santa Cruz mediante seu Núcleo de Biologia Computacional e
        Gestão de Informações Biotecnológicas para coletar dados sobre os
        efeitos do derrame de óleo no litoral Nordestino com ênfase no estado da
        Bahia.
      </Text>
      <Text>
        Imagens georreferenciadas e comentários de cada incidência, podem ser
        coletados no app, por pesquisadores, voluntários, e público em geral,
        alimentando um banco de dados centralizado que poderá ser utilizado para
        caracterizar o impacto ambiental, assim como para planejar as ações
        mitigatórias.
      </Text>
      <Text>
        Maiores detalhes sobre o app e seus desenvolvedores podem ser
        encontrados no site{' '}
        <Link
          onPress={() =>
            Linking.openURL('http://equiteria.nbcgib.uesc.br').catch(e =>
              console.log('<error>', e),
            )
          }>
          equiteria.nbcgib.uesc.br
        </Link>
      </Text>
    </Container>
  );
}
