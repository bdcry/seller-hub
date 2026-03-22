import { useQuery } from '@tanstack/react-query';
import { type ReactElement } from 'react';
import { getAds } from '../../../entities/ad/api/getAds';
import { AdsList } from '../../../widgets/ads-list/ui/ads-list';
import { AdsToolbar } from '../../../widgets/ads-toolbar/ui/ads-toolbar';
import { AdsFilters } from '../../../widgets/ads-filters/ui/ads-filters';
import styles from './ads-list-page.module.css';
import { Pagination } from 'react-bootstrap';

let active = 2;
let items = [];
for (let number = 1; number <= 5; number++) {
  items.push(
    <Pagination.Item key={number} active={number === active}>
      {number}
    </Pagination.Item>,
  );
}

export const AdsListPage = (): ReactElement => {
  const { data: ads } = useQuery({
    queryKey: ['ads'],
    queryFn: () => getAds(),
  });

  return (
    <>
      <AdsToolbar totalAds={ads?.total} />
      <div className={styles.content}>
        <aside>
          <AdsFilters />
        </aside>

        <section className={styles.sectionAds}>
          <AdsList items={ads?.items ?? []} />
          {/* пока заглушка пагинации */}
          <Pagination>{items}</Pagination>
        </section>
      </div>
    </>
  );
};
