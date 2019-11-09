import styled from 'styled-components/native';

export const Dot = styled.View`
  width: 14px;
  height: 14px;
  border-radius: 7px;
  background-color: ${({active}) => (active ? '#0d9c60' : '#ddd')};
  margin: 0 5px;
`;

export const Container = styled.View`
  justify-content: center;
  width: 100%;
  flex-direction: row;
  margin-bottom: 40px;
`;
