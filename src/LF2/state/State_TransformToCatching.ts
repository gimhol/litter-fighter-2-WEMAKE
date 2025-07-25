import { StateEnum } from "../defines";
import type { Entity } from "../entity/Entity";
import { State_Base } from "./State_Base";

export class State_TransformToCatching extends State_Base {
  override readonly state = StateEnum.TransformToCatching_End;
  override update(e: Entity): void {
    e.transfrom_to_another();
    e.enter_frame(e.find_auto_frame());
  }
}
