import React, { ChangeEvent, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { Flexbox } from '@/src/app/components/commons/Flexbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArchive,
  faArrowAltDown,
  faArrowAltUp,
  faEllipsisV,
  faTrash,
} from '@fortawesome/pro-light-svg-icons';
import { Input } from '@/src/app/components/commons/form/Input';
import { ISection } from '@/src/types/DBTypes';
import { useTranslations } from 'next-intl';
import { Menu } from '@mui/material';
import { MoveButton } from './MoveButton';
import { DeleteConfirmation } from '@/src/app/components/commons/confirmation/DeleteConfirmation';
import { IAction } from '@/src/app/components/commons/confirmation/types';
import { Button } from '@/src/app/components/commons/Buttons/Button';
import { SwitchGroup } from '@/src/app/components/commons/form/SwitchGroup';
import { CollapseButton } from '@/src/app/components/commons/Buttons/CollapseButton';
import { MenuListItem } from '@/src/app/components/commons/Menu/MenuItem';
import { IconButton } from '@/src/app/components/commons/Buttons/IconButton';

const Header = styled.header<{ disabled?: boolean }>`
  padding: 18px 24px 10px;
  border-bottom: 1px solid var(--card-header-border-color);
  justify-content: space-between;
  display: flex;
  align-items: center;
  background-color: ${({ disabled }) =>
    disabled ? 'var(--disable-block-color)' : ''};
`;
const CustomInputTitle = styled(Input)`
  border: 1px solid transparent;
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 20px 1fr auto;
`;

interface Props {
  section: ISection;
  onChangeSectionName: (event: ChangeEvent<HTMLInputElement>) => void;
  onOpenAddProperty: VoidFunction;
  onArchive: VoidFunction;
  onMoveSectionUp: (sectionId: string) => void;
  onMoveSectionDown: (sectionId: string) => void;
  sectionArrayIndex: number;
  sectionsLength: number;
  onDeleteSection: (sectionId: string) => void;
  onPublishSection: (event: ChangeEvent<HTMLInputElement>) => void;
  onToggle?: VoidFunction;
  openCollapse: boolean;
}

export const SectionToolbar = ({
  section,
  onChangeSectionName,
  onOpenAddProperty,
  onArchive,
  onMoveSectionDown,
  onMoveSectionUp,
  sectionArrayIndex,
  sectionsLength,
  onDeleteSection,
  onPublishSection,
  onToggle,
  openCollapse,
}: Props) => {
  const t = useTranslations();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const actions: IAction[] = useMemo(
    () => [
      {
        label: t('commons.delete'),
        style: {
          backgroundColor: 'var(--error-color)',
        },
        callback: async () => onDeleteSection(section.id),
      },
    ],
    [section.id]
  );

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
    callback(section.id);
  };

  const handleArchive = () => {
    onArchive();
    setAnchorEl(null);
  };
  return (
    <Header disabled={section.isArchived}>
      <Wrapper>
        <CollapseButton open={openCollapse} onToggle={onToggle} />
        <CustomInputTitle
          name='title'
          value={section.title}
          onChange={onChangeSectionName}
          disabled={section.isArchived}
        />
        <SwitchGroup
          id={`published-${section.id}`}
          name='published'
          disabled={section.isArchived}
          label={
            section.published
              ? t('ProductForm.unPublished')
              : t('ProductForm.published')
          }
          value={section.published || false}
          onInputChange={onPublishSection}
        />
      </Wrapper>
      <Flexbox alignItems='center'>
        <Button
          type='button'
          disabled={section.isArchived}
          onClick={onOpenAddProperty}>
          {t('ProductForm.addProperty')}
        </Button>
        <MoveButton
          type='button'
          className='button-icon'
          disabled={sectionArrayIndex === 0 || section.isArchived}
          onClick={() => onMoveSectionUp(section.id)}>
          <FontAwesomeIcon icon={faArrowAltUp} />
        </MoveButton>
        <MoveButton
          type='button'
          className='button-icon'
          disabled={
            sectionArrayIndex === sectionsLength - 1 || section.isArchived
          }
          onClick={() => onMoveSectionDown(section.id)}>
          <FontAwesomeIcon icon={faArrowAltDown} />
        </MoveButton>

        <IconButton
          backgroundColor='var(--button-ellipsis-color)'
          icon={faEllipsisV}
          onClick={handleOpen}
        />
        <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
          <MenuListItem
            icon={faArchive}
            label={
              section.isArchived ? t('commons.unArchive') : t('commons.archive')
            }
            onClick={() => handleSelectMenu(handleArchive)}
            active={{
              status: section.isArchived,
              backgroundColor: 'var(--purple-color)',
              color: '#fff',
            }}
          />
          <DeleteConfirmation
            CustomDelete={
              <MenuListItem icon={faTrash} label={t('commons.delete')} />
            }
            withIcon
            withLabel={false}
            className='button-icon button-delete'
            headerTitle={t('commons.delete')}
            actions={actions}>
            <p>
              {t('ProductForm.deleteSectionMessage.title', {
                section: section.title,
              })}
            </p>
            <p>{t('ProductForm.deleteSectionMessage.explanation')}</p>
          </DeleteConfirmation>
        </Menu>
      </Flexbox>
    </Header>
  );
};
