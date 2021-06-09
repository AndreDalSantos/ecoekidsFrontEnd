/* eslint-disable camelcase */
import React, { useCallback, useRef } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory, useLocation } from 'react-router-dom';

import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import Button from '../../components/Button';

import { Container, Content, AnimationContainer, Background } from './styles';
import api from '../../services/api';

const ConfirmEmail: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const history = useHistory();
  const location = useLocation();

  const handleSubmit = useCallback(async () => {
    try {
      const token = location.search.replace('?token=', '');

      if (!token) {
        throw new Error();
      }

      await api.post('/users/confirm_email', {
        token,
      });

      history.push('/signin');
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);
        formRef.current?.setErrors(errors);

        return;
      }

      addToast({
        type: 'error',
        title: 'Erro ao tentar verificar email',
        description: 'Ocorreu um erro ao verificar seu email.',
      });
    }
  }, [addToast, history, location]);

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <h1>Verificar Email</h1>

          <Form ref={formRef} onSubmit={handleSubmit}>
            <Button type="submit">Verificar Email</Button>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ConfirmEmail;
