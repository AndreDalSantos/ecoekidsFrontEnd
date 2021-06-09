/* eslint-disable react/button-has-type */
import React, { useCallback, useEffect, useState } from 'react';

import { useHistory } from 'react-router-dom';
import { ProfileContainer, BlockProfile } from './styles';

import api from '../../services/api';

import Header from '../../components/Header';

import avatarPlaceholder from '../../assets/avatar-placeholder.png';

interface IUser {
  id: string;
  name: string;
  user_name: string;
  email: string;
  // cpf_cnpj: string; // cpfcnpj
  reputation: string;
  avatar_url: string;
}

interface IAddress {
  id: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<IUser>();
  const [adresses, setAdresses] = useState<IAddress[]>([]);

  const handleGetAdresses = useCallback(async (user_id: string) => {
    // const response = await api.get(`/adresses/${user_id}`);
    const response = await api.get(`/adresses/my_address/${user_id}`);

    setAdresses(response.data);
  }, []);

  const history = useHistory();

  useEffect(() => {
    async function loadProfile(): Promise<void> {
      const response = await api.get(`/profile`);

      setUser(response.data.user);
      handleGetAdresses(response.data.user.id);
    }

    loadProfile();
  }, [handleGetAdresses]);

  return (
    <ProfileContainer>
      <Header />

      <div className="content">
        <BlockProfile>
          <p>
            Nome: <strong>{user?.name}</strong>
          </p>
          <p>
            Email: <strong>{user?.email}</strong>
          </p>
          <p>
            Nome de usuário: <strong>{user?.user_name}</strong>
          </p>

          {/* cpfcnpj */}
          {/* <p>
            CPF/CNPJ: <strong>{user?.cpf_cnpj}</strong>
          </p> */}

          <div className="reputation-container">
            <p>Reputação: </p>
            <div className="reputation-value-container">
              <div
                className={
                  user && Number(user.reputation) >= 1
                    ? 'reputation-number active-reputation-value'
                    : 'reputation-number'
                }
              >
                1
              </div>
              <div
                className={
                  user && Number(user.reputation) >= 2
                    ? 'reputation-number active-reputation-value'
                    : 'reputation-number'
                }
              >
                2
              </div>
              <div
                className={
                  user && Number(user.reputation) >= 3
                    ? 'reputation-number active-reputation-value'
                    : 'reputation-number'
                }
              >
                3
              </div>
              <div
                className={
                  user && Number(user.reputation) >= 4
                    ? 'reputation-number active-reputation-value'
                    : 'reputation-number'
                }
              >
                4
              </div>
              <div
                className={
                  user && Number(user.reputation) >= 5
                    ? 'reputation-number active-reputation-value'
                    : 'reputation-number'
                }
              >
                5
              </div>
            </div>
          </div>

          {/* <p>
            Reputação: <strong>{user?.reputation}</strong>
          </p> */}
          <img src={user?.avatar_url || avatarPlaceholder} alt={user?.name} />
          <h3>Endreço:</h3>
          <div className="adresses">
            {adresses.map(item => {
              return (
                <div className="address" key={item.id}>
                  <p>
                    Cidade: <strong>{item.city}</strong>
                  </p>
                  <p>
                    Estado: <strong>{item.state}</strong>
                  </p>
                  <p>
                    CEP: <strong>{item.cep}</strong>
                  </p>
                  <p>
                    Logradouro: <strong>{item.street}</strong>
                  </p>
                  <p>
                    Numero: <strong>{item.number}</strong>
                  </p>
                  <p>
                    Complemento: <strong>{item.complement}</strong>
                  </p>
                  <p>
                    Bairro: <strong>{item.neighborhood}</strong>
                  </p>
                </div>
              );
            })}
          </div>
        </BlockProfile>

        <div className="edit-buttons">
          <div className="edit-link-container">
            <button
              type="button"
              onClick={() => {
                history.push('/edit-profile');
              }}
            >
              Editar perfil
            </button>
          </div>

          <div className="edit-link-container">
            <button
              type="button"
              className="address"
              onClick={() => {
                history.push('/edit-address');
              }}
            >
              Atualizar endereço
            </button>
          </div>

          <div className="edit-link-container">
            <button
              type="button"
              className="avatar"
              onClick={() => {
                history.push('/edit-avatar');
              }}
            >
              Atualizar avatar
            </button>
          </div>
        </div>
      </div>
    </ProfileContainer>
  );
};

export default Profile;
