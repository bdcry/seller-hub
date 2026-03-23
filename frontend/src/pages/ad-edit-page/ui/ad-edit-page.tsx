import type { ReactElement } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styles from './ad-edit-page.module.css';

export const AdEditPage = (): ReactElement => {
  const navigate = useNavigate();

  const handleGoBackToDetails = () => {
    void navigate(-1);
  };

  const handleGoToAdsList = () => {
    void navigate('/ads');
  };

  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Редактирование объявления</h1>
        <p className={styles.description}>
          Здесь будет форма с полями по категории, валидацией, черновиком и AI-помощником.
        </p>

        <h2 className={styles.subtitle}>Что появится следующим шагом</h2>
        <ul className={styles.list}>
          <li>заполнение формы начальными данными</li>
          <li>динамические поля по категории</li>
          <li>счётчик символов для описания</li>
          <li>сохранение и draft в localStorage</li>
        </ul>

        <div className={styles.actions}>
          <Button variant="outline-primary" onClick={handleGoBackToDetails}>
            Назад к объявлению
          </Button>
          <Button variant="primary" onClick={handleGoToAdsList}>
            К списку объявлений
          </Button>
        </div>
      </div>
    </section>
  );
};
