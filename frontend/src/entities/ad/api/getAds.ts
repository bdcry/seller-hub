import { api } from '../../../shared/api/axios';
import type { TAds } from '../model/ads.types';

export const getAds = async () => {
  const response = await api.get<TAds>('/items');
  return response.data;
};
