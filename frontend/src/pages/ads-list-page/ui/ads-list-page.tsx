import { useQuery } from '@tanstack/react-query';
import { useState, type ReactElement } from 'react';
import { getAds } from '../../../entities/ad/api/getAds';
import { AdsList } from '../../../widgets/ads-list/ui/ads-list';
import { AdsToolbar } from '../../../widgets/ads-toolbar/ui/ads-toolbar';
import { AdsFilters } from '../../../widgets/ads-filters/ui/ads-filters';
import styles from './ads-list-page.module.css';
import { Pagination } from 'react-bootstrap';
import { adsSortMap } from '../../../entities/ad/lib/ads-sort-map';
import { type TAdCategory, type TSortValue } from '../../../entities/ad/model/ads.types';

const active = 2;
const items: ReactElement[] = [];
for (let number = 1; number <= 5; number++) {
  items.push(
    <Pagination.Item key={number} active={number === active}>
      {number}
    </Pagination.Item>,
  );
}

export const AdsListPage = (): ReactElement => {
  // состояние для тулбара
  const [searchValue, setSearchValue] = useState<string>('');
  const [sortValue, setSortValue] = useState<TSortValue>('createdAt-desc');
  const sortParams = adsSortMap[sortValue];

  // состояние для фильтров
  const [selectedCategories, setSelectedCategories] = useState<TAdCategory[]>([]);
  const [needsRevision, setNeedsRevision] = useState<boolean>(false);

  const { data: ads } = useQuery({
    queryKey: ['ads', searchValue, sortValue, needsRevision, selectedCategories],
    queryFn: () =>
      getAds({
        q: searchValue,
        ...sortParams,
        needsRevision,
        categories: selectedCategories.join(','),
      }),
  });

  // обработчики для тулбара
  const onSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const onSortChange = (value: TSortValue) => {
    setSortValue(value);
  };

  // обработчики для фильтров
  const onCategoryChange = (category: TAdCategory) => {
    setSelectedCategories((prevCat) => {
      if (prevCat.includes(category)) {
        return prevCat.filter((cat) => cat !== category);
      } else {
        return [...prevCat, category];
      }
    });
  };

  const onNeedsRevisionChange = (value: boolean) => {
    setNeedsRevision(value);
  };

  const onResetFilters = () => {
    setSelectedCategories([]);
    setNeedsRevision(false);
  };

  return (
    <>
      <AdsToolbar
        totalAds={ads?.total}
        onSearchChange={onSearchChange}
        searchValue={searchValue}
        onSortChange={onSortChange}
        sortValue={sortValue}
      />
      <div className={styles.content}>
        <aside>
          <AdsFilters
            selectedCategories={selectedCategories}
            onCategoryChange={onCategoryChange}
            needsRevision={needsRevision}
            onNeedsRevisionChange={onNeedsRevisionChange}
            onResetFilters={onResetFilters}
          />
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
