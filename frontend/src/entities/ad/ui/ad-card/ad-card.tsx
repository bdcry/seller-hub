import type { ReactElement } from 'react';
import { Card } from 'react-bootstrap';
import { getCategoryLabel } from '../../lib/get-category-label';
import type { TAd } from '../../model/ads.types';
import styles from './ad-card.module.css';

const placeholderImageSrc = '/placeholder-image.svg';

export const AdCard = ({ ad }: { ad: TAd }): ReactElement => {
  return (
    <Card className={styles.card}>
      <Card.Img variant="top" src={placeholderImageSrc} alt="Заглушка изображения товара" />
      <Card.Body className={styles.body}>
        <Card.Text className={styles.category}>{getCategoryLabel(ad.category)}</Card.Text>
        <Card.Title className={styles.title}>{ad.title}</Card.Title>
        <Card.Text className={styles.price}>{ad.price} ₽</Card.Text>
      </Card.Body>
    </Card>
  );
};
