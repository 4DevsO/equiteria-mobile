import React from 'react';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {Container, TextTitle, HeaderContainer, TextTitleBlack} from './styles';

import IconButton from '~/components/IconButton';
import List from '~/components/List';
import ListItem from '~/components/ListItem';

import getRealm from '~/services/realm';

const logout = async navigation => {
  try {
    await AsyncStorage.removeItem('@equiteria/userId');
    navigation.navigate('Welcome');
  } catch (err) {
    console.log(err);
  }
};

export default class Main extends React.Component {
  static navigationOptions = {header: null};

  state = {
    userId: '',
    spots: [],
    refreshing: false,
  };

  componentDidMount = async () => {
    const userId = await AsyncStorage.getItem('@equiteria/userId');
    this.handleRefresh();
    this.setState({userId});
  };

  handleRefresh = async () => {
    this.setState({refreshing: true});
    const realm = await getRealm();
    const spots = realm.objects('OilSpot').sorted('collect_date', true);
    this.setState({spots, refreshing: false});
  };

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
    const {spots, userId, refreshing} = this.state;

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
          onAdd={() => navigation.navigate('NewRegister', {userId})}
          data={spots}
          refreshing={refreshing}
          onRefresh={this.handleRefresh}
          renderItem={({item: {collect_date, photos, tags, ...rest}}) => (
            <ListItem
              title={'oi'}
              image={Array.from(photos)[0]}
              labels={tags}
              date={collect_date}
            />
          )}
        />
      </Container>
    );
  }
}
