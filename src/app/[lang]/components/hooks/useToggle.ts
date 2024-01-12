import { useCallback, useState } from "react"

export const useToggle = (state?: boolean) => {
  const [open, setOpen] = useState<boolean>(false);
  const onClose = useCallback(() => setOpen(false), []);
  const onOpen = useCallback(() => setOpen(true), []);
  const onToggle = useCallback(() => setOpen((prev) => !prev), []);
  return {
    open,
    onOpen,
    onClose,
    onToggle
  }
}