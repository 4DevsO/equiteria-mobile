import React from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import {Icon} from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import moment from 'moment';

import {
  Container,
  ItemImage,
  InfoContainer,
  ItemTitle,
  TimeText,
  TagText,
  Bottom,
} from './styles';

import {PickItens} from '~/pages/NewRegister';

import noImage from '~/assets/icons/no-image.png';

export default function CardSingleItem({
  title,
  image,
  date,
  label = '',
  synced = false,
}) {
  const tagLabel = PickItens.filter(item => item.value === label)[0].tag;

  return (
    <Container>
      <ItemImage source={image ? {uri: image} : noImage} />
      <InfoContainer>
        <ItemTitle numberOfLines={1} ellipsizeMode={'tail'}>
          {title}
        </ItemTitle>
        <Bottom>
          <TagText>{tagLabel}</TagText>
          <TimeText>{moment(date).fromNow()}</TimeText>
        </Bottom>
      </InfoContainer>
      {!synced && (
        <Icon
          color="#ff0000"
          size={25}
          name="sync"
          Component={TouchableWithoutFeedback}
          onPress={() =>
            Toast.show(
              'Esse item ainda não foi sincronizado. Fique online e abra o app novamente para sincronizar.',
              Toast.LONG,
            )
          }
        />
      )}
    </Container>
  );
}
