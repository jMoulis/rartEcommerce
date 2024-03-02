import styled from '@emotion/styled';

export const TableContainer = styled.div`
  label: TableContainer;
  border: 1px solid var(--card-header-border-color);
  border-radius: 8px;
  margin: 10px;
  overflow: auto;
  background-color: #fff;
  max-height: 70vh;
`;

export const Table = styled.table`
  width: 100%;
`;
export const Thead = styled.thead``;

export const Th = styled.th`
  padding: 10px;
  &:not(:last-child) {
    border-right: 1px solid var(--card-header-border-color);
  }
  background-color: var(--input-border-color);
`;

export const Tr = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid var(--card-header-border-color);
  }
  &:nth-child(odd) {
    background-color: #f5f5f5;
  }
`;

export const Td = styled.td`
  padding: 10px;
`;
export const Tbody = styled.tbody``;
