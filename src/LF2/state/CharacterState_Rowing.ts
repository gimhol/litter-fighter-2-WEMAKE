import { IFrameInfo } from "../defines";
import { Entity } from "../entity/Entity";
import CharacterState_Base from "./CharacterState_Base";

export class CharacterState_Rowing extends CharacterState_Base {
  override enter(e: Entity, prev_frame: IFrameInfo): void {
    if (e.position.y <= 0) return;
    const { rowing_distance: dx = 0, rowing_height: h = 0 } = e.data.base;

    e.merge_velocities();
    const { x } = e.velocity;
    if (x >= 0) {
      e.velocity_0.x = dx;
    } else {
      e.velocity_0.x = -dx;
    }
    e.velocity_0.y = e.world.gravity * Math.sqrt((6 * h) / e.world.gravity);
  }
  override on_landing(e: Entity): void {
    e.enter_frame({ id: e.data.indexes?.landing_1 });
  }
}
