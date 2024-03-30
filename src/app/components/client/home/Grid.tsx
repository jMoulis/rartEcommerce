import styled from '@emotion/styled';
export const Grid = styled.ul`
  display: grid;
  margin-top: 50px;
  grid-template-columns: repeat(4, 250px);
  gap: 30px;
  @media (max-width: 768px) {
    display: flex;
    overflow: auto;
    max-width: 97vw;
    margin-top: 30px;
    padding: 10px;
    gap: 15px;
  }
`;
