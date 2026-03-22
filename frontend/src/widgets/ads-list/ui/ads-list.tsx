import type { ReactElement } from 'react';
import type { TAd } from '../../../entities/ad/model/ads.types';
import { AdCard } from '../../../entities/ad/ui/ad-card/ad-card';
import styles from './ads-list.module.css';

type TAdsListProps = {
  items: TAd[];
};

export const AdsList = ({ items }: TAdsListProps): ReactElement => {
  return (
    <ul className={styles.list}>
      {items.map((ad) => (
        <li key={ad.id}>
          <AdCard ad={ad} />
        </li>
      ))}
    </ul>
  );
};
