import React, { useState } from 'react';
import { Button } from '../../../commons/Buttons/Button';
import { useToggle } from '../../../hooks/useToggle';
import { FullDialog } from '../../../commons/dialog/FullDialog';
import { useTranslations } from 'next-intl';
import { IProductService } from '@/src/types/DBTypes';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import WorkshopList from './WorkshopList';
import { Flexbox } from '../../../commons/Flexbox';

interface Props {
  onSelectItem: (product: IProductService, remove: boolean) => void;
  selectedLineItems: any[];
}

const SelectItemsModal = ({ onSelectItem, selectedLineItems }: Props) => {
  const t = useTranslations();
  const { open, onOpen, onClose } = useToggle();
  const [selectedTab, setSelectedTab] = useState<'workshops' | 'products'>(
    'workshops'
  );
  return (
    <>
      <Button onClick={onOpen}>{t('Invoice.addProduct')}</Button>
      <FullDialog
        dialog={{
          fullWidth: true,
          maxWidth: 'sm'
        }}
        header={{
          title: t('commons.select')
        }}
        open={open}
        onClose={onClose}>
        <Flexbox>
          <Button
            style={{
              backgroundColor: selectedTab !== 'workshops' ? 'lightgray' : ''
            }}
            onClick={() => setSelectedTab('workshops')}>
            {t('Workshop.workshops')}
          </Button>
          <Button
            style={{
              backgroundColor: selectedTab !== 'products' ? 'lightgray' : ''
            }}
            onClick={() => setSelectedTab('products')}>
            {t('Product.products')}
          </Button>
        </Flexbox>
        <div
          style={{
            flex: '1',
            display: 'flex'
          }}>
          {selectedTab === 'workshops' ? (
            <WorkshopList
              collection={ENUM_COLLECTIONS.WORKSHOPS}
              onSelectItem={onSelectItem}
              selectedLineItems={selectedLineItems}
            />
          ) : null}
          {selectedTab === 'products' ? (
            <WorkshopList
              collection={ENUM_COLLECTIONS.PRODUCTS}
              onSelectItem={onSelectItem}
              selectedLineItems={selectedLineItems}
            />
          ) : null}
        </div>
      </FullDialog>
    </>
  );
};

export default SelectItemsModal;
