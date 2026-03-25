import { ollamaApi } from '../../../shared/api/ollama';
import type { TAdCategory } from '../../ad/model/ads.types';
import type { TGenerateDescriptionResponse } from '../model/ai.types';

export const generateDescription = async (
  title: string,
  category: TAdCategory,
  price: string | number,
  params: Record<string, string | undefined>,
  description?: string,
) => {
  const paramsText = Object.entries(params)
    .filter(([, value]) => value && value.trim() !== '')
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  const taskText = description?.trim()
    ? 'Улучши описание этого объявления'
    : 'Сгенерируй описание для этого объявления';

  const prompt = `
    ${taskText} для Авито.

    Ты помогаешь писать тексты для объявлений.
    Пиши по-русски, связно и естественно.
    Сделай 5-7 предложений, 450-700 символов.
    Не выдумывай факты.

    Категория: ${category}
    Название: ${title}
    Цена: ${price}
    Характеристики:
    ${paramsText || 'Нет данных'}

    Текущее описание:
    ${description?.trim() || 'Описание отсутствует'}
    `.trim();

  const response = await ollamaApi.post<TGenerateDescriptionResponse>('/generate', {
    model: 'qwen3:4b',
    prompt,
    stream: false,
  });

  return response.data.response.trim();
};
