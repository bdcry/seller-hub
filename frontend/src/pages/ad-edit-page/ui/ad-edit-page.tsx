import { type ChangeEvent, type ReactElement } from 'react';
import { Alert, Button, Form, InputGroup, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ad-edit-page.module.css';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getAdDetails } from '../../../entities/ad/api/getAdDetails';
import { adTypeOptions } from '../../../entities/ad/lib/get-param-labels';
import { useForm, useWatch } from 'react-hook-form';
import { updateAd } from '../../../entities/ad/api/update-ad';
import { buildPayload } from '../../../entities/ad/lib/build-payload';
import type {
  TAdCategory,
  TAdEditFormValues,
  TAdEditPayload,
} from '../../../entities/ad/model/ads.types';

const emptyParamsByCategory = {
  auto: {
    brand: '',
    model: '',
    yearOfManufacture: '',
    transmission: '',
    mileage: '',
    enginePower: '',
  },
  real_estate: {
    type: '',
    address: '',
    area: '',
    floor: '',
  },
  electronics: {
    type: '',
    brand: '',
    model: '',
    condition: '',
    color: '',
  },
};

export const AdEditPage = (): ReactElement => {
  const navigate = useNavigate();
  const param = useParams();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<TAdEditFormValues>({
    mode: 'onChange',
    // убираем значение из состояние формы, если категория изменилась
    shouldUnregister: true,
  });

  const watchedTitle = useWatch({ control, name: 'title' });
  const watchedPrice = useWatch({ control, name: 'price' });
  const watchedCategory = useWatch({ control, name: 'category' });
  const watchedDescription = useWatch({ control, name: 'description' });
  const watchedParams = useWatch({ control, name: 'params' }) as
    | Record<string, string | undefined>
    | undefined;

  const {
    data: ad,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['ad', param.id],
    queryFn: () => getAdDetails(String(param.id)),
  });

  const mutation = useMutation({
    mutationFn: (updateData: TAdEditPayload) => updateAd(String(param.id), updateData),
    onSuccess: () => {
      void navigate('..');
    },
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

  const submit = (rawData: TAdEditFormValues) => {
    const payload = buildPayload(rawData);
    mutation.mutate(payload);
  };

  const handleCancel = () => {
    void navigate('..');
  };

  const descriptionValue = ad.description ?? '';
  const currentCategory = (watchedCategory ?? ad.category) as TAdCategory;
  const currentDescription = watchedDescription ?? descriptionValue;
  const descriptionHelperText = currentDescription.trim()
    ? 'Улучшить описание'
    : 'Придумать описание';

  const typeOptions = adTypeOptions[currentCategory];
  const currentTitle = watchedTitle ?? ad.title;
  const currentPrice = watchedPrice ?? (ad.price === null ? '' : String(ad.price));
  const isSaveDisabled =
    currentTitle.trim() === '' ||
    currentPrice.trim() === '' ||
    Number.isNaN(Number(currentPrice)) ||
    Number(currentPrice) < 0 ||
    mutation.isPending;

  const autoDefaults = ad.category === 'auto' ? ad.params : undefined;
  const realEstateDefaults = ad.category === 'real_estate' ? ad.params : undefined;
  const electronicsDefaults = ad.category === 'electronics' ? ad.params : undefined;

  const getOptionalValue = (key: string, fallback?: string | number) => {
    return watchedParams?.[key] ?? (fallback === undefined ? '' : String(fallback));
  };

  const getOptionalFieldClass = (value?: string) => {
    return isSubmitted && (value ?? '').trim() === '' ? styles.optionalField : '';
  };

  return (
    <>
      <header className={styles.headerEdit}>
        <h2 className={styles.headerTitle}>Редактирование объявления</h2>
      </header>

      <section className={styles.page}>
        <Form className={styles.form} onSubmit={(e) => void handleSubmit(submit)(e)}>
          <div className={styles.section}>
            <div className={styles.field}>
              <h3 className={styles.label}>Категория</h3>
              <Form.Select
                defaultValue={ad.category}
                aria-label="Категория объявления"
                {...register('category', {
                  onChange: (e: ChangeEvent<HTMLSelectElement>) => {
                    const newCategory = e.target.value as TAdCategory;
                    setValue(
                      'params',
                      emptyParamsByCategory[newCategory] as TAdEditFormValues['params'],
                      {
                        // при смене категории, отмечает, что params изменились, относительно начального значения
                        // и запускает валидацию
                        shouldDirty: true,
                        shouldValidate: true,
                      },
                    );
                  },
                })}
              >
                <option value="auto">Авто</option>
                <option value="electronics">Электроника</option>
                <option value="real_estate">Недвижимость</option>
              </Form.Select>
            </div>

            <hr />

            <div className={`${styles.field} ${errors.title ? styles.requiredField : ''}`}>
              <h3 className={styles.label}>
                <span className={styles.requiredIcon}>*</span>Название
              </h3>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder={'Название объявления'}
                  aria-label="Введите название объявления"
                  {...register('title', {
                    required: 'Название должно быть заполнено',
                    validate: (value) => value.trim() !== '' || 'Название должно быть заполнено',
                  })}
                  defaultValue={ad.title}
                />
              </InputGroup>
              {errors.title?.message && (
                <p className={styles.fieldErrorText}>{errors.title.message}</p>
              )}
            </div>

            <hr />

            <div className={`${styles.field} ${errors.price ? styles.requiredField : ''}`}>
              <h3 className={styles.label}>
                <span className={styles.requiredIcon}>*</span>Цена
              </h3>
              <div className={styles.inlineField}>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Введите цену объявления"
                    aria-label="Введите цену объявления"
                    defaultValue={ad.price ?? ''}
                    {...register('price', {
                      required: 'Цена должна быть заполнена',
                      validate: (value) => {
                        const normalizedValue = value.trim();

                        if (normalizedValue === '') {
                          return 'Цена должна быть заполнена';
                        }

                        const numericValue = Number(normalizedValue);

                        if (Number.isNaN(numericValue) || numericValue < 0) {
                          return 'Цена должна быть неотрицательным числом';
                        }

                        return true;
                      },
                    })}
                  />
                </InputGroup>
                <Alert
                  variant="warning"
                  className={`${styles.helperAction} ${styles.helperActionInline}`}
                >
                  Узнать рыночную цену
                </Alert>
              </div>
              {errors.price?.message && (
                <p className={styles.fieldErrorText}>{errors.price.message}</p>
              )}
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Характеристики</h3>

            {currentCategory === 'auto' && (
              <>
                <div
                  className={`${styles.field} ${getOptionalFieldClass(
                    getOptionalValue('brand', autoDefaults?.brand),
                  )}`}
                >
                  <p className={styles.label}>Бренд</p>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Введите бренд"
                      aria-label="Введите название бренда"
                      defaultValue={autoDefaults?.brand ?? ''}
                      {...register('params.brand')}
                    />
                  </InputGroup>
                </div>

                <div
                  className={`${styles.field} ${getOptionalFieldClass(
                    getOptionalValue('model', autoDefaults?.model),
                  )}`}
                >
                  <p className={styles.label}>Модель</p>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Введите модель"
                      aria-label="Введите название модели"
                      defaultValue={autoDefaults?.model ?? ''}
                      {...register('params.model')}
                    />
                  </InputGroup>
                </div>

                <div
                  className={`${styles.field} ${getOptionalFieldClass(
                    getOptionalValue('yearOfManufacture', autoDefaults?.yearOfManufacture),
                  )}`}
                >
                  <p className={styles.label}>Год выпуска</p>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Введите год выпуска"
                      aria-label="Введите год выпуска"
                      defaultValue={autoDefaults?.yearOfManufacture ?? ''}
                      {...register('params.yearOfManufacture')}
                    />
                  </InputGroup>
                </div>

                <div
                  className={`${styles.field} ${getOptionalFieldClass(
                    getOptionalValue('transmission', autoDefaults?.transmission),
                  )}`}
                >
                  <p className={styles.label}>Коробка передач</p>
                  <Form.Select
                    aria-label="Коробка передач"
                    defaultValue={autoDefaults?.transmission ?? ''}
                    {...register('params.transmission')}
                  >
                    <option value="">Выберите тип</option>
                    {typeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </div>

                <div
                  className={`${styles.field} ${getOptionalFieldClass(
                    getOptionalValue('mileage', autoDefaults?.mileage),
                  )}`}
                >
                  <p className={styles.label}>Пробег</p>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Введите пробег"
                      aria-label="Введите пробег"
                      defaultValue={autoDefaults?.mileage ?? ''}
                      {...register('params.mileage')}
                    />
                  </InputGroup>
                </div>

                <div
                  className={`${styles.field} ${getOptionalFieldClass(
                    getOptionalValue('enginePower', autoDefaults?.enginePower),
                  )}`}
                >
                  <p className={styles.label}>Мощность двигателя</p>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Введите мощность двигателя"
                      aria-label="Введите мощность двигателя"
                      defaultValue={autoDefaults?.enginePower ?? ''}
                      {...register('params.enginePower')}
                    />
                  </InputGroup>
                </div>
              </>
            )}

            {currentCategory === 'real_estate' && (
              <>
                <div
                  className={`${styles.field} ${getOptionalFieldClass(
                    getOptionalValue('type', realEstateDefaults?.type),
                  )}`}
                >
                  <p className={styles.label}>Тип</p>
                  <Form.Select
                    aria-label="Тип недвижимости"
                    defaultValue={realEstateDefaults?.type ?? ''}
                    {...register('params.type')}
                  >
                    <option value="">Выберите тип</option>
                    {typeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </div>

                <div
                  className={`${styles.field} ${getOptionalFieldClass(
                    getOptionalValue('address', realEstateDefaults?.address),
                  )}`}
                >
                  <p className={styles.label}>Адрес</p>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Введите адрес"
                      aria-label="Введите адрес"
                      defaultValue={realEstateDefaults?.address ?? ''}
                      {...register('params.address')}
                    />
                  </InputGroup>
                </div>

                <div
                  className={`${styles.field} ${getOptionalFieldClass(
                    getOptionalValue('area', realEstateDefaults?.area),
                  )}`}
                >
                  <p className={styles.label}>Площадь</p>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Введите площадь"
                      aria-label="Введите площадь"
                      defaultValue={realEstateDefaults?.area ?? ''}
                      {...register('params.area')}
                    />
                  </InputGroup>
                </div>

                <div
                  className={`${styles.field} ${getOptionalFieldClass(
                    getOptionalValue('floor', realEstateDefaults?.floor),
                  )}`}
                >
                  <p className={styles.label}>Этаж</p>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Введите этаж"
                      aria-label="Введите этаж"
                      defaultValue={realEstateDefaults?.floor ?? ''}
                      {...register('params.floor')}
                    />
                  </InputGroup>
                </div>
              </>
            )}

            {currentCategory === 'electronics' && (
              <>
                <div
                  className={`${styles.field} ${getOptionalFieldClass(
                    getOptionalValue('type', electronicsDefaults?.type),
                  )}`}
                >
                  <p className={styles.label}>Тип</p>
                  <Form.Select
                    aria-label="Тип электроники"
                    defaultValue={electronicsDefaults?.type ?? ''}
                    {...register('params.type')}
                  >
                    <option value="">Выберите тип</option>
                    {typeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </div>

                <div
                  className={`${styles.field} ${getOptionalFieldClass(
                    getOptionalValue('brand', electronicsDefaults?.brand),
                  )}`}
                >
                  <p className={styles.label}>Бренд</p>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Введите бренд"
                      aria-label="Введите название бренда"
                      defaultValue={electronicsDefaults?.brand ?? ''}
                      {...register('params.brand')}
                    />
                  </InputGroup>
                </div>

                <div
                  className={`${styles.field} ${getOptionalFieldClass(
                    getOptionalValue('model', electronicsDefaults?.model),
                  )}`}
                >
                  <p className={styles.label}>Модель</p>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Введите модель"
                      aria-label="Введите название модели"
                      defaultValue={electronicsDefaults?.model ?? ''}
                      {...register('params.model')}
                    />
                  </InputGroup>
                </div>

                <div
                  className={`${styles.field} ${getOptionalFieldClass(
                    getOptionalValue('color', electronicsDefaults?.color),
                  )}`}
                >
                  <p className={styles.label}>Цвет</p>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Введите цвет"
                      aria-label="Введите название цвета"
                      defaultValue={electronicsDefaults?.color ?? ''}
                      {...register('params.color')}
                    />
                  </InputGroup>
                </div>

                <div
                  className={`${styles.field} ${getOptionalFieldClass(
                    getOptionalValue('condition', electronicsDefaults?.condition),
                  )}`}
                >
                  <p className={styles.label}>Состояние</p>
                  <Form.Select
                    aria-label="Состояние"
                    defaultValue={electronicsDefaults?.condition || ''}
                    {...register('params.condition')}
                  >
                    <option value="">Состояние</option>
                    <option value="new">Новый</option>
                    <option value="used">Б/у</option>
                  </Form.Select>
                </div>
              </>
            )}
          </div>

          <div className={styles.section}>
            <div className={`${styles.field} ${getOptionalFieldClass(currentDescription)}`}>
              <h3 className={styles.label}>Описание</h3>
              <InputGroup>
                <Form.Control
                  as="textarea"
                  rows={4}
                  defaultValue={descriptionValue}
                  aria-label="Введите описание объявления"
                  {...register('description')}
                />
              </InputGroup>
              <Alert variant="warning" className={styles.helperAction}>
                {descriptionHelperText}
              </Alert>
            </div>
          </div>

          <div className={styles.actions}>
            <Button
              variant="primary"
              className={styles.button}
              type="submit"
              disabled={isSaveDisabled}
            >
              Сохранить
            </Button>
            <Button variant="outline-secondary" className={styles.button} onClick={handleCancel}>
              Отмена
            </Button>
          </div>
        </Form>
      </section>
    </>
  );
};
