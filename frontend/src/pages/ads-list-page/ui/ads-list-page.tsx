import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState, type ReactElement } from 'react';
import { getAds } from '../../../entities/ad/api/getAds';
import { AdsList } from '../../../widgets/ads-list/ui/ads-list';
import { AdsToolbar } from '../../../widgets/ads-toolbar/ui/ads-toolbar';
import { AdsFilters } from '../../../widgets/ads-filters/ui/ads-filters';
import styles from './ads-list-page.module.css';
import { Alert, Pagination, Spinner } from 'react-bootstrap';
import { adsSortMap } from '../../../entities/ad/lib/ads-sort-map';
import { type TAdCategory, type TSortValue } from '../../../entities/ad/model/ads.types';

const PAGE_SIZE = 10;

export const AdsListPage = (): ReactElement => {
  // состояние для тулбара
  const [searchValue, setSearchValue] = useState<string>('');
  const [sortValue, setSortValue] = useState<TSortValue>('createdAt-desc');
  const sortParams = adsSortMap[sortValue];

  // состояние для фильтров
  const [selectedCategories, setSelectedCategories] = useState<TAdCategory[]>([]);
  const [needsRevision, setNeedsRevision] = useState<boolean>(false);

  // пагинация
  const [currentPage, setCurrentPage] = useState<number>(1);

  const {
    data: ads,
    isPending,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ['ads', searchValue, sortValue, needsRevision, selectedCategories, currentPage],
    queryFn: () =>
      getAds({
        q: searchValue,
        ...sortParams,
        needsRevision,
        categories: selectedCategories.join(','),
        limit: PAGE_SIZE,
        skip: (currentPage - 1) * PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
  });

  // обработчики для тулбара
  const onSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const onSortChange = (value: TSortValue) => {
    setSortValue(value);
    setCurrentPage(1);
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
    setCurrentPage(1);
  };

  const onNeedsRevisionChange = (value: boolean) => {
    setNeedsRevision(value);
    setCurrentPage(1);
  };

  const onResetFilters = () => {
    setSelectedCategories([]);
    setNeedsRevision(false);
    setCurrentPage(1);
  };

  // переключение расположения карточек (сетка или список)
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

  const handleLayoutChange = (newLayout: 'grid' | 'list') => {
    setLayout(newLayout);
  };

  // данные для пагинации
  const adsItems = ads?.items ?? [];
  const totalAds = ads?.total ?? 0;
  const totalPage = Math.ceil(totalAds / PAGE_SIZE);
  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = totalPage === 0 || currentPage === totalPage;
  const hasItems = adsItems.length > 0;
  let adsContent: ReactElement;

  if (isPending) {
    adsContent = (
      <div className={styles.stateBlock}>
        <Spinner animation="border" role="status" variant="primary" />
        <p className={styles.stateText}>Загружаем объявления...</p>
      </div>
    );
  } else if (isError) {
    adsContent = (
      <Alert variant="danger" className={styles.stateAlert}>
        Не удалось загрузить объявления.
      </Alert>
    );
  } else if (hasItems) {
    adsContent = (
      <>
        {isFetching && (
          <div className={styles.fetchingIndicator}>
            <Spinner animation="border" role="status" size="sm" />
            <span className={styles.fetchingText}>Обновляем список...</span>
          </div>
        )}
        <AdsList items={adsItems} layout={layout} />
        <Pagination>
          <Pagination.Prev
            disabled={isPrevDisabled}
            onClick={() => setCurrentPage(currentPage - 1)}
          />
          {totalPage > 1 &&
            new Array(totalPage).fill(0).map((_, index) => (
              <Pagination.Item
                key={index}
                active={index + 1 === currentPage}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          <Pagination.Next
            disabled={isNextDisabled}
            onClick={() => setCurrentPage(currentPage + 1)}
          />
        </Pagination>
      </>
    );
  } else {
    adsContent = (
      <div className={styles.stateBlock}>
        <p className={styles.stateText}>Ничего не найдено.</p>
      </div>
    );
  }

  return (
    <>
      <AdsToolbar
        totalAds={totalAds}
        onSearchChange={onSearchChange}
        searchValue={searchValue}
        onSortChange={onSortChange}
        sortValue={sortValue}
        layout={layout}
        onLayoutChange={handleLayoutChange}
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
        <section className={styles.sectionAds}>{adsContent}</section>
      </div>
    </>
  );
};
