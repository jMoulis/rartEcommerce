import React, { useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import {
  findAllOnce,
  onCreateDocument,
  onFetchDocsByIdsArray,
  onUpdateDocument
} from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import {
  IProductService,
  IProductServiceWithCategories,
  IWorkshop
} from '@/src/types/DBTypes';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/app/components/commons/Buttons/Button';
import { FullDialog } from '@/src/app/components/commons/dialog/FullDialog';
import { useToggle } from '@/src/app/components/hooks/useToggle';
import { CreateForm } from '../CreateForm';
import { Flexbox } from '@/src/app/components/commons/Flexbox';
import { removeKeysFromObject } from '@/src/lib/utils/main';
import OptionsTable from './OptionsTable';

const Root = styled.div``;

interface Props {
  onAddOption: (option: IProductService) => void;
  form?: IProductService | IWorkshop;
}

export const OptionCardForm = ({ onAddOption, form }: Props) => {
  const t = useTranslations();
  const { open, onOpen, onClose } = useToggle();
  const [duplicated, setDuplicated] = useState<IProductService | null>(null);

  const handleCreateProduct = async (createdProduct: IProductService) => {
    onAddOption(createdProduct);
    onUpdateDocument(
      { parentId: form?._id },
      ENUM_COLLECTIONS.PRODUCTS,
      createdProduct._id!
    );
  };

  const handleDuplicateProduct = async () => {
    if (form) {
      const cleanForm = removeKeysFromObject(form, [
        '_id',
        'createdAt',
        'updatedAt'
      ]);
      const payload = await onCreateDocument(
        cleanForm,
        ENUM_COLLECTIONS.PRODUCTS
      );
      setDuplicated(payload.data);
      onOpen();
      onAddOption(payload.data);
    }
  };

  const handleSelectProduct = (product: IProductService) => {
    console.log(product);
    onAddOption(product);
  };

  return (
    <>
      <Root>
        <Flexbox>
          <Button type='button' onClick={onOpen}>
            {t('commons.create')}
          </Button>
          <Button type='button' onClick={handleDuplicateProduct}>
            {t('commons.duplicate')}
          </Button>
        </Flexbox>
        <OptionsTable onSelect={handleSelectProduct} />
        {/* <DataEditor
          customRenderers={[ButtonTest]}
          getCellContent={getData}
          columns={columns}
          rows={products.length}
          // theme={{
          //   roundingRadius: 300,
          // }}
        /> */}
      </Root>
      <FullDialog
        open={open}
        onClose={onClose}
        dialog={{
          fullWidth: true,
          maxWidth: 'lg'
        }}
        styling={{
          content: {
            height: '20vh',
            minHeight: '20vh'
          }
        }}
        header={{
          title: t('ProductForm.addOption')
        }}>
        {open ? (
          <CreateForm prevProduct={duplicated} onSubmit={handleCreateProduct} />
        ) : null}
      </FullDialog>
    </>
  );
};
