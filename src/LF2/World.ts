import { Warn } from "../Log";
import { IOrthographicCameraNode, IScene } from "./3d";
import { Callbacks, FPS, ICollision, NoEmitCallbacks } from "./base";
import { Builtin_FrameId, Defines, IBdyInfo, IBounding, IEntityData, IFrameInfo, IItrInfo, StateEnum } from "./defines";
import { AllyFlag } from "./defines/AllyFlag";
import Ditto from "./ditto";
import { IBgRender } from "./ditto/render/IBgRender";
import { IEntityRenderer } from "./ditto/render/IEntityRenderer";
import { IFrameIndicators } from "./ditto/render/IFrameIndicators";
import {
  Entity, Factory, ICreator, is_ball,
  is_base_ctrl,
  is_character,
  is_local_ctrl,
  is_weapon
} from "./entity";
import { IWorldCallbacks } from "./IWorldCallbacks";
import LF2 from "./LF2";
import Stage from "./stage/Stage";
import { WhatNext } from "./state/State_Base";
import { find } from "./utils/container_help";
import float_equal from "./utils/math/float_equal";
import { is_num } from "./utils/type_check";
export class World {
  static readonly TAG = "World";
  readonly lf2: LF2;
  readonly _callbacks = new Callbacks<IWorldCallbacks>();
  private _spark_data?: IEntityData;
  private _spark_creator?: ICreator<Entity, typeof Entity>;
  itr_shaking: number = Defines.DEFAULT_ITR_SHAKING;
  itr_motionless: number = Defines.DEFAULT_ITR_MOTIONLESS;

  fvy_f: number = 1;
  fvx_f: number = 1;
  fvz_f: number = 1;
  ivy_f: number = 1;
  ivz_f: number = 1;
  ivx_f: number = 1;
  ivy_d: number = 5.5;
  ivx_d: number = 4;
  tvz_f: number = 1;
  tvx_f: number = 1;
  tvy_f: number = 1.3;

  /**
   * 角色进入场地时的闪烁无敌时间
   *
   * @type {number}
   */
  begin_blink_time: number = 144;

  /**
   * 倒地起身后的闪烁无敌时间
   *
   * @type {number}
   */
  lying_blink_time: number = 32;

  /**
   * “非玩家槽角色”死亡时后的闪烁时间
   * 
   * 闪烁完成后，非玩家槽角色应当被移除
   *
   * @type {number}
   * @memberof World
   */
  gone_blink_time: number = 56;

  vrest_offset: number = 0;
  arest_offset: number = 0;
  arest_offset_2: number = 0;

  /**
   * “帧等待数”偏移值
   * 
   * @note
   * “帧等待数”会在每次更新中减一
   * 每一帧会在“帧等待数”归零时，尝试进入下一帧。
   * 
   * 有：“帧等待数” = “帧本身的帧等待数” + “帧等待数”偏移值
   * 
   * @see {IFrameInfo.wait} 帧本身的“帧等待数”
   * 
   * @type {number}
   * @memberof World
   */
  frame_wait_offset: number = 0;

  cha_bc_spd: number = Defines.CHARACTER_BOUNCING_SPD;
  cha_bc_tst_spd: number = Defines.CHARACTER_BOUNCING_TEST_SPD;
  hp_recoverability: number = Defines.HP_RECOVERABILITY;
  hp_recovery_spd: number = Defines.HP_RECOVERY_SPD;
  hp_healing_spd: number = Defines.HP_HEALING_SPD;

  get callbacks(): NoEmitCallbacks<IWorldCallbacks> {
    return this._callbacks;
  }

  /**
   * 按键“双击”判定间隔，单位（帧数）
   *
   * 当同个按键在“双击判定间隔”之内按下两次，
   * 且中途未按下其对应冲突按键，视为“双击”。
   *
   */
  double_click_interval = Defines.DOUBLE_CLICK_INTERVAL;

