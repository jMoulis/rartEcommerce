import { InputsChangeEvent } from '@/src/types/types';
import { ChangeEvent, useCallback, useState } from 'react';

export const useForm = <T extends Record<string, any>>() => {
  const [form, setForm] = useState<T>({} as any);

  const onInputChange = useCallback((event: InputsChangeEvent) => {
    const { name, value, type } = event.currentTarget;
    const typedValue = type === 'number' ? parseFloat(value) : value;
    setForm((prev: any) => ({
      ...prev,
      [name]: typedValue
    }));
  }, []);

  const onInputCheckChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.currentTarget;
    setForm((prev: any) => ({
      ...prev,
      [name]: checked
    }));
  }, []);

  const onDirectMutation = useCallback(setForm, []);

  const onInitForm = useCallback((prevForm: any) => {
    setForm(prevForm);
  }, []);

  const onClearForm = useCallback(() => {
    setForm({} as any);
  }, []);
  const onSubmit = useCallback(() => {
    return form;
  }, [form]);

  return {
    onInputChange,
    onInputCheckChange,
    onSubmit,
    form,
    onInitForm,
    onDirectMutation,
    onClearForm
  };
};
