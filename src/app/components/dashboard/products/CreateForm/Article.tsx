import React, { forwardRef, useImperativeHandle } from 'react';
import styled from '@emotion/styled';
import { Collapse } from '@mui/material';
import { useToggle } from '../../../hooks/useToggle';
import { CollapseButton } from '../../../commons/Buttons/CollapseButton';

const Root = styled.article`
  border-radius: 10px;
  background-color: #fff;
  margin: 10px;
`;
const Header = styled.header`
  padding: 18px 24px;
  border-bottom: 1px solid var(--card-header-border-color);
  height: 66px;
  display: grid;
  grid-template-columns: 20px 1fr auto;
  align-items: center;
`;
const Content = styled.div`
  padding: 20px;
  display: flex;
`;

interface Props {
  children: React.ReactNode;
  headerTitle?: string;
  Header?: any;
}

export const Article = forwardRef(
  ({ children, headerTitle, Header: HeaderChild }: Props, ref: any) => {
    const { open, onToggle } = useToggle(true);
    useImperativeHandle(ref, () => ({
      onToggle: () => {
        onToggle();
        return !open;
      },
    }));

    return (
      <Root ref={ref}>
        {HeaderChild || (
          <Header>
            <CollapseButton open={open} onToggle={onToggle} />
            <h1>{headerTitle}</h1>
          </Header>
        )}
        <Collapse in={open}>
          <Content className='card-content'>{children}</Content>
        </Collapse>
      </Root>
    );
  }
);

Article.displayName = 'Article';
