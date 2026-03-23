import { useQuery } from '@tanstack/react-query';
import type { ReactElement } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAdDetails } from '../../entities/ad/api/getAdDetails';

import styles from './ad-details-page.module.css';
import { Alert, Button, Spinner } from 'react-bootstrap';
import {
  getMissingFields,
  getParamlabel,
  getParamValueLabel,
} from '../../entities/ad/lib/get-param-labels';

const placeholderImageSrc = '../../../public/placeholder-image.svg';

export const AdDetailsPage = (): ReactElement => {
  const params = useParams();
  const navigate = useNavigate();

  const {
    data: adDetails,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['ad', params.id],
    queryFn: () => getAdDetails(String(params.id)),
  });

  if (isPending) {
    return (
      <div className={styles.stateBlock}>
        <Spinner animation="border" role="status" variant="primary" />
        <p className={styles.stateText}>Загружаем объявление...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="danger" className={styles.stateAlert}>
        Не удалось загрузить объявление.
      </Alert>
    );
  }

  if (!adDetails) {
    return (
      <div className={styles.stateBlock}>
        <p className={styles.stateText}>Объявление не найдено.</p>
      </div>
    );
  }

  const formatAdDate = (value: string) => {
    if (!value) return '';
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    })
      .format(new Date(value))
      .replace(' в ', ' ');
  };

  const paramsEntries = Object.entries(adDetails.params);
  const missingFields = getMissingFields(adDetails);

  const handleNavigateToEdit = () => {
    void navigate('edit');
  };

  const handleNavigateToList = () => {
    void navigate('/ads');
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <h1 className={styles.title}>{adDetails.title}</h1>
          <div className={styles.buttonsContainer}>
            <Button variant="outline-primary" className={styles.btn} onClick={handleNavigateToList}>
              Назад к списку
            </Button>
            <Button variant="primary" className={styles.btn} onClick={handleNavigateToEdit}>
              Редактировать
            </Button>
          </div>
        </div>
        <div className={styles.infoContainer}>
          <span className={styles.price}>{adDetails.price} ₽</span>
          <div className={styles.date}>
            <span>Опубликовано: {formatAdDate(adDetails.createdAt)}</span>
            <span>Отредактировано: {formatAdDate(adDetails.updatedAt)}</span>
          </div>
        </div>
      </header>
      <hr className={styles.divider} />
      <section className={styles.content}>
        <div className={styles.containerDescription}>
          <img src={placeholderImageSrc} alt={adDetails.title} />
          <div className={styles.contentDescription}>
            <h2 className={styles.subtitle}>Описание</h2>
            <p className={styles.description}>
              {adDetails.description ? adDetails.description : 'Отсутствует'}
            </p>
          </div>
        </div>
        <div className={styles.containerParams}>
          {missingFields.length > 0 && (
            <Alert variant="warning" className={styles.alert}>
              <h2>Требуются доработки</h2>
              <p>У объявления не заполнены поля:</p>
              <ul>
                {missingFields.map((field) => (
                  <li key={field}>{field}</li>
                ))}
              </ul>
            </Alert>
          )}
          <div className={styles.contentParams}>
            <h2 className={styles.subtitle}>Характеристики</h2>
            <ul className={styles.paramsList}>
              {paramsEntries.map(([key, value], index) => (
                <li className={styles.paramItem} key={index}>
                  <span className={styles.paramName}>{getParamlabel(key)}</span>
                  <span className={styles.paramValue}>
                    {getParamValueLabel(adDetails.category, key, value)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};
