import { IBaseNode } from "../../LF2/3d/IBaseNode";
import type { IIntersection, IObjectNode, ObjectEventKey } from "../../LF2/3d/IObject";
import type { IQuaternion, IRaycaster } from "../../LF2/defines";
import LF2 from "../../LF2/LF2";
import { is_num } from "../../LF2/utils/type_check";
import * as _T from "./_t";

export class __Object implements IObjectNode {
  readonly is_object_node = true;
  readonly is_base_node = true;
  readonly lf2: LF2;
  protected _parent?: IObjectNode;
  protected _children: IBaseNode[] = [];
  protected _inner: _T.Object3D;
  protected _rgba: [number, number, number, number] = [255, 255, 255, 1];
  protected _w?: number;
  protected _h?: number;
  protected _c_x: number = 0;
  protected _c_y: number = 0;
  protected _c_z: number = 0;
  protected _opacity: number = 1;
  constructor(lf2: LF2, inner?: _T.Object3D) {
    this.lf2 = lf2;
    this._inner = inner || new _T.Object3D();
    this.update_inner();
  }
  protected update_inner() {
    this._inner.userData.__wrapper = this;
  }
  get scale_x(): number {
    return this._inner.scale.x;
  }
  set scale_x(v: number) {
    this._inner.scale.x = v;
  }
  get scale_y(): number {
    return this._inner.scale.y;
  }
  set scale_y(v: number) {
    this._inner.scale.y = v;
  }
  get scale_z(): number {
    return this._inner.scale.z;
  }
  set scale_z(v: number) {
    this._inner.scale.z = v;
  }

  get parent(): IObjectNode | undefined {
    return this._parent;
  }
  set parent(v: IObjectNode | undefined) {
    this._parent = v;
  }
  get children(): readonly IBaseNode[] {
    return this._children;
  }
  get x(): number {
    return this._inner.position.x;
  }
  set x(v: number) {
    this._inner.position.x = v;
  }
  get y(): number {
    return this._inner.position.y;
  }
  set y(v: number) {
    this._inner.position.y = v;
  }
  get z(): number {
    return this._inner.position.z;
  }
  set z(v: number) {
    this._inner.position.z = v;
  }
  get name(): string {
    return this._inner.name;
  }
  set name(v: string) {
    this.set_name(v);
  }
  get visible(): boolean {
    return this._inner.visible;
  }
  set visible(v: boolean) {
    this.set_visible(v);
  }
  get opacity(): number {
    return 1;
  }
  set opacity(v: number) { }
  get w(): number {
    return is_num(this._w) ? this._w : 0;
  }
  set w(v: number) {
    this.set_size(v, void 0)
  }
  get h(): number {
    return is_num(this._h) ? this._h : 0;
  }
  set h(v: number) {
    this.set_size(void 0, v)
  }
  get size(): [number, number] {
    return [this.w, this.h];
  }
  set size([w, h]: [number, number]) {
    this.set_size(w, h);
  }
  get user_data(): Record<string, any> {
    return this._inner.userData;
  }
  set user_data(v: Record<string, any>) {
    this._inner.userData = v;
  }
  get rgba(): [number, number, number, number] {
    return this._rgba;
  }
  set rgba([r, g, b, a]: [number, number, number, number]) {
    this.set_rgba(r, g, b, a);
    this.apply();
  }
  get inner(): _T.Object3D {
    return this._inner;
  }

  unset_size(): this {
    this._w = this._h = void 0;
    return this;
  }
  set_opacity(v: number): this {
    this._opacity = v;
    return this;
  }
  set_visible(v: boolean): this {
    this._inner.visible = v;
    return this;
  }
  set_name(v: string): this {
    this._inner.name = v;
    return this;
  }
  set_x(x: number): this {
    this._inner.position.x = x;
    return this;
  }
  set_y(y: number): this {
    this._inner.position.y = y;
    return this;
  }
  set_z(z: number): this {
    this._inner.position.z = z;
    return this;
  }
  set_position(_x?: number, _y?: number, _z?: number): this {
    const { x, y, z } = this._inner.position;
    this._inner.position.set(_x ?? x, _y ?? y, _z ?? z);
    return this;
  }
  set_size(w?: number, h?: number): this {
    this._w = w ?? this._w;
    this._h = h ?? this._h;
    return this;
  }
  set_center(x?: number, y?: number, z?: number): this {
    this._c_x = x ?? this._c_x;
    this._c_y = y ?? this._c_y;
    this._c_z = z ?? this._c_z;
    return this;
  }
  apply(): this {
    return this;
  }
  add(...nodes: IBaseNode[]): this {
    for (const node of nodes) {
      node.parent = this;
      const object_3d = node.get_object_3d();
      if (object_3d.isObject3D) this.inner.add(object_3d);
      this._children.push(node);
    }
    return this;
  }
  del(...nodes: IBaseNode[]): this {
    for (const node of nodes) {
      const idx = this._children.indexOf(node);
      if (idx >= 0) this._children.splice(idx, 1);
      if (node.parent === this) node.parent = void 0;
      const object_3d = node.get_object_3d();
      if (object_3d.isObject3D) this.inner.remove(object_3d);
    }
    return this;
  }
  del_self(): void {
    if (this._parent) this._parent.del(this);
    else this._inner.removeFromParent();
  }
  dispose(): void {
    this.del_self();
  }
  get_user_data(key: string) {
    return this._inner.userData[key];
  }
  add_user_data(key: string, value: any): this {
    this._inner.userData[key] = value;
    return this;
  }
  del_user_data(key: string): this {
    delete this._inner.userData[key];
    return this;
  }
  merge_user_data(v: Record<string, any>): this {
    Object.assign(this._inner.userData, v);
    return this;
  }
  set_rgba(r: number, g: number, b: number, a: number): this {
    this._rgba = [r, g, b, a];
    return this;
  }
  set_scale(_x?: number, _y?: number, _z?: number): this {
    const { x, y, z } = this._inner.position;
    this._inner.scale.set(_x ?? x, _y ?? y, _z ?? z);
    return this;
  }
  set_scale_x(v: number): this {
    this.inner.scale.x = v;
    return this;
  }
  set_scale_y(v: number): this {
    this.inner.scale.y = v;
    return this;
  }
  set_scale_z(v: number): this {
    this.inner.scale.z = v;
    return this;
  }
  rotation_from_quaternion(q: IQuaternion): this {
    this.inner.rotation.setFromQuaternion(q as _T.Quaternion);
    return this;
  }
  intersect_from_raycaster(
    raycaster: IRaycaster,
    recursive?: boolean,
  ): IIntersection[] {
    const ret: IIntersection[] = [];
    const temp = (raycaster as _T.Raycaster).intersectObject(this.inner, recursive);
    for (const i of temp) {
      const wrapper = i.object.userData.__wrapper
      if (wrapper) ret.push({ object: wrapper })
    }
    return ret;
  }
  on(key: ObjectEventKey, fn: () => void) {
    this._inner.addEventListener(key, fn);
    return this;
  }
  off(key: ObjectEventKey, fn: () => void) {
    this._inner.removeEventListener(key, fn);
    return this;
  }
  get_object_3d() {
    return this.inner;
  }
}
