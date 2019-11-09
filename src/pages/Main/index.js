import React, {useState, useEffect} from 'react';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {Container, TextTitle, HeaderContainer, TextTitleBlack} from './styles';

import IconButton from '~/components/IconButton';
import List from '~/components/List';
import ListItem from '~/components/ListItem';

const logout = async navigation => {
  try {
    const sessionToken = await AsyncStorage.getItem('@equiteria/userAuth');
    if (sessionToken !== null) {
      await AsyncStorage.removeItem('@equiteria/userAuth');
      await AsyncStorage.removeItem('@equiteria/userPhone');
      navigation.navigate('Welcome');
    }
  } catch (e) {}
};

export default class Main extends React.Component {
  static navigationOptions = {header: null};

  handleLogout = () => {
    const {navigation} = this.props;

    Alert.alert(
      'Desconectar',
      'Você irá se desconectar do e-quitéria',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Confirmar',
          onPress: () => logout(navigation),
        },
      ],
      {cancelable: true},
    );
  };

  render() {
    const {navigation} = this.props;

    return (
      <Container>
        <HeaderContainer>
          <TextTitleBlack>e-quitéria</TextTitleBlack>
          <IconButton
            name="exit-to-app"
            onPress={this.handleLogout}
            color="#000"
          />
        </HeaderContainer>
        <List
          title="Seus registros"
          onAdd={() => navigation.navigate('NewRegister')}
          data={[]}
          renderItem={({title, labels, date}) => (
            <ListItem title={title} labels={labels} date={date} />
          )}
        />
      </Container>
    );
  }
}
