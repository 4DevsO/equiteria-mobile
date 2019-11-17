import React from 'react';
import {TouchableWithoutFeedback} from 'react-native';

import {Container} from './styles';
import IconButton from '~/components/IconButton';

export default function PhotoPicker({imageSource, onPress}) {
  return (
    <>
      {!!imageSource && !!imageSource.path ? (
        <TouchableWithoutFeedback onPress={onPress}>
          <Container
            source={{
              uri: imageSource.path,
            }}
          />
        </TouchableWithoutFeedback>
      ) : (
        <IconButton
          name="add-a-photo"
          size={40}
          color="#999"
          onPress={onPress}
          style={{backgroundColor: '#eee', borderRadius: 4, padding: 20}}
        />
      )}
    </>
  );
}
