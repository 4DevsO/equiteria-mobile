import styled from 'styled-components/native';

export const Container = styled.View`
  width: 100%;
  padding: 0 20px;
  flex: 1;
`;

export const ListHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
`;

export const ListTitle = styled.Text`
  font-size: 20px;
`;

export const NoItemText = styled.Text`
  text-align: center;
  font-size: 20px;
  margin-top: 20px;
  color: #bbb;
`;
