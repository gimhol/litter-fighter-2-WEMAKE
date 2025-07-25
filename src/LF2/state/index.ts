import { StateEnum } from "../defines/StateEnum";
import { Entity } from "../entity/Entity";
import BallState_Base from "./BallState_Base";
import CharacterState_Base from "./CharacterState_Base";
import { CharacterState_Caught } from "./CharacterState_Caught";
import CharacterState_Dash from "./CharacterState_Dash";
import { CharacterState_Drink } from "./CharacterState_Drink";
import CharacterState_Falling from "./CharacterState_Falling";
import CharacterState_Frozen from "./CharacterState_Frozen";
import CharacterState_Jump from "./CharacterState_Jump";
import CharacterState_Lying from "./CharacterState_Lying";
import { CharacterState_Rowing } from "./CharacterState_Rowing";
import CharacterState_Running from "./CharacterState_Running";
import CharacterState_Standing from "./CharacterState_Standing";
import CharacterState_Teleport2FarthestAlly from "./CharacterState_Teleport2FarthestAlly";
import CharacterState_Teleport2NearestEnemy from "./CharacterState_Teleport2NearestEnemy";
import { CharacterState_TransformToLouisEX } from "./CharacterState_Transform2LouisEX";
import { CharacterState_Walking } from "./CharacterState_Walking";
import { State_15 } from "./State_15";
import State_Base from "./State_Base";
import { State_Burning } from "./State_Burning";
import State_TransformTo8XXX from "./State_TransformTo8XXX";
import { State_TransformToCatching } from "./State_TransformToCatching";
import { State_WeaponBroken } from "./State_WeaponBroken";
import { States } from "./States";
import WeaponState_Base from "./WeaponState_Base";
import WeaponState_InTheSky from "./WeaponState_InTheSky";
import WeaponState_OnGround from "./WeaponState_OnGround";
import WeaponState_OnHand from "./WeaponState_OnHand";
import WeaponState_Throwing from "./WeaponState_Throwing";
export * from "./States";
export const ENTITY_STATES = new States();
ENTITY_STATES.set_in_range(
  StateEnum.TransformTo_Min,
  StateEnum.TransformTo_Max,
  () => new State_TransformTo8XXX(),
);
ENTITY_STATES.add(new State_WeaponBroken(), new State_TransformToCatching());
ENTITY_STATES.set(StateEnum.Weapon_Rebounding, new WeaponState_Base());
ENTITY_STATES.set(StateEnum.Weapon_InTheSky, new WeaponState_InTheSky());
ENTITY_STATES.set(StateEnum.Weapon_OnGround, new WeaponState_OnGround());
ENTITY_STATES.set(StateEnum.Weapon_OnHand, new WeaponState_OnHand());
ENTITY_STATES.set(StateEnum.Weapon_Throwing, new WeaponState_Throwing());
ENTITY_STATES.set(
  StateEnum.HeavyWeapon_InTheSky,
  new WeaponState_InTheSky(),
);
ENTITY_STATES.set(
  StateEnum.HeavyWeapon_OnGround,
  new WeaponState_OnGround(),
);
ENTITY_STATES.set(StateEnum.HeavyWeapon_OnHand, new WeaponState_OnHand());
ENTITY_STATES.set(
  StateEnum.HeavyWeapon_Throwing,
  new WeaponState_Throwing(),
);
ENTITY_STATES.set(StateEnum._Entity_Base, new State_Base());

ENTITY_STATES.set_all_of(
  [
    StateEnum._Ball_Base,
    StateEnum.Ball_3005,
    StateEnum.Ball_3006,
    StateEnum.Ball_Disappear,
    StateEnum.Ball_Flying,
    StateEnum.Ball_Hit,
    StateEnum.Ball_Hitting,
  ],
  () => new BallState_Base(),
);

ENTITY_STATES.set(StateEnum._Weapon_Base, new WeaponState_Base());
ENTITY_STATES.set(StateEnum._Character_Base, new CharacterState_Base());
ENTITY_STATES.set(StateEnum.Standing, new CharacterState_Standing());
ENTITY_STATES.set(StateEnum.Walking, new CharacterState_Walking());
ENTITY_STATES.set(StateEnum.Running, new CharacterState_Running());
ENTITY_STATES.set(StateEnum.Jump, new CharacterState_Jump());
ENTITY_STATES.set(StateEnum.Dash, new CharacterState_Dash());
ENTITY_STATES.set(StateEnum.Falling, new CharacterState_Falling());
ENTITY_STATES.set(StateEnum.Burning, new State_Burning());
ENTITY_STATES.set(StateEnum.Frozen, new CharacterState_Frozen());
ENTITY_STATES.set(StateEnum.Lying, new CharacterState_Lying());
ENTITY_STATES.set(StateEnum.Caught, new CharacterState_Caught());
ENTITY_STATES.set(StateEnum.Z_Moveable, new CharacterState_Base());
ENTITY_STATES.set(
  StateEnum.NextAsLanding,
  new (class extends CharacterState_Base {
    override on_landing(e: Entity): void {
      e.enter_frame(e.frame.next);
    }
  })(),
);

ENTITY_STATES.set(
  StateEnum.TeleportToNearestEnemy,
  new CharacterState_Teleport2NearestEnemy(),
);
ENTITY_STATES.set(
  StateEnum.TeleportToFarthestAlly,
  new CharacterState_Teleport2FarthestAlly(),
);
ENTITY_STATES.set(
  StateEnum.TransformToLouisEx,
  new CharacterState_TransformToLouisEX(),
);
ENTITY_STATES.set(StateEnum.Rowing, new CharacterState_Rowing());
ENTITY_STATES.set(StateEnum.Drink, new CharacterState_Drink());
ENTITY_STATES.set(StateEnum.Normal, new State_15());

ENTITY_STATES.set(
  StateEnum.Injured,
  new (class extends CharacterState_Base {
    override on_landing(e: Entity): void {}
  })(),
);
