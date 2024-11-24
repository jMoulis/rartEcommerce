import {
  faChevronDown,
  faChevronRight
} from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
  onToggle?: VoidFunction;
  open: boolean;
}
export const CollapseButton = ({ onToggle, open }: Props) => {
  return (
    <button type='button' onClick={onToggle}>
      <FontAwesomeIcon icon={open ? faChevronDown : (faChevronRight as any)} />
    </button>
  );
};
