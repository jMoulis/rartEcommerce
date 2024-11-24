import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Flexbox } from '../Flexbox';

interface Active {
  status?: boolean;
  backgroundColor?: string;
  color?: string;
}
const Root = styled.li`
  display: flex;
`;

const Item = styled.button<{
  active?: Active;
}>`
  position: relative;
  flex: 1;
  padding: 5px 10px;
  display: grid;
  grid-template-columns: 20px 1fr;
  gap: 5px;
  align-items: center;
  background-color: ${({ active }) => active?.status && active.backgroundColor};
  & * {
    color: ${({ active }) => active?.status && active.color};
  }
  &:hover {
    &::after {
      content: ' ';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: ${({ active }) =>
        active?.status && active.backgroundColor
          ? 'rgba(255,255,255,0.3)'
          : 'rgba(0, 0, 0, 0.05)'};
    }
  }
`;

interface Props {
  icon?: any;
  label?: string;
  onClick?: (event: any) => void;
  active?: Active;
}
export const MenuListItem = ({ icon, label, onClick, active }: Props) => {
  return (
    <Root>
      <Item type='button' onClick={onClick} active={active}>
        {icon ? (
          <Flexbox alignItems='center' justifyContent='center'>
            <FontAwesomeIcon icon={icon} />
          </Flexbox>
        ) : null}
        {label ? (
          <Flexbox alignItems='center'>
            <p style={{ fontSize: '15px' }}>{label}</p>
          </Flexbox>
        ) : null}
      </Item>
    </Root>
  );
};