  /**
   * 按键“按下”/“双击”的判定持续帧，单位：帧数
   *
   * 当某按键被“按下”（不松开），接下来的数帧（数值key_hit_duration）内，均判定为“按下”。
   * 此时若存在对应的“按键‘按下’跳转动作”，且满足跳转条件，角色将会进入对应的“按键‘按下’跳转动作”。
   *
   * 当某双击后，接下来的数帧（数值key_hit_duration）内，均判定为“双击”。
   * 此时若存在对应的“按键‘双击’跳转动作”，且满足跳转条件，角色将会进入对应的“按键‘双击’跳转动作”。
   */
  key_hit_duration = Defines.KEY_HIT_DURATION;

  protected _gravity = Defines.GRAVITY;

  friction_factor = Defines.FRICTION_FACTOR;
  friction = Defines.FRICTION;
  scene: IScene;
  camera: IOrthographicCameraNode;

  private _stage: Stage;
  entities = new Set<Entity>();

  readonly player_slot_characters = new Map<string, Entity>();

  get stage() {
    return this._stage;
  }
  set stage(v) {
    if (v === this._stage) return;
    const o = this._stage;
    this._stage = v;
    this._callbacks.emit("on_stage_change")(v, o);
    o.dispose();
    v.enter_phase(0);
  }

  get bg() {
    return this._stage.bg;
  }

  get left() {
    return this.bg.left || 0;
  }
  get right() {
    return this.bg.right || 0;
  }
  get near() {
    return this.bg.near || 0;
  }
  get far() {
    return this.bg.far || 0;
  }
  get width() {
    return this.bg.width || 0;
  }
  get depth() {
    return this.bg.depth || 0;
  }
  get middle() {
    return this.bg.middle || { x: 0, z: 0 };
  }

  protected _screen_w: number = Defines.CLASSIC_SCREEN_WIDTH;
  protected _screen_h: number = Defines.CLASSIC_SCREEN_HEIGHT;

  get screen_w(): number {
    return this._screen_w;
  }
  get screen_h(): number {
    return this._screen_h;
  }
  get gravity(): number {
    return this._gravity;
  }
  set gravity(v: number) {
    const prev = this._gravity;
    if (float_equal(v, prev)) return;
    this._gravity = v;
    this._callbacks.emit("on_gravity_change")(v, prev, this);
  }
  constructor(lf2: LF2) {
    this.lf2 = lf2;
    const w = (this._screen_w = Defines.CLASSIC_SCREEN_WIDTH);
    const h = (this._screen_h = 450); // Defines.OLD_SCREEN_HEIGHT;

    this.scene = new Ditto.SceneNode(lf2).set_size(w * 4, h * 4);
    this.camera = new Ditto.OrthographicCamera(lf2)
      .setup(0, w, h, 0)
      .set_position(void 0, void 0, 10)
      .set_name("default_orthographic_camera")
      .apply();
    this.scene.add(this.camera);
    this._stage = new Stage(this, Defines.VOID_BG);
  }

  entity_renderer_packs = new Map<Entity, [
    IEntityRenderer, IEntityRenderer, IEntityRenderer, IFrameIndicators
  ]>();
  add_entities(...entities: Entity[]) {
    for (const entity of entities) {
      if (
        is_character(entity) &&
        is_base_ctrl(entity.ctrl) &&
        this.lf2.players.has(entity.ctrl.player_id)
      ) {
        this.player_slot_characters.set(entity.ctrl.player_id, entity);
        this._callbacks.emit("on_player_character_add")(
          entity.ctrl.player_id,
        );
      }

      this.entities.add(entity);
      const entity_renderer = new Ditto.EntityRender(entity);
      entity_renderer.on_mount();

      const shadow_renderer = new Ditto.EntityShadowRender(entity);
      shadow_renderer.on_mount()

      const info_renderer = new Ditto.EntityInfoRender(entity);
      info_renderer.on_mount()

      const frame_indicators = new Ditto.FrameIndicators(entity);
      frame_indicators.on_mount()

      this.entity_renderer_packs.set(entity, [
        entity_renderer, shadow_renderer, info_renderer, frame_indicators
      ]);

      // entity_renderer.indicators.flags = this._indicator_flags;
    }
  }

