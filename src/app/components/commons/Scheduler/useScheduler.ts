import { CellClickEvent, Event, UseSchedulerProps } from './types';
import { useState } from 'react';

const useScheduler = ({ initialEvents = [] }: UseSchedulerProps) => {
  const [events, setEvents] = useState<Event[]>(initialEvents);

  const onDataChange = (newEvents: Event[]) => {
    // User-defined logic
  };

  const handleAddEvent = (newEvent: Event) => {
    setEvents((currentEvents) => [...currentEvents, newEvent]);
  };

  const handleRemoveEvent = (eventId: string) => {
    setEvents((currentEvents) => currentEvents.filter((event) => event.id !== eventId));
  };
  const onEventSelect = (event: Event) => {
    // User-defined logic
  };

  const onEventEdit = (event: Event) => {
    // User-defined logic
  };

  const onEventHover = (event: Event) => {
    // User-defined logic
  };
  const onCellClick = (cellClickEvent: CellClickEvent) => {
    // User-defined logic
  };
  const renderEventItem = (event: Event) => {
    // User-defined render logic
  };

  const renderTooltip = (event: Event) => {
    // User-defined render logic
  };
  return { events, onAddEventAction: handleAddEvent, onRemoveEventAction: handleRemoveEvent, onCellClick, onDataChange, onEventEdit, onEventHover, onEventSelect, renderEventItem, renderTooltip };
};

export default useScheduler;
