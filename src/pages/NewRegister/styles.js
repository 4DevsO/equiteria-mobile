import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  margin: 40px 20px 0 20px;
  align-items: center;
`;

export const PictureContainer = styled.View`
  flex-direction: row;
`;

export const PickerContainer = styled.View`
  flex: 1;
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

export const PhotoContainer = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 4px;
`;
