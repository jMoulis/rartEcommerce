import { ChangeEvent } from 'react';
import { Article } from '../Article';
import { useTranslations } from 'next-intl';
import { IProductService } from '@/src/types/DBTypes';
import { Button } from '../../../../commons/Buttons/Button';
import { FullDialog } from '../../../../commons/dialog/FullDialog';
import { useToggle } from '../../../../hooks/useToggle';
import { OptionCardForm } from './OptionCardForm';
import { DisplayOptions } from './DisplayOptions';
import { Flexbox } from '@/src/app/components/commons/Flexbox';

interface Props {
  form: IProductService;
  onUpdateSection: React.Dispatch<React.SetStateAction<IProductService>>;
}

export const OptionsCard = ({ form, onUpdateSection }: Props) => {
  const { open, onClose, onOpen } = useToggle();

  const t = useTranslations();
  const handlePublishSection = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.currentTarget;
    onUpdateSection((prev) => {
      return {
        ...prev,
        options: {
          ...prev.options,
          published: checked,
        },
      };
    });
  };
  const handleAddOption = (refId: string) => {
    onUpdateSection((prev) => {
      return {
        ...prev,
        options: {
          ...prev.options,
          refIds: [...(prev.options?.refIds ?? []), refId],
        },
      };
    });
  };

  const handleDeleteOption = (refId: string) => {
    onUpdateSection((prev) => {
      return {
        ...prev,
        options: {
          ...prev.options,
          refIds: (prev.options?.refIds ?? []).filter(
            (prefRef) => prefRef !== refId
          ),
        },
      };
    });
  };
  return (
    <>
      <Article
        headerTitle={t('ProductForm.options')}
        published
        publishedValue={form.options?.published}
        onPublishSection={handlePublishSection}>
        <Flexbox flexDirection='column' flex='1'>
          <Button onClick={onOpen}>{t('ProductForm.addOption')}</Button>
          <DisplayOptions
            refIds={form.options?.refIds ?? []}
            onDelete={handleDeleteOption}
          />
        </Flexbox>
      </Article>
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
        {open ? <OptionCardForm onAddOption={handleAddOption} /> : null}
      </FullDialog>
    </>
  );
};
