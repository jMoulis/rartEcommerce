import { faXmark } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CSSProperties } from 'react';

interface Props {
  onClose: VoidFunction;
  styling?: {
    root?: CSSProperties;
    icon?: CSSProperties;
  };
}
export const CloseModalButton = ({ onClose, styling }: Props) => {
  return (
    <button type='button' style={styling?.root} onClick={onClose}>
      <FontAwesomeIcon style={styling?.icon} icon={faXmark as any} />
    </button>
  );
};
