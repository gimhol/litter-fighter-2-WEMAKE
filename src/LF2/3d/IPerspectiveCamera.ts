import type { IQuaternion, IRaycaster, IVector2 } from "../defines";
import type { IObjectNode } from "./IObject";

export interface IPerspectiveCamera extends IObjectNode {
  readonly is_perspective_camera_node: true;
  get aspect(): number;
  set aspect(v: number);
  setup(
    l: number,
    r: number,
    t: number,
    b: number,
    n?: number,
    f?: number,
  ): this;
  world_quaternion(q: IQuaternion): this;
  raycaster(raycaster: IRaycaster, coords: IVector2): this;
}

export const is_perspective_camera_node = (v: any): v is IPerspectiveCamera =>
  v?.is_perspective_camera_node === true;
