import styled from 'styled-components/native';

export const Dot = styled.View`
  width: ${({active}) => (active ? 20 : 10)};
  height: 10px;
  border-radius: 5px;
  background-color: ${({active}) => (active ? '#000' : '#ddd')};
  margin: 0 5px;
`;

export const Container = styled.View`
  justify-content: center;
  width: 100%;
  flex-direction: row;
  margin-bottom: 40px;
`;
