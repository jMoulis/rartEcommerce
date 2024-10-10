import React, { useCallback, useMemo, useState } from 'react';
import { Flexbox } from '../commons/Flexbox';

interface Props {
  titleContext?: string;
}
export const useError = (props?: Props) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const onSetError = useCallback((error: string | null) => {
    setErrorMessage(error);
  }, []);
  const onClearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const ErrorComponent = useMemo(
    () => (
      <Flexbox
        alignItems='center'
        justifyContent='center'
        style={{
          marginTop: '20px',
        }}>
        {props?.titleContext ? <span>{props.titleContext}</span> : null}
        <span
          style={{
            color: 'red',
          }}>
          {errorMessage}
        </span>
      </Flexbox>
    ),
    [errorMessage]
  );

  return {
    onSetError,
    onClearError,
    errorMessage,
    ErrorComponent: errorMessage ? ErrorComponent : null,
  };
};
