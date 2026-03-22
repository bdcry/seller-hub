import type { ReactElement } from 'react';
import { Button, ButtonGroup, Form, InputGroup } from 'react-bootstrap';
import styles from './ads-toolbar.module.css';
import type { TSortValue } from '../../../entities/ad/model/ads.types';

type TAdsToolbarProps = {
  totalAds?: number;
  searchValue?: string;
  sortValue?: TSortValue;
  layout?: 'grid' | 'list';
  onSearchChange?: (value: string) => void;
  onSortChange?: (value: TSortValue) => void;
  onLayoutChange?: (value: 'grid' | 'list') => void;
};

const GridIcon = (): ReactElement => {
  return (
    <svg
      aria-hidden="true"
      className={styles.icon}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1.5" y="1.5" width="5" height="5" rx="1" />
      <rect x="9.5" y="1.5" width="5" height="5" rx="1" />
      <rect x="1.5" y="9.5" width="5" height="5" rx="1" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
    </svg>
  );
};

const ListIcon = (): ReactElement => {
  return (
    <svg
      aria-hidden="true"
      className={styles.icon}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="2.5" cy="3" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="2.5" cy="8" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="2.5" cy="13" r="1.25" fill="currentColor" stroke="none" />
      <path d="M6 3H14" />
      <path d="M6 8H14" />
      <path d="M6 13H14" />
    </svg>
  );
};

const SearchIcon = (): ReactElement => {
  return (
    <svg
      aria-hidden="true"
      className={styles.icon}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="7" cy="7" r="4.75" />
      <path d="M10.5 10.5L14 14" />
    </svg>
  );
};

export const AdsToolbar = ({
  totalAds,
  searchValue = '',
  sortValue = 'createdAt-desc',
  layout = 'grid',
  onSearchChange,
  onSortChange,
  onLayoutChange,
}: TAdsToolbarProps): ReactElement => {
  return (
    <header className={styles.toolbar}>
      <div className={styles.info}>
        <h1 className={styles.title}>Мои объявления</h1>
        <p className={styles.count}>{totalAds ?? 0} объявления</p>
      </div>

      <div className={styles.controls}>
        <Form className={styles.search} role="search" onSubmit={(event) => event.preventDefault()}>
          <InputGroup className={styles.searchGroup}>
            <Form.Control
              type="search"
              placeholder="Найти объявление...."
              aria-label="Поиск объявлений"
              value={searchValue}
              onChange={(event) => onSearchChange?.(event.target.value)}
            />
            <InputGroup.Text className={styles.searchAddon}>
              <SearchIcon />
            </InputGroup.Text>
          </InputGroup>
        </Form>

        <ButtonGroup aria-label="Варианты отображения" className={styles.layoutSwitch}>
          <Button
            type="button"
            className={styles.layoutButton}
            data-active={layout === 'grid'}
            aria-pressed={layout === 'grid'}
            onClick={() => onLayoutChange?.('grid')}
          >
            <GridIcon />
          </Button>
          <Button
            type="button"
            className={styles.layoutButton}
            data-active={layout === 'list'}
            aria-pressed={layout === 'list'}
            onClick={() => onLayoutChange?.('list')}
          >
            <ListIcon />
          </Button>
        </ButtonGroup>

        <Form.Select
          aria-label="Сортировка объявлений"
          className={styles.sort}
          value={sortValue}
          onChange={(event) => onSortChange?.(event.target.value as TSortValue)}
        >
          <option value="createdAt-desc">По новизне (сначала новые)</option>
          <option value="createdAt-asc">По новизне (сначала старые)</option>
          <option value="title-asc">По названию (сначала А-Я)</option>
          <option value="title-desc">По названию (сначала Я-А)</option>
        </Form.Select>
      </div>
    </header>
  );
};
