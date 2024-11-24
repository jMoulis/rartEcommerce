import React from 'react';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/pro-light-svg-icons';

const Root = styled.div`
  display: flex;
  width: 170px;
  padding: 6px 16px;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  border-radius: 57px;
  border: 1px solid #fff;
  background: rgba(255, 255, 255, 0.8);
`;

interface Props {}

const GlobalSearch = (props: Props) => {
  return (
    <Root>
      <FontAwesomeIcon color='#085D79' icon={faSearch as any} />
    </Root>
  );
};
export default GlobalSearch;
