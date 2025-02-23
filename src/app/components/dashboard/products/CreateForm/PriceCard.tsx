import { ChangeEvent } from 'react';
import { InputGroup } from '../../../commons/form/InputGroup';
import { Article } from './Article';
import { useTranslations } from 'next-intl';
import { IProductService } from '@/src/types/DBTypes';
import { SwitchGroup } from '../../../commons/form/SwitchGroup';

interface Props {
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onStockStatusChange: (event: ChangeEvent<HTMLInputElement>) => void;
  form: IProductService;
}

export const PriceCard = ({
  form,
  onInputChange,
  onStockStatusChange
}: Props) => {
  const t = useTranslations();
  return (
    <Article
      headerTitle={t('ProductForm.price')}
      styling={{
        root: {
          marginRight: '10px',
          height: 'auto'
        },
        body: {
          flexWrap: 'wrap'
        }
      }}>
      <InputGroup
        label={t('ProductForm.price')}
        type='number'
        id='price'
        name='price'
        onChange={onInputChange}
        value={form.price}
        styling={{
          root: {
            marginRight: '10px'
          }
        }}
      />
      {form.withStock ? (
        <InputGroup
          label={t('ProductForm.stockQuantity')}
          type='number'
          id='stockQuantity'
          name='stockQuantity'
          onChange={onInputChange}
          value={form.stockQuantity}
        />
      ) : null}
      <SwitchGroup
        id='withStock'
        name='withStock'
        label={t('ProductForm.withStock')}
        value={form.withStock}
        onInputChange={onStockStatusChange}
      />
    </Article>
  );
};
