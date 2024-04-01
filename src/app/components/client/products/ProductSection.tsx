import { IProductService, IProperty, ISection } from '@/src/types/DBTypes';
import React, { Fragment, useCallback } from 'react';
import styled from '@emotion/styled';
import { Flexbox } from '../../commons/Flexbox';
import { renderProperties } from '../../dashboard/products/CreateForm/sections/Properties/renderProperties';
import { CustomChangeEvent } from './type';

const Root = styled.div`
  margin-top: 10px;
`;
const Title = styled.h3`
  margin-bottom: 10px;
  color: var(--primary-color);
`;
const ListProperties = styled.ul``;
const ListPropertiyItem = styled.li``;

interface Props {
  section: ISection;
  preview?: boolean;
  onSelectOption: (product: IProductService, propertyId: string) => void;
  selectedProductOptions: Map<string, IProductService>;
}

export const ProductSection = ({
  section,
  preview,
  onSelectOption,
  selectedProductOptions,
}: Props) => {
  const handlePropertyChange = useCallback(
    (event: CustomChangeEvent, propertyId: string) => {},
    []
  );
  const renderProperty = useCallback(
    (property: IProperty, propertyIndex: number) => {
      return (
        <Flexbox
          key={propertyIndex}
          flexDirection={property.align ?? 'column'}
          flex='1'
          flexWrap='wrap'>
          {property.elements.map((element, key) => {
            if (!renderProperties[element.component]) return null;
            return (
              <Fragment key={key}>
                {renderProperties[element.component]({
                  label: element.label,
                  propertyId: property.id,
                  id: element.id,
                  name: element.technicalName,
                  className: property.align,
                  disabled: preview,
                  editable: element.editable,
                  refIds: element.refIds ?? [],
                  onSelectOption: (product: IProductService) => {
                    // eslint-disable-next-line no-useless-return
                    if (preview) return;
                    onSelectOption?.(product, property.id);
                  },
                  selectedProductOptions,
                  onChangeSelectbox: (event: CustomChangeEvent) =>
                    !preview ? handlePropertyChange(event, property.id) : {},
                  options: [],
                  onInputChange: (event: CustomChangeEvent) =>
                    !preview ? handlePropertyChange(event, property.id) : {},
                  value: element.value ?? '',
                })}
              </Fragment>
            );
          })}
        </Flexbox>
      );
    },
    [preview, selectedProductOptions]
  );
  return (
    <Root>
      <Title>{section.title}</Title>
      <ListProperties>
        {section.properties.map((property, key) => (
          <ListPropertiyItem key={key}>
            {renderProperty(property, key)}
          </ListPropertiyItem>
        ))}
      </ListProperties>
    </Root>
  );
};
