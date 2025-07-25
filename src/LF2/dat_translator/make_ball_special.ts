import { BuiltIn_OID } from "../defines";
import { IEntityData } from "../defines/IEntityData";
import { traversal } from "../utils/container_help/traversal";
import { AllyFlag } from "../defines/AllyFlag";

export function make_ball_special(data: IEntityData) {
  switch (data.id) {
    case BuiltIn_OID.FirenFlame:
      traversal(data.frames, (_, frame) => {
        if (frame.itr) for (const itr of frame.itr)
          itr.ally_flags = AllyFlag.Enemy;
      });
      break;
    case BuiltIn_OID.FirzenBall:
      traversal(data.frames, (_, frame) => {
        frame.ctrl_spd_z = 0;
        frame.no_shadow = 1;
      });
      break;
    case BuiltIn_OID.BatBall:
      traversal(data.frames, (_, frame) => {
        frame.ctrl_spd_z = 0;
        frame.no_shadow = 1;
      });
      break;
  }
}
