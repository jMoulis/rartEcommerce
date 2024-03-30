import styled from '@emotion/styled';
export const Grid = styled.ul`
  display: grid;
  margin-top: 50px;
  grid-template-columns: repeat(4, 250px);
  gap: 30px;
  @media (max-width: 768px) {
    display: flex;
    overflow: auto;
    width: 95vw;
    margin-top: 30px;
    padding: 0 10px;
    gap: 15px;
  }
`;
