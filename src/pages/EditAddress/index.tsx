/* eslint-disable react/button-has-type */
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import { FiCircle } from 'react-icons/fi';
import { ProfileContainer, BlockProfile } from './styles';

import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

import Input from '../../components/Input';
import Header from '../../components/Header';
import getValidationErrors from '../../utils/getValidationErrors';

interface UpdateFormData {
  id: string;
  cep: string;
  country: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
  password: string;
}

interface IAddress {
  id: string;
  cep: string;
  country: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
}

const UpdateAddress: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [userAdresses, setUserAdresses] = useState<IAddress[]>([]);

  const [cityField, setCityField] = useState('');
  const [stateField, setStateField] = useState('');
  const [neighborhoodField, setNeighborhoodField] = useState('');
  const [streetField, setStreetField] = useState('');
  const [addressNumber, setAddressNumber] = useState('');

  const { user } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();

  useEffect(() => {
    api.get(`/adresses/my_address/${user?.id}`).then(response => {
      setUserAdresses(response.data);
      setCityField(response.data[0].city);
      setStateField(response.data[0].state);
      setNeighborhoodField(response.data[0].neighborhood);
      setStreetField(response.data[0].street);
    });

    // api.get(`/adresses/${user?.id}`).then(response => {
    //   setUserAdresses(response.data);
    //   setCityField(response.data[0].city);
    //   setStateField(response.data[0].state);
    //   setNeighborhoodField(response.data[0].neighborhood);
    //   setStreetField(response.data[0].street);
    // });
  }, [user]);

  const handleUpdateAddress = useCallback(
    async (data: UpdateFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          cep: Yup.string().required(),
          state: Yup.string().required(),
          city: Yup.string().required(),
          neighborhood: Yup.string().required(
            'Obrigatório incluir seu bairro.',
          ),
          street: Yup.string().required('Obrigatório incluir seu logradouro'),
          number: Yup.string().optional(),
          complement: Yup.string().optional(),
          password: Yup.string().required('Digite sua senha.'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const newData = {
          cep: data.cep,
          state: data.state,
          city: data.city,
          neighborhood: data.neighborhood,
          street: data.street,
          number: data.number,
          complement: data.complement,
          password: data.password,
        };
        let addressValues = {};
        addressValues = {
          ...addressValues,
          ...newData,
          id: userAdresses[0].id,
          country: 'Brasil',
        };

        await api.put('/adresses', { ...addressValues });

        addToast({
          type: 'success',
          title: 'Endereço atualizado com sucesso!',
          description: '',
        });

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
          title: 'Um erro ocorreu',
          description: errorMessage,
        });
      }
    },
    [history, userAdresses, addToast],
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
        const errorMessage = error.response.data.message;

        addToast({
          type: 'error',
          title: 'Um erro ocorreu',
          description: errorMessage,
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
    <div>
      <Header />
      <ProfileContainer>
        <BlockProfile>
          <Form
            className="form-search-container"
            ref={formRef}
            onSubmit={handleUpdateAddress}
            initialData={userAdresses[0]}
          >
            <p>CEP: </p>
            <Input name="cep" icon={FiCircle} onChange={handleFillAddress} />

            <div className="cep-buttons">
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
            <br />

            <p>Cidade: </p>
            {!!cityField && cityField !== '' ? (
              <Input name="city" icon={FiCircle} value={cityField} />
            ) : (
              <Input name="city" icon={FiCircle} />
            )}

            <br />

            <p>Estado: </p>
            {!!stateField && stateField !== '' ? (
              <Input name="state" icon={FiCircle} value={stateField} />
            ) : (
              <Input name="state" icon={FiCircle} />
            )}

            <br />

            <p>Bairro: </p>
            {!!neighborhoodField && neighborhoodField !== '' ? (
              <Input
                name="neighborhood"
                icon={FiCircle}
                value={neighborhoodField}
              />
            ) : (
              <Input name="neighborhood" icon={FiCircle} />
            )}

            <br />

            <p>Logradouro </p>
            {!!streetField && streetField !== '' ? (
              <Input name="street" icon={FiCircle} value={streetField} />
            ) : (
              <Input name="street" icon={FiCircle} />
            )}

            <br />

            <p>Número </p>
            {!!addressNumber && addressNumber !== '' ? (
              <Input
                name="number"
                onChange={handleSetAddressNumber}
                value={addressNumber}
                icon={FiCircle}
              />
            ) : (
              <Input
                name="number"
                icon={FiCircle}
                onChange={handleSetAddressNumber}
              />
            )}
            <br />

            <p>Complemento </p>
            <Input name="complement" icon={FiCircle} />
            <br />

            <p>Senha: </p>
            <Input
              name="password"
              type="password"
              placeholder="digite sua senha"
              icon={FiCircle}
            />
            <br />

            <button type="submit">Salvar</button>
          </Form>
        </BlockProfile>
      </ProfileContainer>
    </div>
  );
};

export default UpdateAddress;
