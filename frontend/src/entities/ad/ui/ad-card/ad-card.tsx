import type { ReactElement } from 'react';
import { Card } from 'react-bootstrap';
import { getCategoryLabel } from '../../lib/get-category-label';
import type { TAd } from '../../model/ads.types';
import styles from './ad-card.module.css';

const placeholderImageSrc = '/placeholder-image.svg';

export const AdCard = ({ ad, layout }: { ad: TAd; layout: 'grid' | 'list' }): ReactElement => {
  return (
    <Card className={layout === 'grid' ? styles.card : styles.listCard}>
      <Card.Img
        variant="top"
        className={layout === 'grid' ? '' : styles.listImage}
        src={placeholderImageSrc}
        alt="Заглушка изображения товара"
      />
      <Card.Body className={styles.body}>
        <div className={styles.content}>
          <Card.Text className={styles.category}>{getCategoryLabel(ad.category)}</Card.Text>
          <Card.Title className={styles.title}>{ad.title}</Card.Title>
        </div>
        <div className={styles.footer}>
          <Card.Text className={styles.price}>{ad.price} ₽</Card.Text>
          {ad?.needsRevision && (
            <Card.Text
              className={
                layout === 'grid'
                  ? styles.needsRevision
                  : `${styles.needsRevision} ${styles.needsRevisionList}`
              }
            >
              Требует доработок
            </Card.Text>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};
