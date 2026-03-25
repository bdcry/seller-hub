import { ollamaApi } from '../../../shared/api/ollama';
import type { TAdCategory } from '../../ad/model/ads.types';
import type { TGeneratePriceResponse } from '../model/ai.types';

export const suggestPrice = async (
  title: string,
  category: TAdCategory,
  price: string | number,
  params: Record<string, string | undefined>,
) => {
  const paramsText = Object.entries(params)
    .filter(([, value]) => value && value.trim() !== '')
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  const prompt = `
    Ты помогаешь оценить ориентировочную рыночную стоимость объявления для маркетплейса.

    Важно:
    - не проверяй, существует ли модель в реальности;
    - не отказывайся от оценки, даже если название выглядит необычным, новым или вымышленным;
    - не возвращай цену 0, если товар в принципе не является бесплатным;
    - если данных мало, всё равно предложи реалистичную ориентировочную цену;
    - опирайся на категорию, название, характеристики и текущую цену как на слабый ориентир;
    - если модель спорная, оцени цену по классу товара, уровню бренда и заявленным характеристикам.

    Цена должна быть в рублях.

    Верни ответ строго в таком формате:

    Предполагаемая цена: <целое число с пробелами и знаком ₽>
    Краткий комментарий на 3-5 строк:
    - какой это сегмент товара;
    - что сильнее всего влияет на цену;
    - почему выбран именно такой ориентир;
    - если данных мало, укажи это, но всё равно дай цену.

    Данные объявления:
    Категория: ${category}
    Название: ${title}
    Текущая цена: ${price}
    Характеристики:
    ${paramsText || 'Нет данных'}}
    `.trim();

  const response = await ollamaApi.post<TGeneratePriceResponse>('/generate', {
    model: 'qwen3:4b',
    prompt,
    stream: false,
  });

  return response.data.response.trim();
};
