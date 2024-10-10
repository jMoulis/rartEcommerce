import styled from '@emotion/styled';

export const RoundedButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  /* Target the first button */
  & > button:first-of-type {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  /* Target the last button */
  & > button:last-of-type {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`;
