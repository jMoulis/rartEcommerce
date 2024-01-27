import React, { useCallback, useEffect } from 'react';
import { Article } from '../../products/CreateForm/Article';
import { InputGroup } from '../../../commons/form/InputGroup';
import { ISubscription } from '@/src/types/DBTypes';
import { useForm } from '../../../hooks/useForm';
import { useTranslations } from 'next-intl';
import { FullDialog } from '../../../commons/dialog/FullDialog';
import { Flexbox } from '../../../commons/Flexbox';
import { Selectbox } from '../../../commons/form/Selectbox';
import { SubmitButton } from '../../products/CreateForm/SubmitButton';
import { useFirestore } from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { ImageLoader } from '../../products/CreateForm/ImageLoader/ImageLoader';
import { IImageType } from '../../products/CreateForm/ImageLoader/types';

interface Props {
  onSubscriptionChange: (subscriptionId: string) => void;
  open: boolean;
  onClose: VoidFunction;
  editedSubscription?: ISubscription | null;
}

export const SubscriptionForm = ({
  onSubscriptionChange,
  open,
  onClose,
  editedSubscription,
}: Props) => {
  const { onCreateDocument, onUpdateDocument } = useFirestore();

  const { onInputChange, form, onClearForm, onDirectMutation, onInitForm } =
    useForm<ISubscription>();

  const t = useTranslations();

  useEffect(() => {
    if (editedSubscription) {
      onInitForm(editedSubscription);
    }
  }, []);

  const handleSubmitSubscription = async () => {
    if (editedSubscription?._id) {
      await onUpdateDocument(
        form,
        ENUM_COLLECTIONS.SUBSCRIPTIONS,
        editedSubscription._id
      );
      onSubscriptionChange(editedSubscription._id);
    } else {
      onCreateDocument(form, ENUM_COLLECTIONS.SUBSCRIPTIONS).then((payload) => {
        if (payload.data?._id) {
          onSubscriptionChange(payload.data?._id);
          onClearForm();
          onClose();
        }
      });
    }
  };
  const handleSelectImage = useCallback((images: IImageType[]) => {
    const lastImage = images[images.length - 1];
    onDirectMutation((prev) => ({
      ...prev,
      image: lastImage,
    }));
  }, []);
  return (
    <>
      <FullDialog
        open={open}
        onClose={onClose}
        dialog={{
          fullWidth: true,
          maxWidth: 'md',
          keepMounted: false,
        }}
        header={{
          title: t('Subscription.newSubscription'),
        }}>
        <Article headerTitle={t('Subscription.subscriptionDetail')}>
          <Flexbox>
            <Flexbox
              flexDirection='column'
              flex='1'
              style={{
                marginRight: '10px',
              }}>
              <InputGroup
                label={t('commons.name')}
                id='name'
                name='name'
                onInputChange={onInputChange}
                value={form.name || ''}
              />
              <InputGroup
                label={t('commons.description')}
                id='description'
                name='description'
                onInputChange={onInputChange}
                value={form.description || ''}
              />
            </Flexbox>
          </Flexbox>
        </Article>
        <ImageLoader
          onSubmitImages={handleSelectImage}
          images={form.image ? [form.image] : []}
          single
        />
        <Article headerTitle={t('commons.priceModality')}>
          <InputGroup
            type='number'
            label={t('commons.price')}
            id='price'
            name='price'
            onInputChange={onInputChange}
            value={form.price || ''}
          />
          <Selectbox
            label={t('Subscription.paymentPeriodLabel')}
            id='paymentPeriode'
            name='price'
            onSelectOption={onInputChange}
            value={form.paymentPeriod}
            options={[
              {
                label: t('commons.select'),
                value: '',
              },
              {
                label: t('Subscription.paymentPeriod', {
                  paymentPeriod: 'weekly',
                }),
                value: 'weekly',
              },
              {
                label: t('Subscription.paymentPeriod', {
                  paymentPeriod: 'monthly',
                }),
                value: 'monthly',
              },
              {
                label: t('Subscription.paymentPeriod', {
                  paymentPeriod: 'annualy',
                }),
                value: 'annualy',
              },
            ]}
          />
        </Article>
        <Flexbox>
          <SubmitButton onClick={handleSubmitSubscription} />
        </Flexbox>
      </FullDialog>
    </>
  );
};
