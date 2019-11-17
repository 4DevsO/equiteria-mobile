import styled from 'styled-components/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export const Container = styled(KeyboardAwareScrollView).attrs({
  contentContainerStyle: {
    alignItems: 'center',
  },
  enableOnAndroid: true,
  extraHeight: 50,
})`
  flex: 1;
  margin: 0 20px;
`;

export const BottomSpacer = styled.View`
  height: 20px;
`;

export const PictureContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-around;
  margin: 20px 0;
`;

export const PickerContainer = styled.View`
  width: 100%;
  margin-left: 10px;
  justify-content: space-between;
`;

export const PickerTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

export const DescriptionContainer = styled.View`
  flex-direction: row;
  width: 100%;
  margin-top: 20px;
  border-width: 2px;
  border-color: #eee;
`;
