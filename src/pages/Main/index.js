import React from 'react';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {Container, HeaderContainer, TextTitleBlack} from './styles';

import IconButton from '~/components/IconButton';
import List from '~/components/List';
import ListItem from '~/components/ListItem';

import getRealm from '~/services/realm';

import syncData from './module/syncData';

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
    this.props.navigation.addListener('willFocus', () => {
      this.handleRefresh();
    });
    const userId = await AsyncStorage.getItem('@equiteria/userId');
    this.handleRefresh();
    this.setState({userId});
  };

  handleRefresh = async () => {
    this.setState({refreshing: true});
    const realm = await getRealm();
    const spots = realm.objects('OilSpot').sorted('collect_date', true);
    const data2sync = [];
    spots.map(({synced, id}) => {
      if (!synced) {
        data2sync.push({id});
      }
    });
    this.setState({spots, refreshing: false});
    syncData(data2sync);
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
          renderItem={({
            item: {collect_date, photos, tags, location, synced},
          }) => (
            <ListItem
              title={`${location.latitude} x ${location.longitude}`}
              location={location}
              image={Array.from(photos)[0]}
              label={Array.from(tags)[0]}
              date={collect_date}
              synced={synced}
            />
          )}
        />
      </Container>
    );
  }
}
