import React, { ChangeEvent, forwardRef, useImperativeHandle } from 'react';
import styled from '@emotion/styled';
import { Collapse } from '@mui/material';
import { useToggle } from '../../../hooks/useToggle';
import { CollapseButton } from '../../../commons/Buttons/CollapseButton';
import { SwitchGroup } from '../../../commons/form/SwitchGroup';
import { useTranslations } from 'next-intl';

const Root = styled.article`
  label: Article;
  border-radius: 10px;
  background-color: #fff;
  margin: 10px 0;
  margin-bottom: 0;
  height: fit-content;
  @media (max-width: 768px) {
    min-width: 100%;
  }
`;
const Header = styled.header<{ open: boolean }>`
  padding: 10px 24px;
  border-bottom: ${({ open }) =>
    open ? '1px solid var(--card-header-border-color)' : 'none'};
  height: 50px;
  display: grid;
  grid-template-columns: 20px 1fr auto;
  align-items: center;
`;
const Content = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  height: fit-content;
`;

interface Props {
  children: React.ReactNode;
  headerTitle?: string;
  published?: boolean;
  item?: any;
  Header?: any;
  publishedValue?: boolean;
  styling?: {
    root?: React.CSSProperties;
    header?: React.CSSProperties;
    body?: React.CSSProperties;
  };
  onPublishSection?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const Article = forwardRef(
  (
    {
      children,
      headerTitle,
      Header: HeaderChild,
      styling,
      published,
      item,
      publishedValue,
      onPublishSection,
    }: Props,
    ref: any
  ) => {
    const { open, onToggle } = useToggle(true);
    const t = useTranslations();
    useImperativeHandle(ref, () => ({
      onToggle: () => {
        onToggle();
        return !open;
      },
    }));

    return (
      <Root ref={ref} style={styling?.root}>
        {HeaderChild || (
          <Header open={open} style={styling?.header}>
            <CollapseButton open={open} onToggle={onToggle} />
            <h1>{headerTitle}</h1>
            {published ? (
              <SwitchGroup
                id={`published-${item?.id}`}
                name='published'
                label={
                  publishedValue
                    ? t('ProductForm.unPublished')
                    : t('ProductForm.published')
                }
                value={publishedValue ?? false}
                onInputChange={onPublishSection}
              />
            ) : null}
          </Header>
        )}
        <Collapse in={open}>
          <Content style={styling?.body}>{children}</Content>
        </Collapse>
      </Root>
    );
  }
);

Article.displayName = 'Article';
