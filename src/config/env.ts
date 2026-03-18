import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  API_URL: process.env.API_URL ?? 'https://api-dev.labws.cloud/api/v1/',
  BASE_URL: process.env.BASE_URL ?? 'https://weid-dev.labws.cloud',
  USER_EMAIL: process.env.USER_EMAIL ?? '',
  USER_PASSWORD: process.env.USER_PASSWORD ?? '',
};
