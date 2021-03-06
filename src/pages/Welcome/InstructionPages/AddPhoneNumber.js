import React, {useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from 'react-native-google-signin';

import {Container, AppName, Text, BoldText} from '../styles';

import api from '~/services/api';

export default function AddPhoneNumber({key, navigation}) {
  const [loading, setLoading] = useState(false);

  const createUser = async userInfo => {
    const {
      user: {email, name},
    } = userInfo;

    const userData = {email, name};

    try {
      const response = await api.post('/user', userData);

      const {
        data: {_id},
      } = response.data;

      await AsyncStorage.setItem('@equiteria/userId', _id);
      navigation.navigate('Main', {userId: _id});
    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
        const response = await api.get('/user');
        const {data} = response.data;
        const {_id} = data.filter(user => user.email === userData.email)[0];
        await AsyncStorage.setItem('@equiteria/userId', _id);
        navigation.navigate('Main', {userId: _id});
      } else {
        console.log('error', err);
      }
    }
  };

  const signIn = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      await createUser(userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('SIGN_IN_CANCELLED');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('IN_PROGRESS');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('PLAY_SERVICES_NOT_AVAILABLE');
      } else {
        console.log(error.code);
      }

      setLoading(false);
    }
  };

  return (
    <Container key={key}>
      <AppName>
        Ajude o <BoldText>e-Quitéria</BoldText>
      </AppName>
      <Text>
        Para começar a nos ajudar basta se conectar com a sua conta do Google e
        começar a fazer os registros.
      </Text>
      <GoogleSigninButton
        style={{width: '100%', height: 60, marginTop: 40}}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Light}
        onPress={signIn}
      />
      {loading && (
        <View
          style={{
            width: '65%',
            height: 40,
            marginTop: -50,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size={35} color="#000" />
        </View>
      )}
    </Container>
  );
}
