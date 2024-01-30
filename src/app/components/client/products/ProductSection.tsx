import { IProperty, ISection } from '@/src/types/DBTypes';
import React, { ChangeEvent, Fragment, useCallback } from 'react';
import styled from '@emotion/styled';
import { Flexbox } from '../../commons/Flexbox';
import { renderProperties } from '../../dashboard/products/CreateForm/sections/Properties/renderProperties';

const Root = styled.div`
  margin-top: 10px;
`;
const Title = styled.h3``;
const ListProperties = styled.ul``;
const ListPropertiyItem = styled.li``;
type CustomChangeEvent = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

interface Props {
  section: ISection;
}

export const ProductSection = ({ section }: Props) => {
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
          flex='1'>
          {property.elements.map((element, key) => {
            if (!renderProperties[element.component]) return null;
            return (
              <Fragment key={key}>
                {renderProperties[element.component]({
                  label: element.label,
                  id: element.id,
                  name: element.technicalName,
                  className: property.align,
                  onInputChange: (event: CustomChangeEvent) =>
                    handlePropertyChange(event, property.id),
                  value: element.value ?? '',
                })}
              </Fragment>
            );
          })}
        </Flexbox>
      );
    },
    []
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
