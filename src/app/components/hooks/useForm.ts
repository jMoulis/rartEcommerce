import { InputsChangeEvent } from '@/src/types/types';
import { ChangeEvent, useCallback, useState } from 'react';

export const useForm = <T extends Record<string, any>>() => {
  const [form, setForm] = useState<T>({} as any);

  const onInputChange = useCallback((event: InputsChangeEvent) => {
    const { name, value } = event.currentTarget;
    setForm((prev: any) => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const onInputCheckChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.currentTarget;
    setForm((prev: any) => ({
      ...prev,
      [name]: checked
    }));
  }, []);

  const onInitForm = useCallback((prevForm: any) => {
    setForm(prevForm);
  }, []);
  const onSubmit = useCallback(() => {
    return form;
  }, [form]);

  return {
    onInputChange,
    onInputCheckChange,
    onSubmit,
    form,
    onInitForm
  };
};
