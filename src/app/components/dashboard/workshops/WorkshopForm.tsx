'use client';

import React, { useEffect, useState, useCallback, ChangeEvent } from 'react';
import styled from '@emotion/styled';
import { IWorkshop, ISession, ISection } from '@/src/types/DBTypes';
import { useForm } from '../../hooks/useForm';
import { InputGroup } from '../../commons/form/InputGroup';
import { useTranslations } from 'next-intl';
import { ContentDetailLayout } from '../../commons/Layouts/ContentDetailLayout';
import { TextareaGroup } from '../../commons/form/TextareaGroup';
import { Article } from '../products/CreateForm/Article';
import { Selectbox } from '../../commons/form/Selectbox';
import { PriceSessionForm } from './PriceSessionForm';
import { Subscriptions } from './Subscription/Subscriptions';
import {
  onUpdateDocument,
  onCreateDocument,
  onDeleteDocument
} from '@/src/app/contexts/firestore/useFirestore';
import { useRouter } from 'next/navigation';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { Flexbox } from '../../commons/Flexbox';
import { Menu } from '../products/CreateForm/RightMenu/Menu';
import { CreateFormHeader } from '../products/CreateForm/CreateFormHeader';
import { ImageLoader } from '../products/CreateForm/ImageLoader/ImageLoader';
import { IImageType } from '../products/CreateForm/ImageLoader/types';
import { Session } from './Session/Session';
import {
  defaultSection,
  generateDefaultBooking
} from '../products/CreateForm/defaultData';
import { ENUM_DASHBOARD_MENU_ROUTES } from '../routes';
import { toast } from 'react-toastify';
import QRCode from './QRCode';
import { ENUM_ROUTES } from '../../navbar/routes.enums';
import Preview from '../products/CreateForm/Preview';
import WorkshopDetail from '../../client/workshops/WorkshopDetail/WorkshopDetail';
import { Section } from '../products/CreateForm/sections/Section';
import { sortArrayByKey } from '../products/CreateForm/utils';

const Root = styled.div`
  overflow: auto;
  position: relative;
`;

interface Props {
  prevWorkshop?: IWorkshop;
}

