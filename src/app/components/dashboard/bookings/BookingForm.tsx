'use client';

import React, { useEffect, useState, useCallback, ChangeEvent } from 'react';
import styled from '@emotion/styled';
import { IBooking, ISession } from '@/src/types/DBTypes';
import { useForm } from '../../hooks/useForm';
import { InputGroup } from '../../commons/form/InputGroup';
import { useTranslations } from 'next-intl';
import { ContentDetailLayout } from '../../commons/Layouts/ContentDetailLayout';
import { TextareaGroup } from '../../commons/form/TextareaGroup';
import { Article } from '../products/CreateForm/Article';
import { Selectbox } from '../../commons/form/Selectbox';
import { PriceSessionForm } from './PriceSessionForm';
import { Locations } from './Locations/Locations';
import { Subscriptions } from './Subscription/Subscriptions';
import { useFirestore } from '@/src/app/contexts/firestore/useFirestore';
import { useRouter } from 'next/navigation';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { Flexbox } from '../../commons/Flexbox';
import { Menu } from '../products/CreateForm/RightMenu/Menu';
import { Backdrop } from '../../commons/Backdrop';
import { CreateFormHeader } from '../products/CreateForm/CreateFormHeader';
import { ImageLoader } from '../products/CreateForm/ImageLoader/ImageLoader';
import { IImageType } from '../products/CreateForm/ImageLoader/types';
import { SessionForm } from './Session/SessionForm';
import { generateDefaultBooking } from '../products/CreateForm/defaultData';

const Root = styled.div`
  overflow: auto;
  position: relative;
`;

interface Props {
  prevBooking?: IBooking;
}

export const BookingForm = ({ prevBooking }: Props) => {
  const { form, onInitForm, onInputChange, onDirectMutation } =
    useForm<IBooking>();
  const t = useTranslations();
  const { onUpdateDocument, onCreateDocument, onDeleteDocument } =
    useFirestore();
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (prevBooking) {
      onInitForm(prevBooking);
    } else {
      const defaultBooking = generateDefaultBooking();
      onInitForm(defaultBooking);
    }
  }, [prevBooking]);

  const handleSubmit = async () => {
    try {
      setSaving(true);
      if (prevBooking?._id) {
        await onUpdateDocument(
          form,
          ENUM_COLLECTIONS.BOOKINGS,
          prevBooking._id
        );
      } else {
        const payload = await onCreateDocument(form, ENUM_COLLECTIONS.BOOKINGS);
        router.replace(`/dashboard/bookings/${payload.data?._id}`);
      }
      setSaving(false);
    } catch (error) {
      setSaving(false);
    }
  };
  const handleSelectLocation = (locationId?: string) => {
    onDirectMutation((prev) => ({
      ...prev,
      locationId,
    }));
  };
  const handleSubscription = (subscriptionId: string) => {
    onDirectMutation((prev) => ({
      ...prev,
      subscriptionId,
    }));
  };
  const handleDelete = async (bookingId?: string) => {
    if (!bookingId) return;
    try {
      await onDeleteDocument(ENUM_COLLECTIONS.BOOKINGS, bookingId);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };
  const handleSelectCategory = (categoryId: string) => {
    onDirectMutation((prev) => ({
      ...prev,
      categories: [categoryId],
    }));
  };

  const handleDeleteCategory = useCallback(() => {
    onDirectMutation((prev) => ({
      ...prev,
      categories: [],
    }));
  }, []);

  const handleSelectImage = useCallback((images: IImageType[]) => {
    const lastImage = images[images.length - 1];
    onDirectMutation((prev) => ({
      ...prev,
      image: lastImage,
    }));
  }, []);

  const handleNewSession = useCallback((session: ISession) => {
    onDirectMutation((prev) => {
      const previous = prev.sessions.find(
        (prevSession) => prevSession._id === session._id
      );
      if (!previous) {
        return {
          ...prev,
          sessions: [...prev.sessions, session],
        };
      }
      return {
        ...prev,
        sessions: prev.sessions.map((prevSession) =>
          prevSession._id === session._id ? session : prevSession
        ),
      };
    });
  }, []);
  const handlePublishProduct = useCallback(
    async (event: ChangeEvent<HTMLInputElement>, bookingId?: string) => {
      const { checked } = event.currentTarget;

      if (!bookingId) return;

      onDirectMutation((prev) => ({
        ...prev,
        published: checked,
      }));
    },
    [form]
  );
  return (
    <Root>
      {saving ? <Backdrop /> : null}
      <CreateFormHeader
        saving={saving}
        onSubmit={handleSubmit}
        form={form}
        onDelete={handleDelete}
        onNameChange={onInputChange}
        backgroundImage={form.image}
        headerTitle='Title'
        onDeleteCategory={handleDeleteCategory}
        onPublish={handlePublishProduct}
      />
      <Flexbox flexWrap='wrap'>
        <Flexbox
          flexDirection='column'
          flex='1'
          style={{
            marginRight: '10px',
          }}>
          <ImageLoader
            onSubmitImages={handleSelectImage}
            images={form.image ? [form.image] : []}
            single
          />
          <Article headerTitle={t('Booking.serviceDetailTitle')}>
            <ContentDetailLayout>
              <InputGroup
                onInputChange={onInputChange}
                label={t('commons.name')}
                name='name'
                id='name'
                value={form.name || ''}
              />
              <InputGroup
                onInputChange={onInputChange}
                label={t('Booking.excerpt')}
                name='excerpt'
                id='excerpt'
                value={form.excerpt ?? ''}
              />
              <TextareaGroup
                onInputChange={onInputChange}
                label={t('commons.description')}
                name='description'
                id='description'
                value={form.description ?? ''}
              />
              <InputGroup
                onInputChange={onInputChange}
                type='number'
                label={t('Booking.maxParticipants')}
                name='maxParticipants'
                id='maxParticipants'
                value={form.maxParticipants ?? ''}
              />
            </ContentDetailLayout>
          </Article>
          <Article headerTitle={t('Booking.pricePayment')}>
            <ContentDetailLayout>
              <Selectbox
                label={t('Booking.serviceType')}
                name='paymentType'
                id='paymentType'
                onSelectOption={onInputChange}
                options={[
                  {
                    label: t('commons.select', {
                      type: 'select',
                    }),
                    value: '',
                  },
                  {
                    label: t('Booking.paymentType', {
                      type: 'session',
                    }),
                    value: 'session',
                  },
                  {
                    label: t('Booking.paymentType', {
                      type: 'subscription',
                    }),
                    value: 'subscription',
                  },
                ]}
              />
              {form.paymentType === 'session' ? (
                <PriceSessionForm form={form} onInputChange={onInputChange} />
              ) : form.paymentType === 'subscription' ? (
                <Subscriptions
                  subscriptionId={form.subscriptionId}
                  onSelectSubscription={handleSubscription}
                  form={form}
                  onInputChange={onInputChange}
                />
              ) : null}
            </ContentDetailLayout>
          </Article>
          <Article headerTitle={t('Booking.locations')}>
            <ContentDetailLayout>
              <Locations
                locationId={form.locationId}
                onSelectLocation={handleSelectLocation}
                onDeleteLocation={handleSelectLocation}
              />
            </ContentDetailLayout>
          </Article>
          <SessionForm
            onNewSession={handleNewSession}
            sessions={form.sessions}
          />
        </Flexbox>

        <Menu
          onSelectCategory={handleSelectCategory}
          previousSelectedCategories={form.categories ?? []}
        />
      </Flexbox>
    </Root>
  );
};
