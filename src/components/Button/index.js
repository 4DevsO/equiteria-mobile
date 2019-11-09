import React from 'react';

import {ButtonContainer} from './styles';

export default function Button({
  children,
  disabled = false,
  onPress,
  onLongPress,
  loading,
  containerStyles = {},
  color = '#0D9C60',
}) {
  return (
    <ButtonContainer
      onPress={onPress}
      onLongPress={onLongPress}
      style={containerStyles}
      disabled={disabled}
      loading={loading}
      color={color}
      title={children.toUpperCase()}
    />
  );
}
