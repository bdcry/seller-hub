import type { ReactElement } from 'react';
import { Alert, Button, Form, InputGroup, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ad-edit-page.module.css';
import { useQuery } from '@tanstack/react-query';
import { getAdDetails } from '../../../entities/ad/api/getAdDetails';
import { adTypeOptions } from '../../../entities/ad/lib/get-param-labels';

export const AdEditPage = (): ReactElement => {
  const navigate = useNavigate();
  const param = useParams();
  const descriptionValue =
    'Продаю свой MacBook Pro 16" (2021) на чипе M1 Pro. Состояние отличное, работал бережно. Мощности хватает на всё: от сложного монтажа до кода, при этом ноутбук почти не греется.';
  const descriptionHelperText = descriptionValue.trim()
    ? 'Улучшить описание'
    : 'Придумать описание';

  const handleGoBackToDetails = () => {
    void navigate(-1);
  };

  const {
    data: ad,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['ad', param.id],
    queryFn: () => getAdDetails(String(param.id)),
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

  if (!ad) {
    return (
      <div className={styles.stateBlock}>
        <p className={styles.stateText}>Объявление не найдено.</p>
      </div>
    );
  }

  const typeOptions = adTypeOptions[ad.category];

  return (
    <>
      <header className={styles.headerEdit}>
        <h2 className={styles.headerTitle}>Редактирование объявления</h2>
      </header>

      <section className={styles.page}>
        <Form className={styles.form} onSubmit={(event) => event.preventDefault()}>
          <div className={styles.section}>
            <div className={styles.field}>
              <h3 className={styles.label}>Категория</h3>
              <Form.Select value={ad.category} aria-label="Категория объявления">
                <option value="auto">Авто</option>
                <option value="electronics">Электроника</option>
                <option value="real_estate">Недвижимость</option>
              </Form.Select>
            </div>

            <hr />

            <div className={styles.field}>
              <h3 className={styles.label}>
                <span className={styles.requiredIcon}>*</span>Название
              </h3>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder={ad.title || 'Название объявления'}
                  aria-label="Введите название объявления"
                  value={ad.title || ''}
                />
              </InputGroup>
            </div>

            <hr />

            <div className={styles.field}>
              <h3 className={styles.label}>
                <span className={styles.requiredIcon}>*</span>Цена
              </h3>
              <div className={styles.inlineField}>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Введите цену объявления"
                    aria-label="Введите цену объявления"
                    value={ad.price || ''}
                  />
                </InputGroup>
                <Alert
                  variant="warning"
                  className={`${styles.helperAction} ${styles.helperActionInline}`}
                >
                  Узнать рыночную цену
                </Alert>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Характеристики</h3>

            {ad.category === 'auto' && (
              <>
                <div className={styles.field}>
                  <p className={styles.label}>Бренд</p>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Введите бренд"
                      aria-label="Введите название бренда"
                      value={ad.params.brand ?? ''}
                    />
                  </InputGroup>
                </div>

                <div className={styles.field}>
                  <p className={styles.label}>Модель</p>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Введите модель"
                      aria-label="Введите название модели"
                      value={ad.params.model ?? ''}
                    />
                  </InputGroup>
                </div>

                <div className={styles.field}>
                  <p className={styles.label}>Год выпуска</p>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Введите год выпуска"
                      aria-label="Введите год выпуска"
                      value={ad.params.yearOfManufacture ?? ''}
                    />
                  </InputGroup>
                </div>

                <div className={styles.field}>
                  <p className={styles.label}>Коробка передач</p>
                  <Form.Select aria-label="Коробка передач" value={ad.params.transmission ?? ''}>
                    <option value="">Выберите тип</option>
                    {typeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </div>

                <div className={styles.field}>
                  <p className={styles.label}>Пробег</p>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Введите пробег"
                      aria-label="Введите пробег"
                      value={ad.params.mileage ?? ''}
                    />
                  </InputGroup>
                </div>

                <div className={styles.field}>
                  <p className={styles.label}>Мощность двигателя</p>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Введите мощность двигателя"
                      aria-label="Введите мощность двигателя"
                      value={ad.params.enginePower ?? ''}
                    />
                  </InputGroup>
                </div>
              </>
            )}

            {ad.category === 'real_estate' && (
              <>
                <div className={styles.field}>
                  <p className={styles.label}>Тип</p>
                  <Form.Select aria-label="Тип недвижимости" value={ad.params.type ?? ''}>
                    <option value="">Выберите тип</option>
                    {typeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </div>

                <div className={styles.field}>
                  <p className={styles.label}>Адрес</p>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Введите адрес"
                      aria-label="Введите адрес"
                      value={ad.params.address ?? ''}
                    />
                  </InputGroup>
                </div>

                <div className={styles.field}>
                  <p className={styles.label}>Площадь</p>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Введите площадь"
                      aria-label="Введите площадь"
                      value={ad.params.area ?? ''}
                    />
                  </InputGroup>
                </div>

                <div className={styles.field}>
                  <p className={styles.label}>Этаж</p>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Введите этаж"
                      aria-label="Введите этаж"
                      value={ad.params.floor ?? ''}
                    />
                  </InputGroup>
                </div>
              </>
            )}

            {ad.category === 'electronics' && (
              <>
                <div className={styles.field}>
                  <p className={styles.label}>Тип</p>
                  <Form.Select aria-label="Тип электроники" value={ad.params.type ?? ''}>
                    <option value="">Выберите тип</option>
                    {typeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </div>

                <div className={styles.field}>
                  <p className={styles.label}>Бренд</p>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Введите бренд"
                      aria-label="Введите название бренда"
                      value={ad.params.brand ?? ''}
                    />
                  </InputGroup>
                </div>

                <div className={styles.field}>
                  <p className={styles.label}>Модель</p>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Введите модель"
                      aria-label="Введите название модели"
                      value={ad.params.model ?? ''}
                    />
                  </InputGroup>
                </div>

                <div className={styles.field}>
                  <p className={styles.label}>Цвет</p>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Введите цвет"
                      aria-label="Введите название цвета"
                      value={ad.params.color ?? ''}
                    />
                  </InputGroup>
                </div>

                <div className={styles.field}>
                  <p className={styles.label}>Состояние</p>
                  <Form.Select aria-label="Состояние" value={ad.params.condition || ''}>
                    <option>Состояние</option>
                    <option value="new">Новый</option>
                    <option value="used">Б/у</option>
                  </Form.Select>
                </div>
              </>
            )}
          </div>

          <div className={styles.section}>
            <div className={styles.field}>
              <h3 className={styles.label}>Описание</h3>
              <InputGroup>
                <Form.Control
                  as="textarea"
                  rows={4}
                  defaultValue={descriptionValue}
                  aria-label="Введите описание объявления"
                />
              </InputGroup>
              <Alert variant="warning" className={styles.helperAction}>
                {descriptionHelperText}
              </Alert>
            </div>
          </div>

          <div className={styles.actions}>
            <Button variant="primary" className={styles.button} onClick={handleGoBackToDetails}>
              Сохранить
            </Button>
            <Button
              variant="outline-secondary"
              className={styles.button}
              onClick={handleGoBackToDetails}
            >
              Отмена
            </Button>
          </div>
        </Form>
      </section>
    </>
  );
};
