// Types for your state and actions
export interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

export interface SchedulerState {
  events: Event[];
}

export type SchedulerAction =
  | { type: 'ADD_EVENT'; event: Event }
  | { type: 'REMOVE_EVENT'; eventId: string };

export interface CellClickEvent {
  date: Date;
  events: Event[];
}

export interface UseSchedulerProps {
  initialEvents?: Event[];
  // Other configuration options as needed
}
