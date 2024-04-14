import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Flexbox } from '../commons/Flexbox';
import { faSpinner } from '@fortawesome/pro-light-svg-icons';
import { Suspense } from 'react';
import LocaleSwitcher from './LocaleSwitcher';
import { ProfileMenu } from './ProfileMenu/ProfileMenu';
import { CartMenu } from './CartMenu';

const ToolbarWrapper = styled(Flexbox)`
  display: flex;
  min-width: 100px;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    margin-left: 10px;
  }
`;

interface Props {
  withCart: boolean;
  isScrolled: boolean;
}
export const LanguageProfileMenu = ({ withCart, isScrolled }: Props) => {
  return (
    <ToolbarWrapper alignItems='center'>
      <Suspense
        fallback={
          <i>
            <FontAwesomeIcon icon={faSpinner} className='fa-pulse' />
          </i>
        }>
        <ProfileMenu />
      </Suspense>
      <LocaleSwitcher />
      {withCart ? <CartMenu isScrolled={isScrolled} /> : null}
    </ToolbarWrapper>
  );
};
