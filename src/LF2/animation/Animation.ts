import { IDebugging, make_debugging } from "../entity/make_debugging";
import { clamp } from "../utils/math/clamp";
import { IAnimation } from "./IAnimation";
const { max, floor } = Math;

export class Animation implements IAnimation, IDebugging {
  static TAG = 'Animation'
  debug!: (_0: string, ..._1: any[]) => void;
  warn!: (_0: string, ..._1: any[]) => void;
  log!: (_0: string, ..._1: any[]) => void;
  private _value: number = 0;
  private _time: number = 0;
  private _duration: number = 0
  private _direction: -1 | 1 = 1;
  private _loops: number = 1;
  private _fill_mode: 1 | 0 = 1;
  private _count: number = 0;

  constructor() {
    make_debugging(this)
  }

  get fill_mode(): 1 | 0 { return this._fill_mode; }
  set fill_mode(v: 1 | 0) { this.set_fill_mode(v) }
  set_fill_mode(v: 1 | 0) {
    if (v != 1 && v != 0) debugger;
    this._fill_mode = v == 1 || v == 0 ? v : this._fill_mode;
    return this
  }

  get count(): number { return this._count; }
  set count(v: number) { this.set_count(v) }
  set_count(v: number): this {
    this._count = clamp(floor(v), 0, this._loops)
    return this
  }

  get loops(): number { return this._loops; }
  set loops(v: number) { this.set_loops(v) }
  set_loops(v: number): this {
    this._loops = clamp(floor(v), -1, Number.MAX_SAFE_INTEGER)
    return this
  }

  get direction(): -1 | 1 { return this._direction; }
  set direction(v: -1 | 1) { this.set_direction(v) }
  set_direction(v: -1 | 1): this {
    if (v !== -1 && v !== 1) debugger;
    this._direction = (v === -1 || v === 1) ? v : this._direction;
    return this
  }

  get reverse(): boolean { return this.direction === -1; }
  set reverse(v: boolean) { this.set_reverse(v) }
  set_reverse(v: boolean): this {
    if (typeof v !== 'boolean') debugger;
    this.direction = v ? -1 : 1
    return this
  }

  get duration(): number { return this._duration; }
  set duration(v: number) { this.set_duration(v) }
  set_duration(v: number): this {
    this._duration = max(0, v);
    this._time = clamp(this._time, 0, this._duration)
    return this
  }

  get value(): number { return this._value; }
  set value(v: number) { this.set_value(v) }
  set_value(v: number): this { this._value = v; return this }

  get time(): number { return this._time; }
  set time(v: number) { this.set_time(v); }
  set_time(v: number): this { this._time = clamp(v, 0, this.duration); return this }

  get is_end(): boolean {
    const { loops, count, duration } = this;
    if (duration <= 0) return true;
    if (loops < 0) return false;
    return count >= loops;
  }
  start(reverse: boolean = this.reverse): this {
    this.count = 0;
    this.reverse = reverse;
    this.time = reverse ? this.duration : 0;
    return this;
  }
  end(reverse: boolean = this.reverse): this {
    this.count = Math.max(0, this._loops);
    this.reverse = reverse;
    this.time = reverse ? 0 : this.duration
    return this;
  }

  calc(): this {
    this.value = this.duration === 0 ? this.value : this.time / this.duration;
    return this;
  }

  update(dt: number): this {
    if (this.is_end) return this;
    const { duration, direction } = this
    let time = this.time + direction * dt;
    if (time <= 0) {
      do {
        ++this.count
        if (time < 0) time += duration
      } while (time < 0)
      if (this.is_end && this._fill_mode)
        time = 0
    } else if (time >= duration) {
      do {
        ++this.count
        time -= duration
      } while (time >= duration)
      if (this.is_end && this._fill_mode)
        time = duration
    }

    this.time = clamp(time, 0, duration);
    this.debug(`update`, `time = ${this.time}, dt = ${dt}`)
    this.calc();
    return this;
  }
}
