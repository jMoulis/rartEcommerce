import React, { useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import {
  findAllOnce,
  onCreateDocument,
  onFetchDocsByIdsArray,
  onUpdateDocument,
} from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import {
  IProductService,
  IProductServiceWithCategories,
  IWorkshop,
} from '@/src/types/DBTypes';
import '@glideapps/glide-data-grid/dist/index.css';
import {
  DataEditor,
  Item,
  GridCell,
  GridCellKind,
  GridColumn,
} from '@glideapps/glide-data-grid';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/app/components/commons/Buttons/Button';
import { FullDialog } from '@/src/app/components/commons/dialog/FullDialog';
import { useToggle } from '@/src/app/components/hooks/useToggle';
import { CreateForm } from '../CreateForm';
import type { ButtonCell } from './ButtonCell';
import ButtonTest from './ButtonCell';
import { Flexbox } from '@/src/app/components/commons/Flexbox';
import { removeKeysFromObject } from '@/src/lib/utils/main';

const Root = styled.div``;

interface Props {
  onAddOption: (option: IProductService) => void;
  form?: IProductService | IWorkshop;
}

export const OptionCardForm = ({ onAddOption, form }: Props) => {
  const t = useTranslations();
  const { open, onOpen, onClose } = useToggle();
  const [products, setProducts] = useState<IProductServiceWithCategories[]>([]);
  const [loading, setLoading] = useState<'UNSET' | 'LOADING' | 'DONE'>('UNSET');
  const router = useRouter();
  const [duplicated, setDuplicated] = useState<IProductService | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading('LOADING');
      const payload = await findAllOnce(ENUM_COLLECTIONS.PRODUCTS);
      if (Array.isArray(payload.data)) {
        const fullData = await Promise.all(
          payload.data.map(async (prevProduct: IProductService) => {
            const { data: categories } = await onFetchDocsByIdsArray(
              prevProduct.categories,
              ENUM_COLLECTIONS.CATEGORIES
            );
            return {
              ...prevProduct,
              categories: categories ?? [],
            };
          })
        );
        setProducts(fullData);
      }
      setLoading('DONE');
    } catch (error) {
      setLoading('DONE');
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const columns: GridColumn[] = [
    { title: t('ProductForm.images'), id: '1' },
    { title: t('ProductForm.name'), id: '2' },
    { title: t('ProductForm.categories'), id: '3' },
    { title: 'Button', id: '4' },
  ];

  const getData = useCallback(
    ([col, row]: Item): GridCell => {
      const product = products[row];
      if (col === 0) {
        const imageUrl = product.images.find((image) => image.default)?.url;

        if (!imageUrl) {
          return {
            kind: GridCellKind.Text,
            data: 'No preview',
            allowOverlay: false,
            displayData: 'No preview',
          };
        }
        return {
          kind: GridCellKind.Image,
          data: [imageUrl],
          allowOverlay: false,
          displayData: [imageUrl],
        };
      } else if (col === 1) {
        return {
          kind: GridCellKind.Uri,
          data: `/dashboard/products/${product._id}`,
          hoverEffect: true,
          displayData: product.name,
          allowOverlay: false,
          onClickUri: (args) => {
            router.push(`/dashboard/products/${product._id}`);
          },
        };
      } else if (col === 2) {
        return {
          kind: GridCellKind.Bubble,
          data: product.categories.map((category) => category.name),
          allowOverlay: false,
        };
      } else if (col === 3) {
        const d: ButtonCell = {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: '4',
          readonly: true,
          data: {
            kind: 'button-cell',
            backgroundColor: ['transparent', '#6572ffee'],
            color: ['accentColor', 'accentFg'],
            borderColor: '#6572ffa0',
            borderRadius: 9,
            title: t('commons.select'),
            onClick: () => {
              onAddOption(product as any);
              onUpdateDocument(
                { parentId: form?._id },
                ENUM_COLLECTIONS.PRODUCTS,
                product._id!
              );
            },
          },
          themeOverride: {
            baseFontStyle: '700 12px',
          },
        };
        return d;
      } else {
        throw new Error();
      }
    },
    [products]
  );
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
        'updatedAt',
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

  if (loading !== 'DONE') return;

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
        <DataEditor
          customRenderers={[ButtonTest]}
          getCellContent={getData}
          columns={columns}
          rows={products.length}
          // theme={{
          //   roundingRadius: 300,
          // }}
        />
      </Root>
      <FullDialog
        open={open}
        onClose={onClose}
        dialog={{
          fullWidth: true,
          maxWidth: 'lg',
        }}
        styling={{
          content: {
            height: '20vh',
            minHeight: '20vh',
          },
        }}
        header={{
          title: t('ProductForm.addOption'),
        }}>
        {open ? (
          <CreateForm prevProduct={duplicated} onSubmit={handleCreateProduct} />
        ) : null}
      </FullDialog>
    </>
  );
};
