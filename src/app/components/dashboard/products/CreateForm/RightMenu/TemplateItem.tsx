import React, { Fragment, useCallback } from 'react';
import { IProperty, ITemplate } from '@/src/types/DBTypes';
import { Article } from '../Article';
import { renderProperties } from '../sections/Properties/renderProperties';
import { Flexbox } from '@/src/app/components/commons/Flexbox';

interface Props {
  template: ITemplate;
}

export const TemplateItem = ({ template }: Props) => {
  const renderProperty = useCallback(
    (property: IProperty, propertyIndex: number) => {
      return (
        <Flexbox
          key={propertyIndex}
          style={{
            position: 'relative',
          }}
          flexDirection={property.align ?? 'column'}
          flex='1'>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
            }}
          />
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
                  disabled: true,
                  options: [],
                  onSelectOption: () => {},
                  onInputChange: () => {},
                  onChangeSelectbox: () => {},
                  refIds: element.refIds ?? [],
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
    <Flexbox
      flexDirection='column'
      style={{
        position: 'relative',
        overflow: 'auto',
      }}>
      {template.sections?.map((section, key) => (
        <Article key={key} headerTitle={section.title}>
          {section.properties.map((property, key) =>
            renderProperty(property, key)
          )}
        </Article>
      ))}
    </Flexbox>
  );
};
