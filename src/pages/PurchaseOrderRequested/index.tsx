import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { Container } from './styles';

const PurchaseOrderRequested: React.FC = () => {
  const location = useLocation();

  /**
   * dados do produto:
   * titulo
   * descrição
   * quantidade
   * preço unitário
   * valor total
   *
   * dados do vendedor:
   * nome
   * email
   * cidade
   * estado
   * bairro
   */

  useEffect(() => {
    // pegar o product_id, seller_id e quantidade do location.search
    const parameters = location.search;
    console.log(parameters);

    const params2 = parameters.slice(3, 6);
    console.log(params2);

    // buscar o produto pelo product_id

    // buscar os dados do vendedor pelo seller id
  }, [location]);

  return (
    <Container>
      <h1>Olá mundo</h1>
    </Container>
  );
};

export default PurchaseOrderRequested;
