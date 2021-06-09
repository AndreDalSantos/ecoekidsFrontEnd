/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/ban-types */
import React, { useEffect } from 'react';

import { FiAlertCircle } from 'react-icons/fi';
import { IconBaseProps } from 'react-icons';
import { useField } from '@unform/core';

import { TextareaHTMLAttributes, useRef } from 'react';
import { Container, Error } from './styles';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  containerStyle?: object;
  icon: React.ComponentType<IconBaseProps>;
}

const TextArea: React.FC<TextAreaProps> = ({
  name,
  containerStyle = {},
  icon: Icon,
  ...rest
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const { fieldName, defaultValue, error, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: textAreaRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <Container style={containerStyle} isErrored={!!error}>
      {Icon && <Icon size={20} />}
      <textarea defaultValue={defaultValue} ref={textAreaRef} {...rest} />

      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>
      )}
    </Container>
  );
};

export default TextArea;
