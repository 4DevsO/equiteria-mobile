import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  width: 90%;
  border-radius: 4px;
  padding: 10px 10px;
  background-color: #eee;
`;

export const ItemImage = styled.Image`
  height: 60px;
  width: 60px;
  border-radius: 4px;
  border-width: 2px;
`;

export const InfoContainer = styled.View`
  flex: 1;
  margin: 0 10px;
`;

export const Bottom = styled.View`
  flex-direction: row;
`;

export const TagText = styled.Text`
  background-color: #0d9c60;
  font-weight: bold;
  color: #fff;
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 4px;
`;

export const TimeText = styled.Text`
  font-size: 14px;
  color: #000;
  margin-left: 10px;
`;

export const ItemTitle = styled.Text`
  flex: 1;
  color: #000;
  font-size: 20px;
`;
