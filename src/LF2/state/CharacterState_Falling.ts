import type { IFrameInfo } from "../defines";
import type { Entity } from "../entity/Entity";
import find_direction from "../entity/find_frame_direction";
import CharacterState_Base from "./CharacterState_Base";

export default class CharacterState_Falling extends CharacterState_Base {
  _bouncing_frames_map = new Map<string, Set<string>>();
  _begin_velocty_y_map = new Map<string, number>();

  override enter(e: Entity, prev_frame: IFrameInfo): void {
    if (!this._bouncing_frames_map.has(e.data.id) && e.data.indexes?.bouncing) {
      this._bouncing_frames_map.set(
        e.data.id,
        new Set([
          ...e.data.indexes.bouncing[1],
          ...e.data.indexes.bouncing[-1],
        ]),
      );
    }
    this._begin_velocty_y_map.set(e.data.id, e.velocity_0.y);
    e.drop_holding();
  }
  is_bouncing_frame(e: Entity) {
    return !!this._bouncing_frames_map.get(e.data.id)?.has(e.frame.id);
  }
  override update(e: Entity): void {
    if (e.shaking > 0) return;
    if (this.is_bouncing_frame(e)) {
      this.update_bouncing(e);
    } else {
      this.update_falling(e);
    }
  }

  update_bouncing(e: Entity): void {
    e.handle_gravity();
    e.handle_ground_velocity_decay(0.7);
    e.handle_frame_velocity();
  }

  update_falling(e: Entity): void {
    e.handle_gravity();
    e.handle_frame_velocity();
    if (e.wait <= 0) {
      const { x, y } = e.velocity;
      let falling_frame_idx = 1; // ---
      if (y > 3) falling_frame_idx = 0; // ↗
      if (y < -3) falling_frame_idx = 2; // ↘
      const direction = x / e.facing > 0 ? (1 as const) : (-1 as const);
      e.enter_frame({
        id: e.data.indexes?.falling?.[direction][falling_frame_idx],
      });
    }
  }

  override on_landing(e: Entity): void {
    const {
      facing,
      data: { indexes },
    } = e;
    const f = e.frame;
    const d =
      find_direction(f, indexes?.bouncing) ||
      find_direction(f, indexes?.falling) ||
      find_direction(f, indexes?.critical_hit) ||
      facing;
    const { y: vy } = e.velocity;
    if (vy <= e.world.cha_bc_tst_spd) {
      e.enter_frame({ id: indexes?.bouncing?.[d][1] });
      e.velocity_0.y = e.world.cha_bc_spd;
    } else {
      e.enter_frame({ id: indexes?.lying?.[d] });
    }
  }
}
