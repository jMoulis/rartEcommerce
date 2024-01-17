import { useCallback, useState } from 'react';

export const useToggle = (state: boolean = false) => {
  const [open, setOpen] = useState<boolean>(state);
  const onClose = useCallback(() => { setOpen(false); }, []);
  const onOpen = useCallback(() => { setOpen(true); }, []);
  const onToggle = useCallback(() => { setOpen((prev) => !prev); }, []);
  return {
    open,
    onOpen,
    onClose,
    onToggle
  };
};
