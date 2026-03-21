import { useQuery } from '@tanstack/react-query';
import { Card, ListGroup } from 'react-bootstrap';
import { getAds } from '../entities/ad/api/getAds';
import { getCategoryLabel } from '../entities/ad/lib/get-category-label';

const placeholderImageSrc = '/placeholder-image.svg';

const App = () => {
  const { data: ads } = useQuery({
    queryKey: ['ads'],
    queryFn: () => getAds(),
  });
  return (
    <main>
      <h1>Hello world</h1>
      <ListGroup as="ul">
        {ads?.items.map((ad, idx) => (
          <ListGroup.Item as="li" key={idx}>
            <Card style={{ width: '18rem' }}>
              <Card.Img
                variant="top"
                src={placeholderImageSrc}
                alt="Заглушка изображения товара"
              />
              <Card.Body>
                <Card.Text>{getCategoryLabel(ad.category)}</Card.Text>
                <Card.Title>{ad.title}</Card.Title>
                <Card.Text>{ad.price}</Card.Text>
              </Card.Body>
            </Card>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </main>
  );
};

export default App;
