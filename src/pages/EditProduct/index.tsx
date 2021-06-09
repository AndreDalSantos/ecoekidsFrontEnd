/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useCallback,
  useEffect,
  useState,
  ChangeEvent,
  FormEvent,
  useRef,
} from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { FiPlus, FiXCircle } from 'react-icons/fi';
import * as Yup from 'yup';

import { FormHandles } from '@unform/core';
import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import { Container } from './styles';
import { useAuth } from '../../hooks/auth';
import Header from '../../components/Header';
import getValidationErrors from '../../utils/getValidationErrors';

interface IUserAddress {
  id: string;
  state: string;
  city: string;
  neighborhood: string;
}

interface ICategoryItem {
  id: string;
  name: string;
}

interface IImage {
  image: File;
  photoUrl: string;
}

interface Product {
  id: string;
  title: string;
  quantity: number;
  price: string;
  category_id: string;
  sub_category_id: string;
  description: string;
  status: string;
  user_id: string;
  blocked_quantity: string;
  category: {
    id: string;
    name: string;
  };
  sub_category: {
    id: string;
    name: string;
  };
  productFiles: Array<{
    id: string;
    name: string;
    path: string;
    product_id: string;
    image_url: string;
  }>;
}

interface ProductParams {
  product_id: string;
}

interface IAuxCategory {
  id: string;
  name: string;
}

interface IProductImage {
  id: string;
  name: string;
  path: string;
  product_id: string;
  image_url: string;
}

interface ISubCategories {
  id: string;
  name: string;
  category_id: string;
}

interface IAuxSubCategory {
  id: string;
  name: string;
}

