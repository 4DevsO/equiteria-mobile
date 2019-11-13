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
    spots: [],
    refreshing: false,
    syncing: 0,
  };

  componentDidMount = async () => {
    this.props.navigation.addListener('willFocus', () => {
      this.handleRefresh();
    });
    this.handleRefresh();
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

    if (data2sync.length) {
      // syncData(data2sync, this.state.syncing, state =>
      //   this.setState({
      //     syncing: state,
      //   }),
      // );
    }
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

  handleItemDelete = id => {
    Alert.alert(
      'Apagar Registro',
      'Você irá apagar o registro do e-quitéria',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Apagar',
          onPress: async () => {
            try {
              const realm = await getRealm();
              realm.write(() => {
                const spot = realm.objectForPrimaryKey('OilSpot', id);
                realm.delete(spot);
                const spot2sync = realm.objectForPrimaryKey('SyncSchedule', id);
                if (spot2sync) {
                  realm.delete(spot2sync);
                }
              });
            } catch (err) {
              console.log('<error>', err);
            }
            this.handleRefresh();
          },
        },
      ],
      {cancelable: true},
    );
  };

  render() {
    const {navigation} = this.props;
    const {spots, refreshing} = this.state;

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
          data={spots}
          refreshing={refreshing}
          onRefresh={this.handleRefresh}
          renderItem={({
            item: {collect_date, photos, tags, location, synced, id},
          }) => (
            <ListItem
              title={`${location.latitude} x ${location.longitude}`}
              location={location}
              image={Array.from(photos)[0]}
              label={Array.from(tags)[0]}
              date={collect_date}
              synced={synced}
              onLongPress={() => this.handleItemDelete(id)}
            />
          )}
        />
      </Container>
    );
  }
}
