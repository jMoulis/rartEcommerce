import React from 'react';
import { RenderPropertiesProps } from './renderProperties';

const DisplayOnlyElement = (props: RenderPropertiesProps) => {
  return (
    <div>
      <span>{props.label}</span>
      <span>{props.value}</span>
    </div>
  );
};
export default DisplayOnlyElement;
