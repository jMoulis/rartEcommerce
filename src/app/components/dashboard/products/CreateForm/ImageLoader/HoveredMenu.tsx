import React, { ChangeEvent } from 'react';
import styled from '@emotion/styled';
import { Flexbox } from '@/src/app/components/commons/Flexbox';
import { Button } from '@/src/app/components/commons/confirmation/Buttons/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/pro-light-svg-icons';
import { InputGroupCheckbox } from '@/src/app/components/commons/form/InputCheckbox';

const Root = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  background: rgba(32, 69, 94, 0.8);
  border-radius: 8px;
  opacity: 0;
  display: flex;
  transition: opacity 150ms ease;
`;
interface Props {
  id: number;
  onChangeDefault: (event: ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
  onDeleteImage: VoidFunction;
}

export const HoveredMenu = ({
  id,
  onChangeDefault,
  checked,
  onDeleteImage,
}: Props) => {
  return (
    <Root className='hovered-image-menu'>
      <Flexbox alignItems='flex-start' justifyContent='space-between' flex='1'>
        {!checked ? (
          <InputGroupCheckbox
            id={`${id}`}
            name='default'
            label=''
            styling={{
              root: {
                margin: '10px',
              },
            }}
            value={checked ?? false}
            onInputChange={onChangeDefault}
            disabled={checked}
          />
        ) : (
          <span />
        )}
        <Button
          onClick={onDeleteImage}
          style={{
            backgroundColor: 'transparent',
            padding: 0,
            margin: '10px',
          }}>
          <FontAwesomeIcon icon={faXmark} />
        </Button>
      </Flexbox>
    </Root>
  );
};
