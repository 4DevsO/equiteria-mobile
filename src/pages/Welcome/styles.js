import styled from 'styled-components/native';
import {Input, Icon as EIcon} from 'react-native-elements';

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: rgba(255, 255, 255, 0);
  align-items: center;
  padding: 0 20px;
  padding-top: 20px;
`;

export const AppName = styled.Text`
  color: #000;
  font-size: 24px;
  margin: 80px 0;
`;

export const BoldText = styled.Text`
  font-weight: bold;
`;

export const Text = styled.Text`
  color: #000;
  font-size: 18px;
  text-align: center;
`;

export const Link = styled.Text`
  text-decoration: underline;
  color: #5c7cf2;
`;

export const TextInput = styled(Input).attrs({
  containerStyle: {marginVertical: 10},
})``;

export const Icon = styled(EIcon).attrs({
  color: '#0d9c60',
  size: 25,
})``;
