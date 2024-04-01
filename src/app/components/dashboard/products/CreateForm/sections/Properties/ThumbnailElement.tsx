import React, { useEffect } from 'react';
import { RenderPropertiesProps } from './renderProperties';
import { useOptions } from '@/src/app/components/hooks/useOptions';
import OptionListItem from '@/src/app/components/client/products/OptionListItem';
import styled from '@emotion/styled';

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;
const List = styled.ul`
  display: flex;
  margin-top: 10px;
  flex: 1;
`;
const ThumbnailElement = (props: RenderPropertiesProps) => {
  const { onFetchOptions, options } = useOptions();
  useEffect(() => {
    if (props.refIds) onFetchOptions(props.refIds);
  }, [props.refIds]);

  return (
    <Root>
      <h3>{props.label}</h3>
      <List>
        {options.map((option) => {
          return (
            <li key={option._id}>
              <OptionListItem
                product={option}
                key={option._id}
                onSelectProduct={() => props.onSelectOption(option)}
                selectedProduct={
                  props.selectedProductOptions?.get(props.propertyId) ?? null
                }
              />
            </li>
          );
        })}
      </List>
    </Root>
  );
};

export default ThumbnailElement;
