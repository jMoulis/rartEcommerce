import React, { ChangeEvent, useMemo, useState } from 'react';
import { Flexbox } from '../../../commons/Flexbox';
import styled from '@emotion/styled';
import { SubmitButton } from './SubmitButton';
import { useTranslations } from 'next-intl';
import { Menu } from '@mui/material';
import { IProductService } from '@/src/types/DBTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive, faEllipsisH } from '@fortawesome/pro-light-svg-icons';
import { DeleteConfirmation } from '../../../commons/confirmation/DeleteConfirmation';
import { IAction } from '../../../commons/confirmation/types';
import { SwitchGroup } from '../../../commons/form/SwitchGroup';
import { Button } from '../../../commons/confirmation/Buttons/Button';

const Header = styled.header`
  padding: 10px;
  display: flex;
  justify-content: space-between;
`;
interface Props {
  saving: boolean;
  onSubmit: VoidFunction;
  onAddSection: VoidFunction;
  product: IProductService;
  onDeleteProduct: (productId?: string) => void;
  onArchiveProduct: (productId?: string) => void;
  onPublishProduct: (
    event: ChangeEvent<HTMLInputElement>,
    productId?: string
  ) => void;
}

export const CreateFormHeader = ({
  saving,
  onSubmit,
  onAddSection,
  product,
  onDeleteProduct,
  onArchiveProduct,
  onPublishProduct,
}: Props) => {
  const t = useTranslations('ProductForm');
  const tCommons = useTranslations('commons');
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const open = useMemo(() => Boolean(anchorEl), [anchorEl]);

  const handleOpen = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectMenu = (callback: (props: any) => void) => {
    setAnchorEl(null);
    callback(product.id);
  };

  const actions: IAction[] = useMemo(
    () => [
      {
        label: tCommons('delete'),
        style: {
          backgroundColor: 'var(--error-color)',
        },
        callback: async () => handleSelectMenu(onDeleteProduct),
      },
    ],
    [product.id]
  );

  return (
    <>
      <Header>
        <Flexbox alignItems='center'>
          <SubmitButton
            disabled={saving || product.isArchived}
            saving={saving}
            onClick={onSubmit}
          />
          <SwitchGroup
            id='published'
            name='published'
            label={product.published ? t('unPublished') : t('published')}
            value={product.published}
            onInputChange={(event) => onPublishProduct(event, product.id)}
          />
        </Flexbox>
        <Flexbox alignItems='center'>
          <Button
            type='button'
            disabled={saving || product.isArchived}
            onClick={onAddSection}>
            {t('addSection')}
          </Button>
          <Button
            type='button'
            className='button-icon'
            style={{
              backgroundColor: product.isArchived
                ? 'var(--purple-color)'
                : 'var(--cancel-color)',
            }}
            onClick={() => onArchiveProduct(product.id)}>
            <FontAwesomeIcon icon={faArchive} />
          </Button>
          <Button
            type='button'
            className='button-icon'
            style={{
              backgroundColor: 'var(--cancel-color)',
            }}
            onClick={handleOpen}>
            <FontAwesomeIcon icon={faEllipsisH} />
          </Button>
        </Flexbox>
      </Header>
      <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
        <DeleteConfirmation
          withLabel={false}
          withIcon
          className='button-icon'
          actions={actions}
          headerTitle={`${tCommons('delete')} - ${product.name}`}>
          <p>{t('deleteProductMessage.title', { product: product.name })}</p>
          <p>{t('deleteProductMessage.explanation')}</p>
        </DeleteConfirmation>
      </Menu>
    </>
  );
};
