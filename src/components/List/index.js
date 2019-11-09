import React from 'react';
import {Text, FlatList} from 'react-native';

import {Container, ListHeader, ListTitle, NoItemText} from './styles';

import IconButton from '~/components/IconButton';

const defaultKeyExtractor = ({id}) => id;

export default function List({
  title,
  data,
  onAdd,
  renderItem,
  onRefresh,
  refreshing,
  keyExtractor = defaultKeyExtractor,
}) {
  return (
    <Container>
      <ListHeader>
        <ListTitle>{title}</ListTitle>
        <IconButton
          type="octicon"
          name="diff-added"
          onPress={onAdd}
          color="#000"
        />
      </ListHeader>
      <FlatList
        data={data}
        onRefresh={onRefresh}
        keyExtractor={keyExtractor}
        refreshing={refreshing}
        renderItem={item => renderItem(item)}
        ListEmptyComponent={<NoItemText>Nenhum item registrado</NoItemText>}
      />
    </Container>
  );
}
