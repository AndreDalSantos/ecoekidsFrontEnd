/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../../components/Header';

import { Container, Content } from './styles';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';

import placeholderImg from '../../assets/avatar-placeholder.png';
import { useAuth } from '../../hooks/auth';

interface IUser {
  id: string;
  name: string;
  avatar: string;
  avatar_url: string;
}

interface IImage {
  image: File;
  photoUrl: string;
}

const ChangeAvatar: React.FC = () => {
  const [userInfo, setUserInfo] = useState<IUser>();
  const [newAvatar, setNewAvatar] = useState<IImage>();

  const { addToast } = useToast();
  const { user } = useAuth();

  const history = useHistory();

  useEffect(() => {
    async function loadUser(): Promise<void> {
      const response = await api.get(`/profile`);

      setUserInfo(response.data.user);
    }

    loadUser();
  }, []);

  const handleChangePhoto = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) {
        return;
      }

      const selectedImages = Array.from(event.target.files);

      for (let i = 0; i < selectedImages.length; i++) {
        if (selectedImages[i].size > 4000000) {
          addToast({
            type: 'error',
            title: 'Tamanho máximo de arquivo permitido = 4 MB',
            description: '',
          });

          return;
        }
      }

      const filterTypeImages = [] as File[];
      for (let i = 0; i < selectedImages.length; i++) {
        const aux = selectedImages[i].type;

        if (
          aux === 'image/jpeg' ||
          aux === 'image/png' ||
          aux === 'image/jpg'
        ) {
          filterTypeImages.push(selectedImages[i]);
        } else {
          addToast({
            type: 'error',
            title: 'Somente arquivos tipo jpeg, jpg ou png',
            description: '',
          });
        }
      }

      let photosList = [];
      for (let i = 0; i < filterTypeImages.length; i++) {
        photosList.push({
          image: filterTypeImages[i],
          photoUrl: URL.createObjectURL(filterTypeImages[i]),
        });
      }

      if (photosList.length > 1) {
        photosList = [];
        addToast({
          type: 'error',
          title: 'No máximo 1 foto!',
          description: '',
        });
      } else setNewAvatar(photosList[0]);
    },
    [addToast],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      try {
        event.preventDefault();

        const data = new FormData();

        if (!newAvatar) {
          addToast({
            type: 'error',
            title: 'Não é permitido submeter campo de imagem vazio!!',
            description: '',
          });

          return;
        }
        data.append('avatar', newAvatar.image);

        const response = await api.patch('/users/avatar', data);

        if (response.data.user.name.toUpperCase() === user.name.toUpperCase()) {
          addToast({
            type: 'success',
            title: 'Troca de avatar realizada com sucesso!',
            description: '',
          });

          history.push('/profile');
        } else {
          addToast({
            type: 'error',
            title: 'Ocorreu um erro, tente novamente mais tarde!',
            description: '',
          });
        }
      } catch (error) {
        const errorMessage = error.response.data.message;

        addToast({
          type: 'error',
          title: 'Um erro ocorreu',
          description: errorMessage,
        });
      }
    },
    [newAvatar, addToast, user, history],
  );

  return (
    <Container>
      <Header />

      <Content>
        <form className="edit-avatar-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Trocar avatar</legend>

            <div className="photo-block">
              <label htmlFor="photo">Avatar</label>

              <div className="image-container">
                <div>
                  <img
                    src={
                      newAvatar?.photoUrl ||
                      userInfo?.avatar_url ||
                      placeholderImg
                    }
                    alt={userInfo?.name}
                  />
                  <label htmlFor="photo[]" className="new-image">
                    {/* <FiEdit size={30} color="#f90" /> */}
                  </label>
                </div>

                <input
                  multiple
                  onChange={handleChangePhoto}
                  type="file"
                  id="photo[]"
                />
              </div>
            </div>
          </fieldset>

          <div className="button-edit">
            {!!newAvatar && (
              <button className="confirm-button" type="submit">
                Salvar alterações
              </button>
            )}
            {!newAvatar && (
              <button
                className="confirm-button"
                type="button"
                onClick={() => {
                  history.goBack();
                }}
              >
                Voltar
              </button>
            )}
          </div>
        </form>
      </Content>
    </Container>
  );
};

export default ChangeAvatar;
