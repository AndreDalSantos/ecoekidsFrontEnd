/* eslint-disable @typescript-eslint/ban-types */
import { useField } from '@unform/core';
import React, { SelectHTMLAttributes, useEffect, useRef } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { IconBaseProps } from 'react-icons/lib';

import { Container, Error } from './styles';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  containerStyle?: object;
  icon: React.ComponentType<IconBaseProps>;
}

const Select: React.FC<SelectProps> = ({
  name,
  containerStyle = {},
  icon: Icon,
  ...rest
}) => {
  const selectRef = useRef<HTMLSelectElement>(null);

  const { fieldName, defaultValue, error, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <Container isErrored={!!error} style={containerStyle}>
      {Icon && <Icon size={20} />}

      <select defaultValue={defaultValue} ref={selectRef} {...rest} />

      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>
      )}
    </Container>
  );
};

export default Select;
