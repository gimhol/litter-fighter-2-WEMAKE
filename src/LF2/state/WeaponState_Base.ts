import { collisions_keeper } from "../collision/CollisionKeeper";
import { Defines, IFrameInfo, ItrKind, StateEnum, WeaponType } from "../defines";
import { ICollision } from "../base/ICollision";
import type { Entity } from "../entity/Entity";
import State_Base, { WhatNext } from "./State_Base";

export default class WeaponState_Base extends State_Base {
  override on_collision(collision: ICollision): void {
    const { attacker } = collision;
    if (attacker.frame.state === StateEnum.Weapon_OnHand) {
      return;
    }
    if (
      attacker.data.base.type !== WeaponType.Heavy &&
      attacker.frame.state === StateEnum.Weapon_Throwing
    ) {
      // TODO: 这里是击中的反弹，如何更合适？ -Gim
      attacker.velocity_0.x = -0.3 * attacker.velocity_0.x;
      attacker.velocity_0.y = -0.3 * attacker.velocity_0.y;
    }
    attacker.enter_frame({ id: attacker.data.indexes?.in_the_sky });
  }

  override before_be_collided(collision: ICollision): WhatNext {
    const { itr } = collision;
    switch (itr.kind) {
      case ItrKind.Pick:
      case ItrKind.PickSecretly:
        return WhatNext.SkipAll;
    }
    return super.before_be_collided(collision);
  }

  override on_be_collided(collision: ICollision): void {
    const { itr, attacker, victim, a_cube, b_cube } = collision;
    switch (itr.kind) {
      case ItrKind.Normal:
      case ItrKind.CharacterThrew:
        const spark_x =
          (Math.max(a_cube.left, b_cube.left) +
            Math.min(a_cube.right, b_cube.right)) /
          2;
        const spark_y =
          (Math.min(a_cube.top, b_cube.top) +
            Math.max(a_cube.bottom, b_cube.bottom)) /
          2;
        const spark_z = Math.max(a_cube.far, b_cube.far);
        if (
          itr.bdefend &&
          itr.bdefend >= Defines.DEFAULT_FORCE_BREAK_DEFEND_VALUE
        )
          victim.hp = 0;
        else if (itr.injury) {
          victim.hp -= itr.injury;
          victim.hp_r -= itr.injury;
        }
        const is_fly =
          itr.fall &&
          itr.fall >=
          Defines.DEFAULT_FALL_VALUE_MAX - Defines.DEFAULT_FALL_VALUE_DIZZY;
        const spark_frame_name = is_fly ? "slient_critical_hit" : "slient_hit";
        victim.world.spark(spark_x, spark_y, spark_z, spark_frame_name);
        if (victim.data.base.type === WeaponType.Heavy) {
          if (is_fly) {
            const vx = itr.dvx ? itr.dvx * attacker.facing : 0;
            const vy = itr.dvy ? itr.dvy : 3;
            victim.velocity_0.x = vx / 2;
            victim.velocity_0.y = vy;
            victim.team = attacker.team;
            victim.next_frame = { id: victim.data.indexes?.in_the_sky };
          }
        } else {
          const vx = itr.dvx ? itr.dvx * attacker.facing : 0;
          const vy = itr.dvy ? itr.dvy : 3;
          victim.velocity_0.x = vx;
          victim.velocity_0.y = vy;
          victim.team = attacker.team;
          victim.next_frame = { id: victim.data.indexes?.in_the_sky };
        }
        break;
      default:
        collisions_keeper.handle(collision);
        break;
    }
  }

  override get_auto_frame(e: Entity): IFrameInfo | undefined {
    const { frames, indexes } = e.data;
    if (e.position.y > 0)
      return indexes?.in_the_sky ? frames[indexes.in_the_sky] : void 0;
    return indexes?.on_ground ? frames[indexes.on_ground] : void 0;
  }

  override update(e: Entity): void {
    e.handle_ground_velocity_decay();
  }
}
