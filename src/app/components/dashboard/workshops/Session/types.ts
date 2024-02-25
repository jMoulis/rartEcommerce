export interface RecurrenceRuleOptions {
  freq: string;
  interval: number;
  until?: Date;
  dtstart?: Date;
  byweekday?: string[];
}
export type WeekdayStr = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU';
export type ByWeekday = WeekdayStr;

export enum Frequency {
  YEARLY = 'YEARLY',
  MONTHLY = 'MONTHLY',
  WEEKLY = 'WEEKLY',
  DAILY = 'DAILY',
  HOURLY = 'DAILY',
  MINUTELY = 'DAILY',
  SECONDLY = 'SECONDLY'
}

export interface IRepetitionInput {
  days: WeekdayStr[];
  frequency: Frequency;
  end: string;
}