  del_entity(e: Entity) {
    if (!this.entities.delete(e)) return false;
    if (e.ctrl?.player_id) {
      const ok = this.player_slot_characters.delete(e.ctrl.player_id);
      if (ok)
        this._callbacks.emit("on_player_character_del")(e.ctrl.player_id);
    }
    const pack = this.entity_renderer_packs.get(e);
    if (pack) {
      const [r1, r2, r3, r4] = pack
      r1.on_unmount();
      r2.on_unmount();
      r3.on_unmount();
      r4.on_unmount();
      this.entity_renderer_packs.delete(e);
    }
    e.dispose();
    return true;
  }

  del_entities(entities: Entity[]) {
    for (const e of entities) {
      this.del_entity(e);
    }
  }

  private _need_FPS: boolean = true;
  private _need_UPS: boolean = true;
  private _FPS = new FPS(0.9);
  private _UPS = new FPS(0.9);
  private _render_worker_id?: ReturnType<typeof Ditto.Render.add>;
  private _update_worker_id?: ReturnType<typeof Ditto.Interval.add>;

  /**
   * 同步渲染
   *
   * @private
   * @type {(0 | 1 | 2)}
   */
  private _sync_render: 0 | 1 | 2 = 0;
  get sync_render(): number {
    return this._sync_render;
  }
  set sync_render(v: number) {
    this.set_sync_render(v);
  }

  set_sync_render(v: number = this._sync_render + 1) {
    if (this._sync_render === v) return;
    const prev = this._sync_render;
    const curr = (this._sync_render = (Math.floor(v) % 3) as 0 | 1 | 2);
    this.start_render();
    this.start_update();
    this._callbacks.emit("on_is_sync_render_changed")(curr, prev);
  }

  stop_render() {
    this._render_worker_id && Ditto.Render.del(this._render_worker_id);
    this._render_worker_id = 0;
  }

  start_render() {
    if (this._render_worker_id) Ditto.Render.del(this._render_worker_id);
    if (this._sync_render) return;
    let _r_prev_time = 0;
    const on_render = (time: number) => {
      const dt = time - _r_prev_time;
      if (_r_prev_time !== 0) {
        this.render_once(dt);
      }
      if (_r_prev_time !== 0 && this._need_FPS) {
        this._FPS.update(dt);
        this._callbacks.emit("on_fps_update")(this._FPS.value);
      }
      _r_prev_time = time;
    };
    this._render_worker_id && Ditto.Render.del(this._render_worker_id);
    this._render_worker_id = Ditto.Render.add(on_render);
  }

  stop_update() {
    this._update_worker_id && Ditto.Interval.del(this._update_worker_id);
    this._update_worker_id = void 0;
  }

  private _prev_time: number = Date.now();
  private _update_count: number = 0;
  private _fix_radio: number = 1;
  start_update() {
    if (this._update_worker_id) Ditto.Interval.del(this._update_worker_id);

    const on_update = () => {
      const time = Date.now();
      const real_dt = time - this._prev_time;
      if (real_dt < this._ideally_dt * this._fix_radio) return;
      this._update_count++;
      if (!this._paused) this.update_once();
      if (0 === this._update_count % this._sync_render) {
        this.render_once(real_dt);
        this._callbacks.emit("on_fps_update")(
          this._UPS.value / this._sync_render,
        );
      }
      this._UPS.update(real_dt);
      this._fix_radio = this._UPS.value / 60;
      if (this._need_UPS) {
        this._callbacks.emit("on_ups_update")(this._UPS.value, 0);
      }
      this._prev_time = time;
    };
    this._update_worker_id = Ditto.Interval.add(on_update, 0);
  }

  /**
   * 限制角色位置
   * 
   * @param {Entity} e 角色实体
   * @return {void} 
   * @memberof World
   */
  restrict_character(e: Entity): void {
    if (!this.bg) return;
    const { left, right, near, far, player_left, player_right } = this.stage;

    const is_player = is_local_ctrl(e.ctrl);
    const l = is_player ? player_left : left;
    const r = is_player ? player_right : right;

    const { x, z } = e.position;
    if (x < l) e.position.x = l;
    else if (x > r) e.position.x = r;

    if (z < far) e.position.z = far;
    else if (z > near) e.position.z = near;
  }

