import React, {useState, useEffect} from 'react';
import {
  TouchableWithoutFeedback,
  PermissionsAndroid,
  Text,
  View,
  Alert,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {Item, Picker, Input, Textarea} from 'native-base';
import ImagePicker from 'react-native-image-crop-picker';
import {StackActions} from 'react-navigation';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import RNFS from 'react-native-fs';
import Toast from 'react-native-simple-toast';
import uuid from 'uuid';
import moment from 'moment';

import getRealm from '~/services/realm';
import api, {reverseGeoLocation} from '~/services/api';
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
    tag: 'óleo em praia',
  },
  {
    label: 'Óleo em rio',
    value: 'oleo-rio',
    tag: 'óleo em rio',
  },
  {
    label: 'Animais contaminados',
    value: 'animais',
    tag: 'animal contaminado',
  },
  {
    label: 'Pessoa com sintomas causados pelo óleo',
    value: 'pessoas',
    tag: 'pessoa com sintoma',
  },
  {
    label: 'Outro',
    value: 'outro',
    tag: 'outro',
  },
];

export default function NewRegister({navigation}) {
  const [selected, setSelected] = useState('oleo-praia');
  const [otherDescription, setOtherDescription] = useState('');
  const [description, setDescription] = useState('');
  const [imageSource, setImageSource] = useState('');
  const [hasLocationPermission, setHasLocationPermission] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(false);
  const [locationName, setLocationName] = useState('');

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
            setHasLocationPermission(false);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      } else {
        setHasLocationPermission(false);
      }
    };

    getPermission();
  }, [navigation]);

  useEffect(() => {
    if (!hasLocationPermission) {
      Alert.alert(
        'Sua localização está desligada',
        'Para enviar um registro você deve ativar a localização do seu dispositivo e tentar novamente',
        [{text: 'OK'}],
        {cancelable: false},
      );
      const popAction = StackActions.pop({
        n: 1,
      });

      navigation.dispatch(popAction);
    }
  }, [hasLocationPermission, navigation]);

  useEffect(() => {
    const getLocationName = async () => {
      const reverseLocationName = await reverseGeoLocation(currentLocation);
      setLocationName(reverseLocationName);
    };
    getLocationName();
  }, [currentLocation]);

  const canSubmit = () => {
    const hasImage = !!imageSource && !!imageSource.path;
    let otherDescr = true;
    if (selected === 'outro') {
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
        location_name: locationName,
        tags: [infos.tag],
        description: infos.description,
        other_description: infos.otherDescription,
        photos: [
          {
            data: infos.photo.data,
            synced: false,
          },
        ],
      };

      const realm = await getRealm();
      realm.write(async () => {
        realm.create('OilSpot', data);
        const {isConnected} = await NetInfo.fetch();
        if (isConnected) {
          console.log(`<syncing> ${data.id}`);
          api
            .post('/oilSpot', {
              ...data,
              spot_id: data.id,
              location_name: undefined,
              id: undefined,
              photos: undefined,
            })
            .then(response => {
              if (response.data.success) {
                realm.write(() => {
                  const localSpot = realm.objectForPrimaryKey(
                    'OilSpot',
                    data.id,
                  );
                  localSpot.synced = true;
                  console.log(`<synced> ${data.id}`);
                  imageUploadHandler({
                    spotId: data.id,
                    images: data.photos,
                  });
                });
              }
            })
            .catch(err => {
              if (err.response) {
                console.info('<failed to sync>', data.id, err.response.data);
              } else {
                console.info('<error>', err.message);
              }
            });
        } else {
          try {
            realm.write(() => {
              realm.create(
                'SyncSchedule',
                {
                  spot_id: data.id,
                  created_at: new Date(),
                },
                true,
              );
            });
          } catch (err) {
            console.log('<error>', err);
          }
        }
      });
    } catch (err) {
      throw new Error(err);
    }
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

  const toastElementNotEditable = () => {
    Toast.show('Esse item não é editavél.', Toast.SHORT);
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
            style={{backgroundColor: '#eee', borderRadius: 4, padding: 20}}
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
      {selected === 'outro' && (
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
      <TouchableWithoutFeedback onPress={toastElementNotEditable}>
        <DescriptionContainer>
          <View>
            <Text style={{fontWeight: 'bold'}}>Data</Text>
            <Text>{moment().format('DD/MM/YYYY')}</Text>
          </View>
        </DescriptionContainer>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={toastElementNotEditable}>
        <DescriptionContainer>
          <View>
            <Text style={{fontWeight: 'bold'}}>Localização</Text>
            <Text>{locationName}</Text>
          </View>
        </DescriptionContainer>
      </TouchableWithoutFeedback>
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

var uploadProgress = response => {
  var percentage = Math.floor(
    (response.totalBytesSent / response.totalBytesExpectedToSend) * 100,
  );
  // console.log('<uploading image> ' + percentage + '% done...');
};

export const imageUploadHandler = async ({spotId, images = []}) => {
  const files = [];
  const {baseURL, apikey} = Secrets;

  try {
    await Promise.all(
      await images.map(async image => {
        const filename = uuid.v4() + '.jpg';
        const imagePath = `${RNFS.DocumentDirectoryPath}/${filename}`;
        await RNFS.writeFile(imagePath, image.data, 'base64').catch(err => {
          console.log(`<error creating image file> ${err.message}`);
        });

        const file = {
          name: 'img',
          filename: imagePath,
          filepath: imagePath,
        };

        files.push(file);
      }),
    );
  } catch (err) {
    console.log('<error creating file>', err);
  }

  const toUrl = `${baseURL}/oilSpotPhoto`;
  console.log(`<uploading images> ${spotId}`);
  RNFS.uploadFiles({
    toUrl,
    files,
    method: 'POST',
    headers: {
      apikey,
    },
    progress: uploadProgress,
  })
    .promise.then(response => {
      if (response.statusCode === 200) {
        console.log(`<uploaded images> ${spotId}`, response.body);
        console.log(`<updating spot image data> ${spotId}`);
        api
          .put(`/oilSpot/${spotId}`, {
            photos: JSON.parse(response.body).data,
          })
          .then(putResponse => {
            if (putResponse.data.success) {
              console.log(`<updating spot image data locally> ${spotId}`);
              getRealm()
                .then(realm => {
                  realm.write(() => {
                    const foundSpot = realm.objectForPrimaryKey(
                      'OilSpot',
                      spotId,
                    );

                    const syncedPhotos = foundSpot.photos.map(photo => ({
                      ...photo,
                      synced: true,
                    }));

                    foundSpot.photos = syncedPhotos;
                    console.log(`<updated spot image data> ${spotId}`);
                    files.map(({filepath}) => {
                      RNFS.unlink(filepath);
                    });
                  });
                })
                .catch(err => {
                  if (err.response) {
                    console.info(
                      '<failed to update spot image data on realm>',
                      spotId,
                      err.response.data,
                    );
                  } else {
                    console.info('<error>', err.message);
                  }
                });
            }
          })
          .catch(err => {
            getRealm()
              .then(realm => {
                realm.write(() => {
                  realm.create(
                    'SyncScheduleImages',
                    {
                      spot_id: spotId,
                      created_at: new Date(),
                    },
                    true,
                  );
                });
              })
              .catch(realmErr => console.log('<error>', realmErr));
            if (err.response) {
              console.info(
                '<failed to update spot image data to be>',
                spotId,
                err.response.data,
              );
            } else {
              console.info('<error>', err.message);
            }
          });
      }
    })
    .catch(err => {
      getRealm()
        .then(realm => {
          realm.write(() => {
            realm.create(
              'SyncScheduleImages',
              {
                spot_id: spotId,
                created_at: new Date(),
              },
              true,
            );
          });
        })
        .catch(realmErr => console.log('<error>', realmErr));
      if (err.response) {
        console.info('<failed to upload image>', spotId, err.response.data);
      } else {
        console.info('<error>', err);
      }
    });
};
