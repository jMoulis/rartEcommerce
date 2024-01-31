import { useMemo, useState } from 'react';

export const useMenu = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const onCloseModal = () => {
    setAnchorEl(null);
  };
  const onOpenModal = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };
  const open = useMemo(() => Boolean(anchorEl), [anchorEl]);

  return {
    onCloseModal,
    onOpenModal,
    open,
    anchorEl
  };
};
