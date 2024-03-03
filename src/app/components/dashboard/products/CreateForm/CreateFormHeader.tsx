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
import {
  IWorkshop,
  IProductService,
  IInvoice,
  UserProfile,
} from '@/src/types/DBTypes';
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
import { IImageType } from './ImageLoader/types';

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
  width: 70%;
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
  align-items: center;
  overflow-y: auto;
`;

interface Props {
  saving?: boolean;
  onSubmit?: VoidFunction;
  onAddSection?: VoidFunction;
  form: IProductService | IWorkshop | IInvoice | UserProfile;
  onDelete?: (itemId?: string) => void;
  onArchive?: (itemId?: string) => void;
  onPublish?: (
    event: ChangeEvent<HTMLInputElement>,
    productId?: string
  ) => void;
  onNameChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  backgroundImage?: IImageType;
  headerTitle: string;
  onDeleteCategory?: (categoryId: string) => void;
  InputHeader?: React.ReactNode;
}

export const CreateFormHeader = ({
  saving,
  onSubmit,
  onAddSection,
  form,
  onDelete,
  onArchive,
  onPublish,
  onNameChange,
  backgroundImage,
  headerTitle,
  onDeleteCategory,
  InputHeader,
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

  const handleSelectMenu = (callback?: (props: any) => void) => {
    setAnchorEl(null);
    callback?.(form._id);
  };

  const actions: IAction[] = useMemo(
    () => [
      {
        label: tCommons('delete'),
        style: {
          backgroundColor: 'var(--error-color)',
        },
        callback: async () => handleSelectMenu(onDelete),
      },
    ],
    [form._id]
  );

  useEffect(() => {
    const isMobileDevice = window.innerWidth <= 768; // Check for mobile device width

    const observer = new IntersectionObserver(
      ([entry]) => {
        const toolbar = toolbarRef.current;
        if (toolbar) {
          if (!entry.isIntersecting) {
            toolbar.style.position = 'fixed';
            toolbar.style.top = '80px';
            toolbar.style.right = '0';
            toolbar.style.left = isMobileDevice ? '0' : '200px';
            toolbar.style.zIndex = '300';
            toolbar.style.backgroundColor = '#fff';
            toolbar.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)'; // Discreat box shadow
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
        <BackgroundImage backgroundImage={backgroundImage?.url} />
        <HeaderMenu>
          {InputHeader ?? (
            <ArticleInput
              name='name'
              value={(form as any).name || ''}
              disabled={!onNameChange}
              onChange={onNameChange}
            />
          )}
          <Header ref={toolbarRef}>
            <Flexbox alignItems='center'>
              {onSubmit ? (
                <SubmitButton
                  disabled={saving ?? (form as any).isArchived}
                  saving={saving}
                  onClick={onSubmit}
                />
              ) : null}
              {onPublish ? (
                <SwitchGroup
                  id='published'
                  name='published'
                  label={
                    (form as any).published ? t('unPublished') : t('published')
                  }
                  value={(form as any).published || false}
                  onInputChange={(event) => onPublish(event, (form as any)._id)}
                />
              ) : null}
              <CategoryTags
                onDeleteCategory={onDeleteCategory}
                categoriesIds={(form as any).categories || []}
              />
            </Flexbox>
            <Flexbox alignItems='center'>
              {onAddSection ? (
                <Button
                  type='button'
                  style={{
                    whiteSpace: 'nowrap',
                  }}
                  disabled={saving ?? (form as any).isArchived}
                  onClick={onAddSection}>
                  {t('addSection')}
                </Button>
              ) : null}
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
        {onArchive ? (
          <MenuListItem
            icon={faArchive}
            label={tCommons('archive')}
            onClick={() => handleSelectMenu(onArchive)}
          />
        ) : null}
        <DeleteConfirmation
          CustomDelete={
            <MenuListItem icon={faTrash} label={tCommons('delete')} />
          }
          withLabel={false}
          withIcon
          className='button-icon'
          actions={actions}
          headerTitle={headerTitle}>
          <p>
            {t('deleteProductMessage.title', { product: (form as any).name })}
          </p>
          <p>{t('deleteProductMessage.explanation')}</p>
        </DeleteConfirmation>
      </Menu>
    </>
  );
};
