/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/ban-types */
import React, { useCallback, useRef, useState } from 'react';
import { FiArrowLeft, FiMail, FiLock, FiUser, FiCircle } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';

import { Container, Content, AnimationContainer, Background } from './styles';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  user_name: string;
  // cpf_cnpj: string; // cpfcnpj
  cep: string;
  country: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
  email_reentry: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const history = useHistory();

  const [cityField, setCityField] = useState('');
  const [stateField, setStateField] = useState('');
  const [neighborhoodField, setNeighborhoodField] = useState('');
  const [streetField, setStreetField] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [repeatEmail, setRepeatEmail] = useState('');

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          user_name: Yup.string().required('Nome de usuário obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().min(6, 'No mínimo 6 dígitos'),
          // cpf_cnpj: Yup.string().required('CPF ou CNPJ obrigatório.'), // cpfcnpj
          cep: Yup.string().required('Cep obrigatório'),
          city: Yup.string().required('Cidade obrigatório'),
          state: Yup.string().required('Estado obrigatório'),
          neighborhood: Yup.string().required('Bairro obrigatório'),
          street: Yup.string().required('Rua obrigatório'),
          number: Yup.string().optional(),
          complement: Yup.string().optional(),
          email_reentry: Yup.string()
            .required()
            .email('Deve ser igual ao digitado no campo email.')
            .equals([repeatEmail]),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);

        history.push('/');

        addToast({
          type: 'success',
          title: 'Cadastro realizado!',
          description: 'Cheque seu email e faça sua verificação',
        });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);

          return;
        }

        const errorMessage = error.response.data.message;

        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          // description:
          //   'Ocorreu um erro ao fazer seu cadastro, tente novamente.',
          description: errorMessage,
        });
      }
    },
    [addToast, history, repeatEmail],
  );

  const handleVerifyCEP = useCallback(
    async (cep: string) => {
      try {
        addToast({
          type: 'success',
          title: 'Buscando endereço, aguarde um momento.',
          description: '',
        });
        const response = await api.get(
          `/adresses/get_address_from_cep/5?cep=${cep}`,
        );
        setCityField(response.data.localidade);
        setStateField(response.data.uf);
        setNeighborhoodField(response.data.bairro);
        setStreetField(response.data.logradouro);
      } catch (error) {
        console.log(error);

        const errorMessage = error.response.data.message;
        alert(errorMessage);

        addToast({
          type: 'error',
          title: 'Um erro ocorreu, tente novamente mais tarde.',
          description: '',
        });
      }
    },
    [addToast],
  );

  const handleFillAddress = useCallback(
    async e => {
      e.currentTarget.maxLength = 9;
      let { value } = e.currentTarget;
      value = value.replace(/\D/g, '');
      value = value.replace(/^(\d{5})(\d)/, '$1-$2');
      e.currentTarget.value = value;

      if (value.length === 9) {
        handleVerifyCEP(e.currentTarget.value);
      }
      return e;
    },
    [handleVerifyCEP],
  );

  const handleSetAddressNumber = useCallback(event => {
    const value = event.target.value.replace(/\D/g, '');

    setAddressNumber(value);
  }, []);

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <Link to="/">
            <h1>KMP</h1>
          </Link>

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu cadastro</h1>

            <div className="form-container">
              <div className="block">
                <div>
                  <Input name="name" icon={FiUser} placeholder="Nome" />
                  <Input
                    name="user_name"
                    icon={FiUser}
                    placeholder="Nome de usuário"
                  />
                  <Input
                    name="email"
                    icon={FiMail}
                    placeholder="Email"
                    onBlur={e => {
                      setRepeatEmail(e.target.value);
                    }}
                  />
                  <Input
                    name="email_reentry"
                    icon={FiMail}
                    placeholder="Digite novamente seu Email"
                  />
                </div>

                <div>
                  {/* cpfcnpj */}
                  {/* <Input
                    name="cpf_cnpj"
                    icon={FiCircle}
                    placeholder="CPF / CNPJ"
                  /> */}

                  <Input
                    name="password"
                    icon={FiLock}
                    type="password"
                    placeholder="Senha"
                  />
                </div>
              </div>

              <div className="block cep-block">
                <div>
                  <Input
                    name="cep"
                    icon={FiCircle}
                    placeholder="CEP"
                    onChange={handleFillAddress}
                  />
                </div>
                <div>
                  <a
                    href="https://buscacepinter.correios.com.br/app/endereco/index.php?t"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      setCityField('');
                      setStateField('');
                      setNeighborhoodField('');
                      setStreetField('');
                    }}
                  >
                    Não sei meu Cep
                  </a>
                </div>
              </div>
              <div className="block">
                <div>
                  {!!stateField && stateField !== '' ? (
                    <Input
                      name="state"
                      icon={FiCircle}
                      placeholder="Estado"
                      value={stateField}
                    />
                  ) : (
                    <Input name="state" icon={FiCircle} placeholder="Estado" />
                  )}
                  {!!cityField && cityField !== '' ? (
                    <Input
                      name="city"
                      icon={FiCircle}
                      placeholder="Cidade"
                      value={cityField}
                    />
                  ) : (
                    <Input name="city" icon={FiCircle} placeholder="Cidade" />
                  )}

                  {!!neighborhoodField && neighborhoodField !== '' ? (
                    <Input
                      name="neighborhood"
                      icon={FiCircle}
                      placeholder="Bairro"
                      value={neighborhoodField}
                    />
                  ) : (
                    <Input
                      name="neighborhood"
                      icon={FiCircle}
                      placeholder="Bairro"
                    />
                  )}
                </div>

                <div>
                  {!!streetField && streetField !== '' ? (
                    <Input
                      name="street"
                      icon={FiCircle}
                      placeholder="Rua"
                      value={streetField}
                    />
                  ) : (
                    <Input name="street" icon={FiCircle} placeholder="Rua" />
                  )}

                  <Input
                    name="number"
                    icon={FiCircle}
                    placeholder="Número"
                    onChange={handleSetAddressNumber}
                    value={addressNumber}
                  />
                  <Input
                    name="complement"
                    icon={FiCircle}
                    placeholder="Complemento"
                  />
                </div>
              </div>
            </div>

            <Button type="submit">Cadastrar</Button>
          </Form>

          <Link to="/signin">
            <FiArrowLeft />
            Voltar para logon
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignUp;
