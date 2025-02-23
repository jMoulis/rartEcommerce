import React, { useCallback, useEffect } from 'react';
import { Article } from '../../products/CreateForm/Article';
import { InputGroup } from '../../../commons/form/InputGroup';
import { ISubscription, IWorkshop } from '@/src/types/DBTypes';
import { useForm } from '../../../hooks/useForm';
import { useTranslations } from 'next-intl';
import { FullDialog } from '../../../commons/dialog/FullDialog';
import { Flexbox } from '../../../commons/Flexbox';
import { Selectbox } from '../../../commons/form/Selectbox';
import { SubmitButton } from '../../products/CreateForm/SubmitButton';
import {
  onCreateDocument,
  onUpdateDocument
} from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { ImageLoader } from '../../products/CreateForm/ImageLoader/ImageLoader';
import { IImageType } from '../../products/CreateForm/ImageLoader/types';
import { stripe } from '@/src/lib/stripe/stripe';
import { DEFAULT_CURRENCY } from '@/src/lib/constants';
import Stripe from 'stripe';

interface PriceProps {
  currency: any;
  price: number;
  interval: Stripe.PriceCreateParams.Recurring.Interval;
  metadata: Stripe.Metadata;
  productData: {
    id?: string;
    name: string;
  };
}
const createPrice = async ({
  price,
  interval,
  metadata,
  productData
}: PriceProps): Promise<string | null> => {
  try {
    const payload = await stripe.prices.create({
      currency: DEFAULT_CURRENCY.code,
      unit_amount: price,
      recurring: {
        interval
      },
      metadata,
      product_data: productData
    });
    return payload.id;
  } catch (error) {
    return null;
  }
};

interface Props {
  onSubscriptionChange: (subscriptionId: string) => void;
  open: boolean;
  onClose: VoidFunction;
  editedSubscription?: ISubscription | null;
  workshop: IWorkshop;
}

export const SubscriptionForm = ({
  onSubscriptionChange,
  open,
  onClose,
  editedSubscription,
  workshop
}: Props) => {
  const { onInputChange, form, onClearForm, onDirectMutation, onInitForm } =
    useForm<ISubscription>();

  const t = useTranslations();

  useEffect(() => {
    if (editedSubscription) {
      onInitForm(editedSubscription);
    }
  }, [editedSubscription]);

  const handleSubmitSubscription = async () => {
    const intervalMap: Record<
      string,
      Stripe.PriceCreateParams.Recurring.Interval
    > = {
      monthly: 'month',
      weekly: 'week',
      annualy: 'year'
    };
    const priceId = await createPrice({
      currency: DEFAULT_CURRENCY.code,
      price: form.price,

      interval: intervalMap[form.paymentPeriod],

      metadata: {
        description: workshop.description ?? ''
      },
      productData: {
        id: workshop._id,
        name: workshop.name
      }
    });
    form.priceId = priceId;
    if (editedSubscription?._id) {
      await onUpdateDocument(
        form,
        ENUM_COLLECTIONS.SUBSCRIPTIONS,
        editedSubscription._id
      );
    } else {
      onCreateDocument(form, ENUM_COLLECTIONS.SUBSCRIPTIONS).then(
        async (payload) => {
          if (payload.data?._id) {
            onSubscriptionChange(payload.data?._id);
            // Create product and price model
            onClearForm();
            onClose();
          }
        }
      );
    }
  };
  const handleSelectImage = useCallback((images: IImageType[]) => {
    const lastImage = images[images.length - 1];
    onDirectMutation((prev) => ({
      ...prev,
      image: lastImage
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
          keepMounted: false
        }}
        header={{
          title: editedSubscription
            ? t('Subscription.newSubscription')
            : t('Subscription.editSubscription')
        }}>
        <Article headerTitle={t('Subscription.subscriptionDetail')}>
          <Flexbox>
            <Flexbox
              flexDirection='column'
              flex='1'
              style={{
                marginRight: '10px'
              }}>
              <InputGroup
                label={t('commons.name')}
                id='name'
                name='name'
                onChange={onInputChange}
                value={form.name || ''}
              />
              <InputGroup
                label={t('commons.description')}
                id='description'
                name='description'
                onChange={onInputChange}
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
            onChange={onInputChange}
            value={form.price || ''}
          />
          <Selectbox
            label={t('Subscription.paymentPeriodLabel')}
            id='paymentPeriod'
            name='paymentPeriod'
            onChangeSelectbox={onInputChange}
            value={form.paymentPeriod}
            options={[
              {
                label: t('commons.select'),
                value: ''
              },
              {
                label: t('Subscription.paymentPeriod', {
                  paymentPeriod: 'weekly'
                }),
                value: 'weekly'
              },
              {
                label: t('Subscription.paymentPeriod', {
                  paymentPeriod: 'monthly'
                }),
                value: 'monthly'
              },
              {
                label: t('Subscription.paymentPeriod', {
                  paymentPeriod: 'annualy'
                }),
                value: 'annualy'
              }
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