const paymentTypeChoices = (t: any) => [
  {
    label: t('commons.select', {
      type: 'select'
    }),
    value: ''
  },
  {
    label: t('Booking.paymentType', {
      type: 'session'
    }),
    value: 'session'
  },
  {
    label: t('Booking.paymentType', {
      type: 'subscription'
    }),
    value: 'subscription'
  }
];
export const WorkshopForm = ({ prevWorkshop }: Props) => {
  const { form, onInitForm, onInputChange, onDirectMutation } =
    useForm<IWorkshop>();
  const [qrCodeValue, setQRCodeValue] = useState('');

  const t = useTranslations();
  const [displayPreview, setDisplayPreview] = useState(false);

  const [saving, setSaving] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (prevWorkshop) {
      onInitForm(prevWorkshop);
    } else {
      const defaultBooking = generateDefaultBooking();
      onInitForm(defaultBooking);
    }
  }, [prevWorkshop]);

  const handleSubmit = async () => {
    try {
      setSaving(true);
      if (prevWorkshop?._id) {
        const { error } = await onUpdateDocument(
          form,
          ENUM_COLLECTIONS.WORKSHOPS,
          prevWorkshop._id
        );
        if (error) {
          toast.error(error);
        }
      } else {
        const payload = await onCreateDocument(
          form,
          ENUM_COLLECTIONS.WORKSHOPS
        );
        router.replace(
          `${ENUM_DASHBOARD_MENU_ROUTES.WORKSHOPS}/${payload.data?._id}`
        );
      }
      setSaving(false);
    } catch (error) {
      setSaving(false);
    }
  };

  const handleSubscription = (subscriptionId: string) => {
    onDirectMutation((prev) => ({
      ...prev,
      subscriptionId
    }));
  };
  const handleDelete = async (bookingId?: string) => {
    if (!bookingId) return;
    try {
      await onDeleteDocument(ENUM_COLLECTIONS.WORKSHOPS, bookingId);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };
  const handleSelectCategory = (categoryId: string) => {
    onDirectMutation((prev) => ({
      ...prev,
      categories: [categoryId]
    }));
  };
  const handleDeleteCategory = useCallback(() => {
    onDirectMutation((prev) => ({
      ...prev,
      categories: []
    }));
  }, []);
  const handleSelectImage = useCallback((images: IImageType[]) => {
    const lastImage = images[images.length - 1];
    onDirectMutation((prev) => ({
      ...prev,
      image: lastImage
    }));
  }, []);
  const handleUpsertSession = useCallback(
    (session: ISession) => {
      onDirectMutation((prev) => {
        const previous = prev.sessions.find(
          (prevSession) => prevSession._id === session._id
        );
        if (!previous) {
          return {
            ...prev,
            sessions: [...prev.sessions, session]
          };
        }
        return {
          ...prev,
          sessions: prev.sessions.map((prevSession) =>
            prevSession._id === session._id ? session : prevSession
          )
        };
      });
    },
    [form]
  );

  const handleDeleteSession = useCallback((sessionId: string) => {
    onDirectMutation((prev) => {
      const updatedSessions = prev.sessions.filter(
        (prevSession) => prevSession._id !== sessionId
      );
      return {
        ...prev,
        sessions: updatedSessions
      };
    });
  }, []);
  const handlePublishProduct = useCallback(
    async (event: ChangeEvent<HTMLInputElement>, bookingId?: string) => {
      const { checked } = event.currentTarget;

      if (!bookingId) return;

      onDirectMutation((prev) => ({
        ...prev,
        published: checked
      }));
    },
    [form]
  );
  const handlePreview = () => {
    setDisplayPreview(true);
  };
  useEffect(() => {
    if (prevWorkshop?._id) {
      setQRCodeValue(
        `${window.location.origin}/${ENUM_ROUTES.WORKSHOPS}/${prevWorkshop._id}`
      );
    }
  }, []);
  const handleArchiveSection = (sectionId: string) => {
    onDirectMutation((prev) => {
      const updatedSections = sortArrayByKey(
        prev.sections.map((prevSection) =>
          prevSection.id === sectionId
            ? { ...prevSection, isArchived: !prevSection.isArchived }
            : prevSection
        ),
        'isArchived'
      ) as ISection[];
      return {
        ...prev,
        sections: updatedSections
      };
    });
  };
  const handleMoveSectionUp = useCallback(
    (sectionId: string) => {
      const updatedSections = [...(form.sections || [])];

      const index = updatedSections.findIndex((prev) => prev.id === sectionId);
      if (index > 0) {
        [updatedSections[index], updatedSections[index - 1]] = [
          updatedSections[index - 1],
          updatedSections[index]
        ];
      }
      onDirectMutation((prev) => ({
        ...prev,
        sections: updatedSections
      }));
    },
    [form.sections]
  );
  const handleMoveSectionDown = useCallback(
    (sectionId: string) => {
      const updatedSections = [...(form.sections || [])];
      const index = updatedSections.findIndex((prev) => prev.id === sectionId);
      if (index < updatedSections.length - 1) {
        [updatedSections[index], updatedSections[index + 1]] = [
          updatedSections[index + 1],
          updatedSections[index]
        ];
      }
      onDirectMutation((prev) => ({
        ...prev,
        sections: updatedSections
      }));
    },
    [form.sections]
  );
  const handleMovePropertyUp = useCallback(
    (propertyId: string, sectionId: string) => {
      onDirectMutation((prevForm) => {
        const sectionsClone = prevForm.sections.map((section) => ({
          ...section,
          properties: [...section.properties] // Deep clone properties
        }));

        const currentSection = sectionsClone.find(
          (section) => section.id === sectionId
        );
        if (!currentSection) return prevForm;

        const propertyIndex = currentSection.properties.findIndex(
          (property) => property.id === propertyId
        );
        if (propertyIndex <= 0) return prevForm; // Check if it's not the first element

        // Swap elements
        [
          currentSection.properties[propertyIndex],
          currentSection.properties[propertyIndex - 1]
        ] = [
          currentSection.properties[propertyIndex - 1],
          currentSection.properties[propertyIndex]
        ];

        return { ...prevForm, sections: sectionsClone };
      });
    },
    [form.sections]
  );
  const handleAddSection = () => {
    const newSection = defaultSection(t);
    onDirectMutation((prev) => ({
      ...prev,
      sections: sortArrayByKey(
        [...(prev.sections ?? []), newSection],
        'archived'
      ) as ISection[]
    }));
  };
  const handleMovePropertyDown = useCallback(
    (propertyId: string, sectionId: string) => {
      onDirectMutation((prevForm) => {
        // Deep cloning the sections array and the properties within each section
        const sectionsClone = prevForm.sections.map((section) => ({
          ...section,
          properties: [...section.properties]
        }));

        // Finding the section that contains the property to be moved
        const currentSection = sectionsClone.find(
          (section) => section.id === sectionId
        );
        if (!currentSection) return prevForm;

        // Finding the index of the property to be moved
        const propertyIndex = currentSection.properties.findIndex(
          (property) => property.id === propertyId
        );

        // If the property is not found or it's already the last element, return the previous state
        if (
          propertyIndex === -1 ||
          propertyIndex === currentSection.properties.length - 1
        ) {
          return prevForm;
        }

        // Swapping the property with the one below it
        [
          currentSection.properties[propertyIndex],
          currentSection.properties[propertyIndex + 1]
        ] = [
          currentSection.properties[propertyIndex + 1],
          currentSection.properties[propertyIndex]
        ];

        // Returning the new state with the updated sections
        return { ...prevForm, sections: sectionsClone };
      });
    },
    [form.sections]
  );
  return (
    <Root>
      {/* {saving ? <Backdrop /> : null} */}
      <CreateFormHeader
        saving={saving}
        onSubmit={handleSubmit}
        onAddSection={handleAddSection}
        form={form}
        onDelete={handleDelete}
        onNameChange={onInputChange}
        backgroundImage={form.image}
        headerTitle='Title'
        onDeleteCategory={handleDeleteCategory}
        onPublish={handlePublishProduct}
        onPreview={handlePreview}
      />
      <Flexbox flexWrap='wrap'>
        <Flexbox
          flexDirection='column'
          flex='1'
          style={{
            marginRight: '10px'
          }}>
          <ImageLoader
            onSubmitImages={handleSelectImage}
            images={form.image ? [form.image] : []}
            single
          />
          <Article headerTitle={t('Booking.serviceDetailTitle')}>
            <ContentDetailLayout>
              <InputGroup
                onChange={onInputChange}
                label={t('commons.name')}
                name='name'
                id='name'
                value={form.name || ''}
              />
              <InputGroup
                onChange={onInputChange}
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
            </ContentDetailLayout>
          </Article>
          <Article headerTitle={t('Booking.pricePayment')}>
            <ContentDetailLayout>
              <Selectbox
                label={t('Booking.serviceType')}
                name='paymentType'
                id='paymentType'
                value={form.paymentType}
                onChangeSelectbox={onInputChange}
                options={paymentTypeChoices(t)}
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

          <Session
            onUpsertSession={handleUpsertSession}
            sessions={form.sessions}
            onDeleteSession={handleDeleteSession}
            workshop={form}
          />
          {form.sections?.map((section, key) => (
            <Section
              section={section}
              sectionArrayIndex={key}
              sectionsLength={form.sections?.length}
              key={key}
              onUpdateSection={onDirectMutation as any}
              onArchiveSection={handleArchiveSection}
              onMoveSectionDown={handleMoveSectionDown}
              onMoveSectionUp={handleMoveSectionUp}
              onMovePropertyDown={handleMovePropertyDown}
              onMovePropertyUp={handleMovePropertyUp}
            />
          ))}
        </Flexbox>
        <Flexbox flexDirection='column'>
          <Menu
            onSelectCategory={handleSelectCategory}
            previousSelectedCategories={form.categories ?? []}
          />
          {prevWorkshop?._id ? <QRCode value={qrCodeValue} /> : null}
        </Flexbox>
      </Flexbox>
      <Preview
        preview={form}
        open={displayPreview}
        onClose={() => setDisplayPreview(false)}>
        <WorkshopDetail initialWorkshop={form} preview />
      </Preview>
    </Root>
  );
};