  /**
   * 限制“波”位置
   *
   * 当“波”离开地图太远，直接标记为移除
   * 
   * @param {Entity} e “波”
   * @return {void}
   * @memberof World
   */
  restrict_ball(e: Entity): void {
    if (!this.bg) return;
    const { left, right, near, far } = this.bg.data.base;
    const { x, z } = e.position;
    if (x < left - 800) e.enter_frame(Defines.NEXT_FRAME_GONE);
    else if (x > right + 800) e.enter_frame(Defines.NEXT_FRAME_GONE);
    if (z < far) e.position.z = far;
    else if (z > near) e.position.z = near;
  }

  /**
   * 限制“武器”位置
   *
   * 当“武器”离开地图太远，直接标记为移除
   * 
   * @param {Entity} e “武器”
   * @return {void}
   * @memberof World
   */
  restrict_weapon(e: Entity): void {
    if (!this.bg) return;
    const { left, right, near, far } = this.bg.data.base;
    const { x, z } = e.position;
    if (x < left - 100) e.enter_frame(Defines.NEXT_FRAME_GONE);
    else if (x > right + 100) e.enter_frame(Defines.NEXT_FRAME_GONE);
    if (z < far) e.position.z = far;
    else if (z > near) e.position.z = near;
  }

  /**
   * 限制“实体”位置
   *
   * @param {Entity} e
   * @memberof World
   */
  restrict(e: Entity): void {
    if (is_character(e)) {
      this.restrict_character(e);
    } else if (is_ball(e)) {
      this.restrict_ball(e);
    } else if (is_weapon(e)) {
      this.restrict_weapon(e);
    }
  }

  manhattan(e1: Entity, e2: Entity) {
    const p1 = e1.position;
    const p2 = e2.position;
    return Math.abs(p1.x - p2.x) + Math.abs(p1.z - p2.z);
  }

  private gone_entities: Entity[] = [];
  private _entity_chasers = new Set<Entity>();
  add_entity_chaser(entity: Entity) {
    this._entity_chasers.add(entity);
  }
  del_entity_chaser(entity: Entity) {
    this._entity_chasers.delete(entity);
    entity.chasing_target = void 0;
  }
  update_once() {
    for (const e of this.entities) {
      e.self_update();

      if (e.chasing_target && !e.chasing_target.ctrl) {
        e.chasing_target = void 0;
      }

      for (const chaser of this._entity_chasers) {
        if (!is_character(e) || chaser.is_ally(e) || e.hp <= 0)
          continue;
        const prev = chaser.chasing_target;
        if (!prev || this.manhattan(prev, chaser) > this.manhattan(e, chaser)) {
          chaser.chasing_target = e;
        }
      }
    }
    this.gone_entities.length = 0;
    for (const e of this.entities) {
      e.update();
      if (
        e.frame.id === Builtin_FrameId.Gone ||
        e.frame.state === StateEnum.Gone
      ) {
        this.gone_entities.push(e);
      }
    }
    this.del_entities(this.gone_entities);
    this.collision_detections();

    this.update_camera();
    this.bg.update();
    this.stage.update();
  }

  bg_render: IBgRender = new Ditto.BgRender(this);

  render_once(dt: number) {
    this.bg_render.render();
    for (const [, [r1, r2, r3, r4]] of this.entity_renderer_packs) {
      r1.render();
      r2.render();
      r3.render();
      r4.render();
    }
    this.lf2.layout?.render(dt);
    this.scene.render();
  }
  cam_speed = 0;
  lock_cam_x: number | undefined = void 0;

