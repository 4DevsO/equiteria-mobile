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

import noImage from '~/assets/icons/no-image.png';

export default function CardSingleItem({
  title,
  image,
  labels,
  date,
  synced = false,
}) {
  return (
    <Container>
      <ItemImage source={image ? {uri: image} : noImage} />
      <InfoContainer>
        <ItemTitle numberOfLines={1} ellipsizeMode={'tail'}>
          {title}
        </ItemTitle>
        <Bottom>
          {labels.map((label, idx) => (
            <TagText key={idx}>{label}</TagText>
          ))}
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
