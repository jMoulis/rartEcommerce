import { Frequency, ByWeekday } from './types';

export class RecurrenceRule {
  freq?: Frequency;
  interval?: number;
  end?: Date;
  dtstart?: Date;
  byweekday?: ByWeekday[];

  constructor({ freq, interval, end, dtstart, byweekday }: { freq?: Frequency, interval?: number, end?: Date, dtstart?: Date, byweekday?: ByWeekday[] }) {
    this.freq = freq;
    this.interval = interval;
    this.end = end;
    this.dtstart = dtstart;
    this.byweekday = byweekday;
  }

  toString(): string {
    const rruleParts = [];

    if (this.freq) {
      rruleParts.push(`FREQ=${(this.freq as any).toUpperCase()}`);
    }
    if (this.interval) {
      rruleParts.push(`INTERVAL=${this.interval}`);
    }

    if (this.dtstart) {
      rruleParts.push(`DTSTART=${this.formatDate(this.dtstart)}`);
    }

    if (this.end) {
      rruleParts.push(`UNTIL=${this.formatDate(this.end)}`);
    }

    if (this.byweekday && this.byweekday.length > 0) {
      const weekdayStr = this.byweekday.map(day => day.toUpperCase().substring(0, 2)).join(',');
      rruleParts.push(`BYDAY=${weekdayStr}`);
    }

    return rruleParts.join(';');
  }

  private formatDate(date: Date): string {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }
}
