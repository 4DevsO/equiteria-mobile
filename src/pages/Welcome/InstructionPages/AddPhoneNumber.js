import React, {useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-community/async-storage';
import auth from '@react-native-firebase/auth';
import VMasker from 'vanilla-masker';
import uuid from 'uuid';

import {Container, AppName, Text, BoldText, TextInput, Icon} from '../styles';

import Button from '~/components/Button';

import api from '~/services/api';

export default function AddPhoneNumber({key, navigation}) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [changePage, setChangePage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [verificationId, setVerificatioId] = useState(undefined);

  const telMask = '(99) 9 9999-9999';

  const createUser = async () => {
    try {
      const userId = uuid.v4();

      const userData = {
        user_id: userId,
        phone_number: `+55${phoneNumber.replace(/[()\-\s]/gi, '')}`,
      };

      console.log(userData);

      // const response = await api.post('/user', userData);

      // console.log('response', response.data);

      await AsyncStorage.setItem('@equiteria/userId', userId);
      setLoading(false);
      navigation.navigate('Main', {userId});
    } catch (err) {
      setLoading(false);
      console.log('error', err);
    }
  };

  const phoneStateCb = phoneAuthSnapshot => {
    switch (phoneAuthSnapshot.state) {
      // ------------------------
      //  IOS AND ANDROID EVENTS
      // ------------------------
      case auth.PhoneAuthState.CODE_SENT: // or 'sent'
        console.log('code sent');
        setLoading(true);
        break;
      case auth.PhoneAuthState.ERROR: // or 'error'
        setLoading(false);
        setError(true);
        setChangePage(false);
        console.log(phoneAuthSnapshot.error);
        break;

      // ---------------------
      // ANDROID ONLY EVENTS
      // ---------------------
      case auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
        console.log('auto verify on android timed out');
        setLoading(false);
        setChangePage(true);
        setVerificatioId(phoneAuthSnapshot.verificationId);
        break;
      case auth.PhoneAuthState.AUTO_VERIFIED: // or 'verified'
        console.log('auto verified on android');
        console.log(phoneAuthSnapshot);
        createUser();
        break;
    }
  };

  const verifyNumber = async () => {
    console.log('clicou');
    setLoading(true);
    setError(false);

    try {
      const fixedNumber = `+55${phoneNumber.replace(/[()\-\s]/gi, '')}`;
      if (fixedNumber.length !== 14) {
        throw new Error('Informe um número de telefone válido');
      }
      await auth()
        .verifyPhoneNumber(fixedNumber)
        .on('state_changed', phoneStateCb);
    } catch (err) {
      if (
        err.message !==
        "undefined is not an object (evaluating 'this._promise.then.bind')"
      ) {
        setLoading(false);
        setError(true);
        console.log(err.message);
      }
    }
  };

  const confirmCode = async () => {
    setError(false);
    setLoading(true);

    if (code.length >= 6) {
      try {
        const credential = auth.PhoneAuthProvider.credential(
          verificationId,
          code,
        );
        await auth().signInWithCredential(credential);
        createUser();
      } catch (err) {
        setLoading(false);
        setError(true);
        console.log(err.message);
      }
    } else {
      setTimeout(() => {
        setLoading(false);
        setError(true);
      }, 500);
    }
  };

  return (
    <KeyboardAwareScrollView enableOnAndroid extraHeight={200}>
      <Container key={key}>
        <AppName>
          Bem Vindo ao <BoldText>e-Quitéria</BoldText>
        </AppName>
        <Text>Explica sobre necessidade de verificar a identidade....</Text>
        {!changePage && (
          <>
            <TextInput
              placeholder={telMask}
              value={phoneNumber}
              onChangeText={text =>
                setPhoneNumber(VMasker.toPattern(text, telMask))
              }
              leftIcon={<Icon name="phone" />}
              returnKeyType="send"
              onSubmitEditing={verifyNumber}
              errorMessage={
                error ? 'Verifique se o número digitado está correto' : ''
              }
              errorStyle={{borderBottomColor: '#ff0000'}}
              keyboardType="phone-pad"
            />
            <Button
              loading={loading}
              disabled={loading}
              onLongPress={() => console.log('long')}
              onPress={verifyNumber}>
              Verificar
            </Button>
          </>
        )}
        {changePage && (
          <>
            <Text style={{marginVertical: 10}}>
              O código foi enviado para <BoldText>{phoneNumber}</BoldText>
            </Text>
            <TextInput
              placeholder={'Código recebido'}
              value={code}
              onChangeText={text => setCode(text)}
              returnKeyType="send"
              onSubmitEditing={confirmCode}
              errorMessage={
                error
                  ? 'Verifique se o código digitado é igual ao recebido'
                  : ''
              }
              errorStyle={{borderBottomColor: '#ff0000'}}
              keyboardType="phone-pad"
            />
            <Button disabled={loading} loading={loading} onPress={confirmCode}>
              Confirmar
            </Button>
            <Button
              containerStyles={{marginTop: 20}}
              color="#ff0000"
              disabled={loading}
              onPress={() => {
                setCode('');
                setChangePage(false);
              }}>
              Corrigir número
            </Button>
          </>
        )}
      </Container>
    </KeyboardAwareScrollView>
  );
}
