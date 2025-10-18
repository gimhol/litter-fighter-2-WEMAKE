import type { Room } from './Room';

export class RoomMgr {
  protected _all = new Set<Room>();
  protected _codes = new Map<string, Room>();
  get all(): ReadonlySet<Room> { return this._all }
  get codes(): ReadonlyMap<string, Room> { return this._codes }

  add(room: Room) {
    this._codes.set(room.code, room)
    this._all.add(room)
  }

  del(room: Room) {
    this._codes.delete(room.code)
    this._all.delete(room)
  }
}
