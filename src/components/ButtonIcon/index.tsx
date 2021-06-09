/* eslint-disable no-use-before-define */
import React, { ButtonHTMLAttributes } from 'react';
import { IconBaseProps } from 'react-icons/lib';

import { Container } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  icon: React.ComponentType<IconBaseProps>;
};

const Button: React.FC<ButtonProps> = ({
  children,
  loading,
  icon: Icon,
  ...rest
}) => (
  <Container type="button" {...rest}>
    {Icon && <Icon size={20} />}
    {loading ? 'Carregando...' : children}
  </Container>
);

export default Button;
