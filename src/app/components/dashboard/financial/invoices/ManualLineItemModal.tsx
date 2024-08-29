import { ILineItem } from '@/src/types/DBTypes';
import React, { useState } from 'react';
import { InputGroup } from '../../../commons/form/InputGroup';
import { v4 } from 'uuid';
import { Button } from '../../../commons/Buttons/Button';
import { useTranslations } from 'next-intl';
import { FullDialog } from '../../../commons/dialog/FullDialog';
import { useToggle } from '../../../hooks/useToggle';
import { Flexbox } from '../../../commons/Flexbox';

const defaultForm = {
  _id: '',
  itemId: '',
  description: '',
  quantity: 1,
  unitPrice: 0,
  total: 0
};

interface Props {
  onAddManualLineItem: (lineItem: ILineItem) => void;
}

const ManualLineItemModal = ({ onAddManualLineItem }: Props) => {
  const { open, onClose, onOpen } = useToggle();

  const t = useTranslations();
  const [form, setForm] = useState<ILineItem>(defaultForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (close?: boolean) => {
    const total = form.quantity * form.unitPrice;
    const updatedForm = { ...form, total, itemId: v4(), _id: v4() };
    setForm(defaultForm);
    onAddManualLineItem(updatedForm);
    if (close) {
      onClose();
    }
  };
  return (
    <>
      <Button onClick={onOpen}>{t('Invoice.addManual')}</Button>
      <FullDialog
        styling={{
          content: {
            height: 'fit-content',
            minHeight: 'fit-content'
          }
        }}
        header={{
          title: t('Invoice.addManual')
        }}
        open={open}
        onClose={onClose}>
        <InputGroup
          onInputChange={handleChange}
          id='description'
          label='Description'
          name='description'
          value={form.description}
        />
        <InputGroup
          onInputChange={handleChange}
          id='quantity'
          label={t('commons.quantity')}
          name='quantity'
          type='number'
          value={form.quantity}
        />
        <InputGroup
          type='number'
          onInputChange={handleChange}
          id='unitPrice'
          label={t('commons.unitPrice')}
          name='unitPrice'
          value={form.unitPrice}
        />
        <Flexbox justifyContent='flex-end'>
          <Button onClick={() => handleSubmit()}>{t('commons.add')}</Button>
          <Button onClick={() => handleSubmit(true)}>
            {t('commons.addClose')}
          </Button>
        </Flexbox>
      </FullDialog>
    </>
  );
};

export default ManualLineItemModal;
