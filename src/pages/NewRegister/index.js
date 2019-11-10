import React, {useState, useEffect} from 'react';
import {TouchableWithoutFeedback, PermissionsAndroid} from 'react-native';
import {Icon} from 'react-native-elements';
import {Item, Picker, Input, Textarea} from 'native-base';
import ImagePicker from 'react-native-image-crop-picker';
import {StackActions} from 'react-navigation';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-community/async-storage';
import RNFS from 'react-native-fs';
import uuid from 'uuid';

import getRealm from '~/services/realm';
const Secrets = require('~/services/secrets.json');

import {
  Container,
  PictureContainer,
  PickerTitle,
  PickerContainer,
  DescriptionContainer,
  PhotoContainer,
} from './styles';

import IconButton from '~/components/IconButton';
import Button from '~/components/Button';

export const PickItens = [
  {
    label: 'Óleo em praia',
    value: 'oleo-praia',
  },
  {
    label: 'Óleo em rio',
    value: 'oleo-rio',
  },
  {
    label: 'Animais contaminados',
    value: 'animais',
  },
  {
    label: 'Pessoa com sintomas causados pelo óleo',
    value: 'pessoas',
  },
  {
    label: 'Outro',
    value: 'outro',
  },
];

export default function NewRegister({navigation}) {
  const [selected, setSelected] = useState('oleo-praia');
  const [otherDescription, setOtherDescription] = useState('');
  const [description, setDescription] = useState('');
  const [imageSource, setImageSource] = useState('');
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getPermission = async () => {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permissão de uso do GPS',
          message:
            'Para coletarmos a coordenada na qual foto foi ' +
            'tirada é necessario sua permissão.\n' +
            'Ela é necessaria para essa coleta de dados.',
          buttonNeutral: 'Cancelar',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setHasLocationPermission(true);
        Geolocation.getCurrentPosition(
          ({coords: {latitude, longitude}}) =>
            setCurrentLocation({latitude, longitude}),
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      } else {
        const popAction = StackActions.pop({
          n: 1,
        });

        navigation.dispatch(popAction);
      }
    };

    getPermission();
  }, [navigation]);

  const canSubmit = () => {
    const hasImage = !!imageSource && !!imageSource.path;
    let otherDescr = true;
    if (selected === 'key4') {
      otherDescr = false;
      if (otherDescription.length) {
        otherDescr = true;
      }
    }

    return hasImage && otherDescr && hasLocationPermission;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const location = await new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          ({coords: {latitude, longitude}}) => resolve({latitude, longitude}),
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
            reject(error);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      });

      setCurrentLocation(location);

      const userId = await AsyncStorage.getItem('@equiteria/userId');

      const info = {
        collectDate: Date.now(),
        location: currentLocation,
        tag: selected,
        photo: imageSource,
        otherDescription,
        description,
        userId,
      };

      // TODO sync localy and to API

      await saveUserInfo(info);
      setLoading(false);
      const popAction = StackActions.pop({
        n: 1,
      });

      navigation.dispatch(popAction);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const saveUserInfo = async infos => {
    try {
      const data = {
        id: uuid.v4(),
        user_id: infos.userId,
        collect_date: new Date(infos.collectDate),
        location: infos.location,
        tags: [infos.tag],
        photos: [`data:${infos.photo.mime};base64,${infos.photo.data}`],
      };

      console.log({...data, photos: []});
      const realm = await getRealm();
      realm.write(() => {
        realm.create('OilSpot', data);
      });
    } catch (err) {
      throw new Error(err);
    }
  };

  const imageUploadHandler = async imageData => {
    // const imageData = `data:${image.mime};base64,${image.data}`;
    const imagePath = `${RNFS.DocumentDirectoryPath}/${uuid.v4()}.jpg`;
    const {baseURL, apikey} = Secrets;
    const imageUploadEP = `${baseURL}/oilSpotPhoto`;

    await RNFS.writeFile(imagePath, imageData, 'base-64');
    const files = [imagePath];

    const response = await RNFS.uploadFiles({
      toUrl: imageUploadEP,
      files,
      method: 'POST',
      headers: {
        apikey,
      },
    }).promise;

    if (response.statusCode === 200) {
      // Foto teve upload
      console.log(response.body);
    } else {
      // Erro no upload
    }

    await RNFS.unlink(imagePath);
  };

  const handleImagePicker = () => {
    ImagePicker.openCamera({
      mediaType: 'photo',
      compressImageQuality: 0.7,
      includeBase64: true,
    })
      .then(image => {
        setImageSource(image);
      })
      .catch(e => console.log(e));
  };

  return (
    <Container>
      <PictureContainer>
        {!!imageSource && !!imageSource.path && (
          <TouchableWithoutFeedback onPress={handleImagePicker}>
            <PhotoContainer
              source={{
                uri: imageSource.path,
              }}
            />
          </TouchableWithoutFeedback>
        )}
        {!imageSource && !imageSource.path && (
          <IconButton
            name="add-a-photo"
            size={60}
            color="#999"
            onPress={handleImagePicker}
            style={{backgroundColor: '#eee', borderRadius: 4}}
          />
        )}
        <PickerContainer>
          <PickerTitle>Tipo de Contaminação</PickerTitle>
          <Item picker>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              selectedValue={selected}
              onValueChange={(value, idx) => setSelected(value)}>
              {PickItens.map(item => (
                <Picker.Item {...item} key={item.value} />
              ))}
            </Picker>
          </Item>
        </PickerContainer>
      </PictureContainer>
      {selected === 'key4' && (
        <DescriptionContainer>
          <Input
            value={otherDescription}
            onChangeText={setOtherDescription}
            placeholder="Descreva o tipo de contaminação"
          />
        </DescriptionContainer>
      )}
      <DescriptionContainer>
        <Textarea
          rowSpan={5}
          value={description}
          onChangeText={setDescription}
          placeholder="Se possível descreva mais detalhes do problema"
        />
      </DescriptionContainer>
      <Button
        loading={loading}
        disabled={!canSubmit()}
        containerStyles={{marginTop: 20}}
        onPress={handleSubmit}>
        Enviar
      </Button>
    </Container>
  );
}

NewRegister.navigationOptions = {
  title: 'Criar novo registro',
};
