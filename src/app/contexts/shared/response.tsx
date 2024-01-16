import { ApiPayload } from '@/src/app/contexts/shared/types';

export const onErrorMessage = (error: any, t?: any): ApiPayload => {
  const errorObject = JSON.parse(JSON.stringify(error));
  const code: string = errorObject?.code || 'unknown';
  const message =
    typeof t === 'function' ? t(`ApiErrors.${code}` as any) : code;
  return {
    error: message,
    status: false,
    message: null,
    code,
  };
};
export const onSuccessMessage = (
  code: string,
  t?: any,
  data?: any
): ApiPayload => {
  const message =
    typeof t === 'function' ? t(`ApiSuccess.${code}` as any) : code;
  return {
    error: null,
    status: true,
    message,
    code,
    data,
  };
};