  update_camera() {
    const old_cam_x = Math.floor(this.camera.x);
    const { player_left, left, player_right, right } = this.stage;
    const max_cam_left = is_num(this.lock_cam_x) ? left : player_left;
    const max_cam_right = is_num(this.lock_cam_x) ? right : player_right;
    let new_x = this.camera.x;
    let max_speed_ratio = 50;
    let acc_ratio = 1;
    if (is_num(this.lock_cam_x)) {
      new_x = this.lock_cam_x;
      max_speed_ratio = 1000;
      acc_ratio = 10;
    } else if (this.player_slot_characters.size) {
      let l = 0;
      new_x = 0;

      const has_human_player = find(
        this.player_slot_characters,
        ([_, p]) => is_local_ctrl(p.ctrl) && p.hp > 0,
      );
      for (const [, player] of this.player_slot_characters) {
        const c = player.ctrl;
        if (!is_local_ctrl(c) && has_human_player) continue;
        new_x += player.position.x - 794 / 2 + (player.facing * 794) / 6;
        ++l;
      }
      new_x = Math.floor(new_x / l);
    }
    if (new_x < max_cam_left) new_x = max_cam_left;
    if (new_x > max_cam_right - 794) new_x = max_cam_right - 794;

    let cur_x = this.camera.x;
    const acc = Math.min(
      acc_ratio,
      (acc_ratio * Math.abs(cur_x - new_x)) / this._screen_w,
    );
    const max_speed = max_speed_ratio * acc;

    if (cur_x > new_x) {
      if (this.cam_speed > 0) this.cam_speed = 0;
      else if (this.cam_speed > -max_speed) this.cam_speed -= acc;
      else this.cam_speed = -max_speed;
      this.camera.x += this.cam_speed;
      if (this.camera.x < new_x) this.camera.x = new_x;
    } else if (cur_x < new_x) {
      if (this.cam_speed < 0) this.cam_speed = 0;
      else if (this.cam_speed < max_speed) this.cam_speed += acc;
      else this.cam_speed = max_speed;
      this.camera.x += this.cam_speed;
      if (this.camera.x > new_x) this.camera.x = new_x;
    }

    const new_cam_x = Math.floor(this.camera.x);
    if (old_cam_x !== new_cam_x) {
      this._callbacks.emit("on_cam_move")(new_cam_x);
    }
  }

  private _temp_entitis_set = new Set<Entity>();
  collision_detections() {
    this._temp_entitis_set.clear();
    for (const a of this.entities) {
      for (const b of this._temp_entitis_set) {
        this.collision_detection(a, b);
        this.collision_detection(b, a);
      }
      this._temp_entitis_set.add(a);
    }
  }

  collision_detection(a: Entity, b: Entity) {
    if (b.blinking || b.invisible) return;
    const af = a.frame;
    const bf = b.frame;
    if (!af.itr?.length || !bf.bdy?.length) return;
    const b_catcher = b.catcher;
    if (b_catcher && b_catcher.frame.cpoint?.hurtable !== 1) return;
    const l0 = af.itr.length;
    const l1 = bf.bdy.length;
    for (let i = 0; i < l0; ++i) {
      for (let j = 0; j < l1; ++j) {
        this.collision_test(a, af, af.itr[i], b, bf, bf.bdy[j]);
      }
    }
  }

  collision_test(
    attacker: Entity,
    aframe: IFrameInfo,
    itr: IItrInfo,
    victim: Entity,
    bframe: IFrameInfo,
    bdy: IBdyInfo,
  ) {
    switch (aframe.state) {
      case StateEnum.Weapon_OnHand: {
        const atk = attacker.holder?.frame.wpoint?.attacking;
        if (!atk) return;
        const itr_prefab = attacker.data.itr_prefabs?.[atk];
        if (!itr_prefab) return;
        itr = { ...itr, ...itr_prefab };
        break;
      }
      case StateEnum.Weapon_Rebounding: {
        return;
      }
    }
    const is_ally = attacker.is_ally(victim);
    if (
      is_ally ? (
        !(itr.ally_flags & AllyFlag.Ally) &&
        !(bdy.ally_flags & AllyFlag.Ally)
      ) : (
        !(itr.ally_flags & AllyFlag.Enemy) &&
        !(bdy.ally_flags & AllyFlag.Enemy)
      )
    ) return;

    if (!itr.vrest && attacker.a_rest) return;
    if (itr.vrest && victim.get_v_rest(attacker.id) > 0) return;
    const a_cube = this.get_bounding(attacker, aframe, itr);
    const b_cube = this.get_bounding(victim, bframe, bdy);
    if (
      a_cube.left <= b_cube.right &&
      a_cube.right >= b_cube.left &&
      a_cube.bottom <= b_cube.top &&
      a_cube.top >= b_cube.bottom &&
      a_cube.far <= b_cube.near &&
      a_cube.near >= b_cube.far
    ) {
      const collision: ICollision = {
        v_rest:
          !itr.arest && itr.vrest ? itr.vrest + this.vrest_offset : void 0,
        victim,
        attacker,
        itr,
        bdy,
        aframe,
        bframe,
        a_cube,
        b_cube,
      };
      if (
        bdy.tester?.run(collision) === false ||
        itr.tester?.run(collision) === false
      )
        return;

      const a = attacker.state?.before_collision?.(collision);
      const b = victim.state?.before_be_collided?.(collision);

      switch (a) {
        case WhatNext.SkipAll:
          break;
        case WhatNext.OnlyState: {
          attacker.state?.on_collision?.(collision);
          break;
        }
        case WhatNext.OnlyEntity: {
          attacker.on_collision(collision);
          break;
        }
        case WhatNext.Continue:
        default: {
          attacker.on_collision(collision);
          attacker.state?.on_collision?.(collision);
          break;
        }
      }
      switch (b) {
        case WhatNext.SkipAll:
          break;
        case WhatNext.OnlyState: {
          victim.state?.on_be_collided?.(collision);
          break;
        }
        case WhatNext.OnlyEntity: {
          victim.on_be_collided(collision);
          break;
        }
        case WhatNext.Continue:
        default: {
          victim.on_be_collided(collision);
          victim.state?.on_be_collided?.(collision);
          break;
        }
      }
    }
  }

