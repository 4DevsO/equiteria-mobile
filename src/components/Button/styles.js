import styled from 'styled-components/native';
import {Button} from 'react-native-elements';

export const ButtonContainer = styled(Button).attrs(
  ({disabled, color, style}) => ({
    containerStyle: {
      height: 50,
      width: '100%',
      backgroundColor: disabled ? '#979797' : color,
      ...style,
    },
    buttonStyle: {
      height: 50,
      width: '100%',
      backgroundColor: disabled ? '#979797' : color,
    },
  }),
)`
  height: 50px;
  background-color: ${({disabled, color}) => (disabled ? '#979797' : color)};
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  width: 100%;
`;

export const ButtonText = styled.Text`
  color: ${({disabled}) => (disabled ? '#000' : '#FFF')};
  font-weight: bold;
`;
