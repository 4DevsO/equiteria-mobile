import React, {useState, useEffect} from 'react';
import {TouchableWithoutFeedback, PermissionsAndroid} from 'react-native';
import {Icon} from 'react-native-elements';
import {Item, Picker, Input, Textarea} from 'native-base';
import ImagePicker from 'react-native-image-crop-picker';
import {StackActions} from 'react-navigation';
import Geolocation from 'react-native-geolocation-service';

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
    value: 'key0',
  },
  {
    label: 'Óleo em rio',
    value: 'key1',
  },
  {
    label: 'Animais contaminados',
    value: 'key2',
  },
  {
    label: 'Pessoa com sintomas causados pelo óleo',
    value: 'key3',
  },
  {
    label: 'Outro',
    value: 'key4',
  },
];

export default function NewRegister({navigation}) {
  const [selected, setSelected] = useState('key0');
  const [otherDescription, setOtherDescription] = useState('');
  const [description, setDescription] = useState('');
  const [imageSource, setImageSource] = useState('');
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(false);

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

  const handleSubmit = () => {
    Geolocation.getCurrentPosition(
      ({coords: {latitude, longitude}}) =>
        setCurrentLocation({latitude, longitude}),
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );

    const info = {
      selected,
      otherDescription,
      description,
      imageSource: imageSource.path,
      currentLocation,
      now: Date.now(),
    };

    // TODO sync localy and to API

    console.log(info);
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
