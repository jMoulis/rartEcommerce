'use server';

import { IShippingRequest } from '@/src/types/DBTypes';
import nodeFetch from 'node-fetch';

const AUTH = !process.env.SENDCLOUD_PK || !process.env.SENDCLOUD_SK ? null : Buffer.from(`${process.env.SENDCLOUD_PK}:${process.env.SENDCLOUD_SK}`).toString('base64');

const canSubmit = (uri?: string) => {
  if (!AUTH) {
    throw new Error('Missing Sendcloud keys');
  }
  if (!uri) {
    throw new Error('Missing Sendcloud endpoint');
  }
};

export const fetchServicePoints = async (carrier: string, address: {
  country: string
  postal_code: string
}) => {
  const endPoint = process.env.SENDCLOUD_SHIPPING_SERVICES_POINTS_URI;

  canSubmit(endPoint);

  const query = new URLSearchParams({ ...address, carrier });
  const url = `${endPoint}?${query.toString()}`;

  const options = {
    method: 'GET',
    headers: {
      'X-Requested-With': '',
      Accept: 'application/json',
      Authorization: `Basic ${AUTH}`
    }
  };

  try {
    const response = await nodeFetch(url, options);
    if (!response.ok) {
      throw new Error(`Network response was not ok, ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    // eslint-disable-next-line no-console
    throw new Error(error.message);
  }
};

export const fetchShippingMethods = async (shippingRequest: IShippingRequest) => {
  const endPoint = process.env.SENDCLOUD_SHIPPING_PRODUCTS_URI;
  canSubmit(endPoint);
  const query = new URLSearchParams(shippingRequest as unknown as Record<string, string>);
  const url = `${endPoint}?${query.toString()}`;
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${AUTH}`
    }
  };

  try {
    const response = await nodeFetch(url, options);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json() as any[] || [];
    const agragatedShippingProducts = await Promise.all((data || []).filter((item) => !item.code.includes('sendcloud')).map(async (item: any) => {
      const methodsPrices = await Promise.all(item.methods.map(async (method: any) => {
        const prices = await fetchPrices(method.id, shippingRequest);
        return { ...method, prices };
      }));

      return { ...item, methods: methodsPrices };
    }));
    return agragatedShippingProducts;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
export const fetchPrices = async (shippingMethodId: number, shippingRequest: IShippingRequest) => {
  const endPoint = process.env.SENDCLOUD_SHIPPING_PRICE_URI;

  canSubmit(endPoint);

  const query = new URLSearchParams({ ...shippingRequest, shipping_method_id: String(shippingMethodId) });
  const url = `${endPoint}?${query.toString()}`;

  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${AUTH}`
    }
  };

  try {
    const response = await nodeFetch(url, options);
    if (!response.ok) {
      throw new Error(`Network response was not ok, ${response.statusText}`);
    }
    const data = await response.json();

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// https://servicepoints.sendcloud.sc/api/v2/service-points?country=FR&city=Arenthon&postal_code=74800&carrier=mondial_relay
// https://servicepoints.sendcloud.sc/api/v2/service-points?country=FR&carrier=mondial_relay&postal_code=74800;
