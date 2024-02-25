import { onFetchDocsByIdsArrayWithSnapshot } from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { IProductService } from '@/src/types/DBTypes';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Flexbox } from '@/src/app/components/commons/Flexbox';
import { IconButton } from '@/src/app/components/commons/Buttons/IconButton';
import { faEye, faUnlink } from '@fortawesome/pro-light-svg-icons';
import { useToggle } from '@/src/app/components/hooks/useToggle';
import { FullDialog } from '@/src/app/components/commons/dialog/FullDialog';
import { CreateForm } from '../CreateForm';

const Root = styled.ul`
  margin-top: 10px;
  flex: 1;
`;
const ListItem = styled.li`
  display: grid;
  align-items: center;
  grid-template-columns: 35px 1fr auto;
  margin: 10px 0;
  flex: 1;
`;

interface Props {
  refIds: string[];
  onDelete: (refId: string) => void;
}

export const DisplayOptions = ({ refIds, onDelete }: Props) => {
  const { open, onOpen, onClose } = useToggle();
  const [selectedProduct, setSelectedProduct] =
    useState<IProductService | null>(null);

  const [products, setProducts] = useState<IProductService[]>([]);
  useEffect(() => {
    const unsubscribe = onFetchDocsByIdsArrayWithSnapshot(
      refIds,
      ENUM_COLLECTIONS.PRODUCTS,
      (data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
      },
      (_error) => {}
    );

    return () => {
      unsubscribe?.();
    };
  }, [refIds]);
  const handleDisplayDetail = (product: IProductService) => {
    onOpen();
    setSelectedProduct(product);
  };

  return (
    <>
      <Root>
        {products.map((product, key) => {
          const defaultUrl = product.images.find((image) => image.default)?.url;
          return (
            <ListItem key={key}>
              {defaultUrl ? (
                <Image
                  src={defaultUrl}
                  alt='image'
                  width={30}
                  height={30}
                  style={{
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                />
              ) : (
                <Image
                  alt='image'
                  src='/images/fallback-image.png'
                  width={30}
                  height={30}
                  style={{
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                />
              )}
              <Flexbox flexDirection='column'>
                <span>{product.name}</span>
                <span
                  style={{
                    fontSize: '13px',
                  }}>{`${product.price} euros`}</span>
              </Flexbox>
              <Flexbox justifyContent='flex-end'>
                <IconButton
                  variant='xs'
                  icon={faEye}
                  onClick={() => handleDisplayDetail(product)}
                />
                <IconButton
                  variant='xs'
                  backgroundColor='var(--error-color)'
                  icon={faUnlink}
                  onClick={() => onDelete(product._id!)}
                />
              </Flexbox>
            </ListItem>
          );
        })}
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
            backgroundColor: 'var(--background-section-color',
          },
        }}
        header={{
          title: '',
        }}>
        {open ? (
          <CreateForm
            onSubmit={() => {}}
            prevProduct={selectedProduct ?? undefined}
          />
        ) : null}
      </FullDialog>
    </>
  );
};
