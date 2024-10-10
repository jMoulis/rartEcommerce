import { InputGroup } from '@/src/app/components/commons/form/InputGroup';
import { Selectbox } from '@/src/app/components/commons/form/Selectbox';
import { TextareaGroup } from '@/src/app/components/commons/form/TextareaGroup';
import DisplayOnlyElement from './DisplayOnlyElement';
import { CustomChangeEvent } from '@/src/app/components/client/products/type';
import { ENUM_PROPERTY_COMPONENT } from './enum';
import ThumbnailElement from './ThumbnailElement';
import { IProductService } from '@/src/types/DBTypes';

export interface RenderPropertiesProps {
  label: string;
  id: string;
  propertyId: string;
  name: string;
  className?: string;
  disabled?: boolean;
  editable?: boolean;
  onSelectOption: (product: IProductService) => void;
  onChangeSelectbox: (event: CustomChangeEvent) => void;
  options: Array<{ label: string; value: string }>;
  onInputChange: (event: CustomChangeEvent) => void;
  selectedProductOptions?: Map<string, IProductService>;
  value?: string | number | boolean;
  refIds: string[];
}

export const renderProperties: Record<
  string,
  (props: RenderPropertiesProps) => React.ReactNode
> = {
  [ENUM_PROPERTY_COMPONENT.INPUT]: (props) =>
    props.editable ? (
      <InputGroup {...props} />
    ) : (
      <DisplayOnlyElement {...props} />
    ),
  [ENUM_PROPERTY_COMPONENT.NUMERIC]: (props) =>
    props.editable ? (
      <InputGroup type='number' {...props} />
    ) : (
      <DisplayOnlyElement {...props} />
    ),
  [ENUM_PROPERTY_COMPONENT.TEXTAREA]: (props) =>
    props.editable ? (
      <TextareaGroup {...props} />
    ) : (
      <DisplayOnlyElement {...props} />
    ),
  [ENUM_PROPERTY_COMPONENT.SELECTBOX]: (props) =>
    props.editable ? (
      <Selectbox {...props} />
    ) : (
      <DisplayOnlyElement {...props} />
    ),
  [ENUM_PROPERTY_COMPONENT.THUMBNAIL]: (props) => (
    <ThumbnailElement {...props} />
  ),
};
