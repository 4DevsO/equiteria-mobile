import styled from 'styled-components/native';
import {Input, Icon as EIcon, Button as EButton} from 'react-native-elements';

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

export const Author = styled.Text`
  font-weight: bold;
  font-size: 18px;
  padding-bottom: 5px;
`;
export const Role = styled.Text`
  margin-left: 10px;
`;

export const Avatar = styled.Image`
  border-radius: 5;
  width: 90;
  height: 90;
`;

export const Card = styled.View`
  padding: 10px;
  align-items: center;
  border-width: 2px;
  border-color: #dddddd;
  margin-bottom: 20px;
`;

export const Divider = styled.View`
  width: 200px;
  border-top-width: 1px;
  border-color: #dddddd;
  padding-bottom: 10px;
`;

export const CardContent = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  width: 80%;
`;

export const Links = styled.View`
  /* padding-top: 15px; */
  padding-top: 10px;
  flex-direction: row;
  justify-content: space-around;
  align-self: flex-end;
`;

export const SocialIcon = styled(EButton).attrs({
  buttonStyle: {backgroundColor: '#0D9C60'},
  containerStyle: {paddingHorizontal: 5},
})``;

export const TextInput = styled(Input).attrs({
  containerStyle: {marginVertical: 10},
})``;

export const Icon = styled(EIcon).attrs({
  color: '#ffffff',
  type: 'antdesign',
  size: 25,
})``;