  init_spark_data() {
    this._spark_data = this.lf2.datas.find(Defines.BuiltIn_Dats.Spark);
    this._spark_creator = this._spark_data ? Factory.inst.get_entity_creator(this._spark_data.type) : void 0;
  }

  /**
   * 火花特效
   *
   * @param {number} x x坐标
   * @param {number} y y坐标
   * @param {number} z z坐标
   * @param {string} f 帧ID
   * @return {void}
   * @memberof World
   */
  spark(x: number, y: number, z: number, f: string): void {
    if (!this._spark_data)
      this.init_spark_data();
    if (!this._spark_data) {
      Warn.print(
        World.TAG + "::spark",
        `data of "${Defines.BuiltIn_Dats.Spark}" not found!`,
      );
      return;
    }
    if (!this._spark_creator) {
      Warn.print(World.TAG + "::spark", `creator of "${this._spark_data.type}" not found!`);
      return;
    }
    const e = this._spark_creator(this, this._spark_data);
    e.position.set(Math.round(x), Math.round(y), Math.round(z));
    e.enter_frame({ id: f });
    e.attach();
  }

  get_bounding(e: Entity, f: IFrameInfo, i: IItrInfo | IBdyInfo): IBounding {
    const left =
      e.facing > 0
        ? e.position.x - f.centerx + i.x
        : e.position.x + f.centerx - i.x - i.w;
    const top = e.position.y + f.centery - i.y;
    const far = e.position.z + i.z;
    return {
      left,
      right: left + i.w,
      top,
      bottom: top - i.h,
      far,
      near: far + i.l,
    };
  }

  private _ideally_dt: number = Math.floor(1000 / 60);
  private _playrate: number = 1;

  get playrate() {
    return this._playrate;
  }
  set playrate(v: number) {
    if (v <= 0) throw new Error("playrate must be larger than 0");
    if (v === this._playrate) return;
    this._playrate = v;
    this._ideally_dt = Math.floor(1000 / 60) / this._playrate;
    this.start_update();
  }

  private _paused = false;
  get paused() { return this._paused; }
  set paused(v: boolean) { this.set_paused(v); }

  set_paused(v: boolean) {
    if (this._paused === v) return;
    this._paused = v;
    this._callbacks.emit("on_pause_change")(v);
  }

  private _indicator_flags: number = 0;
  get indicator_flags() {
    return this._indicator_flags;
  }
  set indicator_flags(v: number) {
    if (this._indicator_flags === v) return;
    this._indicator_flags = v;
    for (const [, [, , , r4]] of this.entity_renderer_packs) {
      r4.flags = v;
    }
  }

  dispose() {
    this._callbacks.emit("on_disposed")();
    this.stop_update();
    this.stop_render();
    this.del_entities(Array.from(this.entities));
    this.scene.dispose();
    this.bg_render.release();
  }
}
