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

  const { data: ads } = useQuery({
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

  // данные для пагинации
  const totalPage = Math.ceil((ads?.total ?? 0) / PAGE_SIZE);
  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = totalPage === 0 || currentPage === totalPage;

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
        </section>
      </div>
    </>
  );
};
