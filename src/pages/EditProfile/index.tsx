/* eslint-disable react/button-has-type */
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import { FiLock, FiMail, FiUser } from 'react-icons/fi';
import { Container, BlockProfile } from './styles';

import api from '../../services/api';

import Input from '../../components/Input';
import Header from '../../components/Header';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';
import { useAuth } from '../../hooks/auth';

interface IUser {
  id: string;
  name: string;
  user_name: string;
  email: string;
  // cpf_cnpj: string; //cpfcnpj
  reputation: string;
  avatar_url: string;
}

interface UpdateFormData {
  name: string;
  user_name: string;
  email: string;
  // cpf_cnpj: string; // cpfcnpj
  // password: string;
  old_password: string;
}

const EditProfile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [user, setUser] = useState<IUser>();
  const [repeatEmail, setRepeatEmail] = useState('');
  const [altered, setAltered] = useState(false);

  const { addToast } = useToast();
  const { signOut } = useAuth();
  const history = useHistory();

  useEffect(() => {
    api.get(`/profile`).then(response => {
      setUser(response.data.user);
    });
  }, []);

  const handleUpdateUser = useCallback(
    async (data: UpdateFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required(),
          email: Yup.string().required().email(),
          user_name: Yup.string().required(),
          // cpf_cnpj: Yup.string().required(), // cpfcnpj
          // password: Yup.string().required(),
          old_password: Yup.string().required('Digite sua senha'),
          email_reentry: Yup.string()
            .optional()
            .email('Deve ser igual ao digitado no campo email.')
            .equals([repeatEmail]),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.put('/profile', { ...data });

        addToast({
          type: 'success',
          title: 'Perfil atualizado com sucesso!',
          description: '',
        });

        if (user?.email.toLocaleLowerCase() !== data.email.toLowerCase()) {
          addToast({
            type: 'success',
            title: 'Email alterado',
            description: 'Cheque seu email para verificação.',
          });
          signOut();
        }

        history.push('/profile');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);

          return;
        }

        const errorMessage = error.response.data.message;

        addToast({
          type: 'error',
          title: 'Um erro ocorreu!',
          description: errorMessage,
        });
      }
    },
    [history, addToast, signOut, user, repeatEmail],
  );

  return (
    <Container>
      <Header />

      <BlockProfile>
        <Form
          className="form-search-container"
          ref={formRef}
          onSubmit={handleUpdateUser}
          initialData={user}
        >
          <div className="input-block">
            <p>Nome: </p>
            <Input name="name" icon={FiUser} />
          </div>

          <div className="input-block">
            <p>Email: </p>
            <Input
              name="email"
              icon={FiMail}
              onChange={() => {
                setAltered(true);
              }}
              onBlur={e => {
                setRepeatEmail(e.target.value);
              }}
            />
          </div>

          {altered && (
            <div className="input-block">
              <p>Redigite seu email: </p>
              <Input
                name="email_reentry"
                icon={FiMail}
                placeholder="Digite novamente seu email"
              />
            </div>
          )}

          <div className="input-block">
            <p>Nome de usuário: </p>
            <Input name="user_name" icon={FiUser} />
          </div>

          {/* cpfcnpj */}
          {/* <div className="input-block">
            <p>CPF/CNPJ: </p>
            <Input name="cpf_cnpj" />
          </div> */}

          {/* <div className="input-block">
            <p>Nova senha: </p>
            <Input
              name="password"
              type="password"
              placeholder="digite sua nova senha"
            />
          </div> */}

          <div className="input-block">
            <p>Senha antiga: </p>
            <Input
              name="old_password"
              icon={FiLock}
              type="password"
              placeholder="digite sua senha"
            />
          </div>

          <button type="submit">Salvar</button>
        </Form>
      </BlockProfile>
    </Container>
  );
};

export default EditProfile;
