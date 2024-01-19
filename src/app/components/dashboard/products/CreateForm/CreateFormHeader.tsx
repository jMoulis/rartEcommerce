import React, {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Flexbox } from '../../../commons/Flexbox';
import styled from '@emotion/styled';
import { SubmitButton } from './SubmitButton';
import { useTranslations } from 'next-intl';
import { Menu } from '@mui/material';
import { IProductService } from '@/src/types/DBTypes';
import {
  faArchive,
  faEllipsisV,
  faTrash,
} from '@fortawesome/pro-light-svg-icons';
import { DeleteConfirmation } from '../../../commons/confirmation/DeleteConfirmation';
import { IAction } from '../../../commons/confirmation/types';
import { SwitchGroup } from '../../../commons/form/SwitchGroup';
import { Button } from '../../../commons/Buttons/Button';
import { IconButton } from '../../../commons/Buttons/IconButton';
import { MenuListItem } from '../../../commons/Menu/MenuItem';
import { CategoryTags } from '../categories/CategoryTags';

const TopHeader = styled.header`
  position: relative;
  min-height: 200px;
  overflow: hidden;
`;
const BackgroundImage = styled.header<{ backgroundImage?: string }>`
  position: absolute;
  background: url(${({ backgroundImage }) => backgroundImage}), #fff;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  bottom: -10px;
  top: -10px;
  left: -10px;
  right: -10px;
  filter: blur(4px);
  opacity: 0.8;
`;

const HeaderMenu = styled.div`
  position: absolute;
  bottom: 0px;
  top: 0px;
  left: 0px;
  right: 0px;
  z-index: 1;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
`;
const ArticleInput = styled.input`
  width: fit-content;
  margin-left: 20px;
  margin-bottom: 20px;
  background-color: transparent;
  border: none;
  font-size: 30px;
  border: 1px solid transparent;
  &:focus {
    outline: none;
    border: 1px solid rgba(255, 255, 255, 0.5);
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

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
  onProductNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const CreateFormHeader = ({
  saving,
  onSubmit,
  onAddSection,
  product,
  onDeleteProduct,
  onArchiveProduct,
  onPublishProduct,
  onProductNameChange,
}: Props) => {
  const t = useTranslations('ProductForm');
  const tCommons = useTranslations('commons');
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);

  const open = useMemo(() => Boolean(anchorEl), [anchorEl]);

  const handleOpen = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: any) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleSelectMenu = (callback: (props: any) => void) => {
    setAnchorEl(null);
    callback(product._id);
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
    [product._id]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const toolbar = toolbarRef.current;
        if (toolbar) {
          if (!entry.isIntersecting) {
            toolbar.style.position = 'fixed';
            toolbar.style.top = '50px';
            toolbar.style.right = '0';
            toolbar.style.left = '175px';
            toolbar.style.zIndex = '300';
            toolbar.style.backgroundColor = '#fff';
            toolbar.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)'; // Discreet box shadow
          } else {
            toolbar.style.position = 'relative';
            toolbar.style.top = '';
            toolbar.style.right = '';
            toolbar.style.left = '';
            toolbar.style.width = 'auto';
            toolbar.style.zIndex = '';
            toolbar.style.backgroundColor = 'transparent';
            toolbar.style.boxShadow = 'none';
          }
        }
      },
      {
        root: null,
        threshold: 0,
      }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => {
      if (headerRef.current) {
        observer.unobserve(headerRef.current);
      }
    };
  }, []);
  return (
    <>
      <TopHeader ref={headerRef}>
        <BackgroundImage
          backgroundImage={product.images.find((image) => image.default)?.url}
        />
        <HeaderMenu>
          <ArticleInput
            name='name'
            value={product.name}
            onChange={onProductNameChange}
          />
          <Header ref={toolbarRef}>
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
                onInputChange={(event) => onPublishProduct(event, product._id)}
              />
              <CategoryTags categoriesIds={product.categories || []} />
            </Flexbox>
            <Flexbox alignItems='center'>
              <Button
                type='button'
                disabled={saving || product.isArchived}
                onClick={onAddSection}>
                {t('addSection')}
              </Button>

              <IconButton
                backgroundColor='var(--button-ellipsis-color)'
                icon={faEllipsisV}
                onClick={handleOpen}
              />
            </Flexbox>
          </Header>
        </HeaderMenu>
      </TopHeader>
      <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
        <MenuListItem
          icon={faArchive}
          label={tCommons('archive')}
          onClick={() => handleSelectMenu(onArchiveProduct)}
        />
        <DeleteConfirmation
          CustomDelete={
            <MenuListItem icon={faTrash} label={tCommons('delete')} />
          }
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