const EditProduct: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const params = useParams<ProductParams>();
  const { addToast } = useToast();
  const history = useHistory();
  const { user } = useAuth();
  const [seller_address, setSellerAddress] = useState<IUserAddress>();
  const [categories, setCategories] = useState<ICategoryItem[]>([]);

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [blockedQuantity, setBlockedQuantity] = useState(0);
  const [category_id, setCategory_id] = useState('');
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  const [height, setHeight] = useState('');
  const [diameter, setDiameter] = useState('');
  const [box_shape, setBoxShape] = useState('');
  const [images, setImages] = useState<IImage[]>([]);
  const [status, setStatus] = useState('');
  const [existentImages, setExistentImages] = useState<IProductImage[]>([]);
  const [auxCategory, setAuxCategory] = useState<IAuxCategory>();
  const [pressDeleteButton, setPressDeleteButton] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(0);
  const [quantityAlert, setQuantityAlert] = useState(false);

  const [subCategories, setSubCategories] = useState<ISubCategories[]>([]);
  const [subCategoryId, setSubCategoryId] = useState('');
  const [auxSubCategory, setAuxSubCategory] = useState<IAuxSubCategory>();

  useEffect(() => {
    async function load(): Promise<void> {
      handleGetUserAddressId(user.id);

      const categoriesList = await api.get('/categories');
      setCategories(categoriesList.data);

      setWeight('0.1');
      setWidth('10');
      setHeight('10');
      setLength('10');
      setDiameter('0');
      setBoxShape('1');

      const getProduct = await api.get(`products/show/${params.product_id}`);

      if (getProduct.data.productShow.deleted === '1') {
        addToast({
          type: 'error',
          title: 'Este anúncio foi removido.',
          description: '',
        });

        history.push(`/list-my-products-ads`);
      }

      handleSetInitialValues(getProduct.data.productShow);
    }

    load();
  }, [user, params, addToast, history]);

  async function handleSetInitialValues(product: Product) {
    setTitle(product.title);

    const formatedPrice = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(product.price));

    setPrice(formatedPrice);

    setQuantity(String(product.quantity));
    setCategory_id(product.category_id);

    const subCategoriesList = await api.get(
      `sub_categories/${product.category.id}`,
    );

    setSubCategories(subCategoriesList.data.subCategories);
    if (product.sub_category_id) setSubCategoryId(product.sub_category_id);

    setDescription(product.description);
    setStatus(product.status);
    setBlockedQuantity(Number(product.blocked_quantity));

    setAuxCategory({ id: product.category.id, name: product.category.name });
    if (product.sub_category_id) {
      setAuxSubCategory({
        id: product.sub_category.id,
        name: product.sub_category.name,
      });
    }

    const existentImagesList = product.productFiles.map(item => {
      return item;
    });

    setExistentImages(existentImagesList);
  }

  function handleGetUserAddressId(userId: string): any {
    api.get(`adresses/${userId}`).then(response => {
      setSellerAddress(response.data[0]);
    });
  }

  const getCategoryId = useCallback(e => {
    async function loadSubCategories(categoryId: string) {
      const subCategoriesList = await api.get(`sub_categories/${categoryId}`);
      setSubCategories(subCategoriesList.data.subCategories);
    }

    setCategory_id(e.target.value);
    setAuxCategory({ id: 'no-value', name: '' });
    setAuxSubCategory({ id: 'no-value', name: '' });
    setSubCategoryId('');
    loadSubCategories(e.target.value);
  }, []);

  const getSubCategoryId = useCallback(e => {
    setSubCategoryId(e.target.value);
    setAuxSubCategory({ id: 'no-value', name: '' });
  }, []);

  const getStatus = useCallback(e => {
    setStatus(e.target.value);
  }, []);

  function handleSelectImages2(event: ChangeEvent<HTMLInputElement>) {
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

      if (aux === 'image/jpeg' || aux === 'image/png' || aux === 'image/jpg') {
        filterTypeImages.push(selectedImages[i]);
      } else {
        addToast({
          type: 'error',
          title: 'Somente arquivos tipo jpeg, jpg ou png',
          description: '',
        });
      }
    }

    for (let i = 0; i < images.length; i++) {
      filterTypeImages.push(images[i].image);
    }
    let photosList = [];
    for (let i = 0; i < filterTypeImages.length; i++) {
      photosList.push({
        image: filterTypeImages[i],
        photoUrl: URL.createObjectURL(filterTypeImages[i]),
      });
    }

    if (existentImages.length + photosList.length > 5) {
      photosList = [];
      addToast({
        type: 'error',
        title: 'No máximo 5 imagens!',
        description: '',
      });
    } else setImages(photosList);
  }

  function handleRemovePhoto(photo: IImage) {
    const auxPhotos = images.filter(item => {
      return item !== photo;
    });

    setImages(auxPhotos);
  }

  function handleRemoveExistentPhoto(photo: IProductImage) {
    const auxPhotos = existentImages.filter(item => {
      return item.id !== photo.id;
    });

    setExistentImages(auxPhotos);
  }

  async function handleConfirmProductRemove() {
    setConfirmDelete(1);

    await api.delete(`/products/${params.product_id}`);

    addToast({
      type: 'success',
      title: 'Anúncio de produto removido com sucesso!',
      description: '',
    });

    history.push('/');
  }

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      try {
        event.preventDefault();
        formRef.current?.setErrors({});

        const data = new FormData();

        const sellerAddressId = seller_address?.id ? seller_address.id : '';

        const value = Number(price.replace(/\D/g, ''));

        const data2 = {
          title,
          price: (value / 100).toString(),
          quantity,
          category_id: category_id || auxCategory?.id || '',
          sub_category_id: subCategoryId || auxSubCategory?.id || '',
          description,
          weight,
          width,
          length,
          height,
          diameter,
          box_shape,
          seller_address_id: sellerAddressId,
          status,
        };

        const schema = Yup.object().shape({
          title: Yup.string().required('Título do anúncio obrigatório.'),
          price: Yup.string().required(
            'Valor unitário do produto do anúncio obrigatório.',
          ),
          quantity: Yup.string().required(
            'Quantidade de itens no anúncio obrigatório.',
          ),
          category_id: Yup.string().required(
            'Selecione uma categoria adequada ao seu anúncio (Obrigatório).',
          ),
          sub_category_id: Yup.string().optional(),
          description: Yup.string().required('Faça uma descrição do anúncio.'),
          weight: Yup.string().required(),
          width: Yup.string().required(),
          length: Yup.string().required(),
          height: Yup.string().required(),
          diameter: Yup.string().required(),
          box_shape: Yup.string().required(),
          seller_address_id: Yup.string().required(),
          status: Yup.string().required(
            'Selecione uma situação (disponível ou indisponível) do anúncio.',
          ),
        });

        await schema.validate(data2, {
          abortEarly: false,
        });

        data.append('title', data2.title);
        data.append('price', data2.price);
        data.append('quantity', data2.quantity);
        data.append('category_id', data2.category_id);
        if (subCategoryId && subCategoryId !== 'no-value')
          data.append('sub_category_id', data2.sub_category_id);
        data.append('description', data2.description);
        data.append('weight', data2.weight);
        data.append('width', data2.width);
        data.append('length', data2.length);
        data.append('height', data2.height);
        data.append('diameter', data2.diameter);
        data.append('box_shape', data2.box_shape);
        data.append('seller_address_id', data2.seller_address_id);
        data.append('status', data2.status);

        images.forEach(item => {
          data.append('photos', item.image);
        });

        existentImages.forEach(item => {
          data.append('existent_photos_ids', item.id);
        });

        await api.put(`/products/${params.product_id}`, data);

        addToast({
          type: 'success',
          title: 'Anúncio de produto atualizado com sucesso!',
          description: '',
        });

        history.push('/authenticated-home');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);

          addToast({
            type: 'error',
            title: 'Um erro ocorreu',
            description: error.message,
          });

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
    [
      title,
      price,
      quantity,
      category_id,
      subCategoryId,
      description,
      weight,
      width,
      length,
      height,
      diameter,
      box_shape,
      seller_address,
      addToast,
      history,
      images,
      existentImages,
      params,
      auxCategory,
      status,
      auxSubCategory,
    ],
  );

  const handleSetNewQuantity = useCallback(
    event => {
      const aux = Number(event.target.value.replace(/\D/g, ''));

      // const aux = Number(event.target.value);
      if (aux < blockedQuantity) {
        setQuantityAlert(true);

        addToast({
          type: 'error',
          title:
            'Quantidade insuficiente devido a negociações em aberto para este anúncio',
          description: '',
        });
      } else {
        setQuantityAlert(false);
      }
      setQuantity(aux.toString());
    },
    [blockedQuantity, addToast],
  );

  return (
    <Container>
      <Header />

      <div className="content">
        <h1>Edição de anúncio de produto</h1>

        <form onSubmit={handleSubmit} className="edit-product-form">
          <fieldset>
            <legend>Dados do anúncio: </legend>

            <div className="input-block">
              <label htmlFor="title">Título do anúncio</label>
              <input
                id="name"
                value={title}
                onChange={event => setTitle(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="price">Preço unitário</label>
              <input
                id="name"
                value={price}
                onChange={event => {
                  const value = Number(event.target.value.replace(/\D/g, ''));

                  const formatedPrice = new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(value / 100);

                  setPrice(formatedPrice);
                }}
                className="number-input"
              />
            </div>

            <div className="input-block">
              <label htmlFor="quantity">
                Quantidade deste produto que você deseja anunciar
              </label>
              <input
                id="name"
                value={quantity}
                onChange={handleSetNewQuantity}
                className="number-input"
              />
            </div>

            <div className={`quantity-alert ${!quantityAlert && 'inactive'}`}>
              {quantityAlert && (
                <span>
                  * OBS: Existem <strong>{blockedQuantity}</strong> unidade(s)
                  em negociações em aberto deste anúncio, caso for atualizar a
                  quantidade, a nova quantidade deverá ser maior ou igual a{' '}
                  <strong>{blockedQuantity}</strong>!
                </span>
              )}
            </div>

            <div className="select-block">
              <label>Disponibilidade:</label>
              <select onChange={getStatus}>
                {status === '1' ? (
                  <option value="1" selected>
                    Disponível
                  </option>
                ) : (
                  <option value="1">Ativo</option>
                )}

                {status === '0' ? (
                  <option value="0" selected>
                    Indisponível
                  </option>
                ) : (
                  <option value="0">Inativo</option>
                )}
              </select>
            </div>

            <div className="select-block">
              <label>Categoria:</label>
              <select onChange={getCategoryId}>
                {/* <option>Selecione a categoria</option> */}
                {auxCategory?.id !== 'no-value' ? (
                  <option value={auxCategory?.id}>{auxCategory?.name}</option>
                ) : (
                  ''
                )}
                {categories &&
                  categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="select-block">
              <label>Sub-categoria:</label>
              <select onChange={getSubCategoryId}>
                {auxSubCategory?.id === 'no-value' && (
                  <option>Selecione a sub-categoria</option>
                )}
                {auxSubCategory?.id !== 'no-value' ? (
                  <option value={auxSubCategory?.id}>
                    {auxSubCategory?.name}
                  </option>
                ) : (
                  ''
                )}
                {subCategories &&
                  subCategories.map(subCategory => (
                    <option key={subCategory.id} value={subCategory.id}>
                      {subCategory.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="text-area-block">
              <label htmlFor="description">
                Descrição do produto <span>(Máximo de 300 caracteres)</span>
              </label>
              <textarea
                id="name"
                maxLength={300}
                cols={45}
                rows={10}
                value={description}
                onChange={event => setDescription(event.target.value)}
              />
            </div>

            <div className="photos-block">
              <label htmlFor="photos">Fotos</label>

              <div className="images-container">
                {existentImages.map(photo => {
                  return (
                    <div key={photo.id}>
                      <img src={photo.image_url} alt={title} />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistentPhoto(photo)}
                      >
                        <label>
                          <FiXCircle size={60} color="#15b6d6" />
                        </label>
                      </button>
                    </div>
                  );
                })}

                {images.map(photo => {
                  return (
                    <div>
                      <img
                        key={photo.photoUrl}
                        src={photo.photoUrl}
                        alt={title}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(photo)}
                      >
                        <label>
                          <FiXCircle size={60} color="#15b6d6" />
                        </label>
                      </button>
                    </div>
                  );
                })}

                <label htmlFor="photo[]" className="new-image">
                  <FiPlus size={60} color="#15b6d6" />
                </label>
              </div>

              <input
                multiple
                onChange={handleSelectImages2}
                type="file"
                id="photo[]"
              />
            </div>
          </fieldset>

          <div className="buttons-edit">
            {pressDeleteButton === 0 && !quantityAlert && (
              <button className="confirm-button" type="submit">
                Salvar alterações
              </button>
            )}

            {pressDeleteButton === 0 && quantityAlert && (
              <button className="false-button" type="button">
                Salvar alterações
              </button>
            )}

            <div>
              {pressDeleteButton === 0 && confirmDelete === 0 ? (
                <button
                  className="delete-button"
                  type="button"
                  onClick={() => {
                    setPressDeleteButton(1);
                  }}
                >
                  Excluir anúncio
                </button>
              ) : (
                ''
              )}
              {pressDeleteButton === 1 && confirmDelete === 0 ? (
                <div className="removing">
                  <h3>Confirmar remoção deste anúncio?</h3>
                  <div className="remove-commands">
                    <button
                      className="confirm-delete-button"
                      type="button"
                      onClick={handleConfirmProductRemove}
                    >
                      SIM
                    </button>

                    <button
                      className="cancel-button"
                      type="button"
                      onClick={() => {
                        setPressDeleteButton(0);
                      }}
                    >
                      NÃO
                    </button>
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default EditProduct;
