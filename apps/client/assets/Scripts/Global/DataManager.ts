import { Node, Prefab, SpriteFrame } from "cc";
import Singleton from "../Base/Singleton";
import { EntityTypeEnum, IActorMove, IClientInput, IState, InputTypeEnum } from "../Common";
import { ActorManager } from "../Entitly/Actor/ActorManager";
import { JoyStickManager } from "../UI/JoyStickManager";
import { BulletManager } from "../Entitly/Bullet/BulletManager";

const ACTOR_SPEED = 100;

export default class DataManager extends Singleton {
  static DataManager: any;
  static get Instance() {
    return super.GetInstance<DataManager>();
  }

  stage: Node;
  jm: JoyStickManager;
  actorMap: Map<number, ActorManager> = new Map();
  bulletMap: Map<number, BulletManager> = new Map();
  prefabMap: Map<string, Prefab> = new Map();
  textureMap: Map<string, SpriteFrame[]> = new Map();

  state: IState = {
    actors: [
      {
        id: 1,
        type: EntityTypeEnum.Actor1,
        weaponType: EntityTypeEnum.Weapon1,
        bulletType: EntityTypeEnum.Bullet2,
        position: {
          x: 0,
          y: 0,
        },
        direction: {
          x: 1,
          y: 0,
        },
      }
    ],
    bullets: [],
    nextBulletId : 1,
  }

  applyInput(input: IClientInput) {

    switch (input.type) {
      case InputTypeEnum.ActorMove:
        const {
          id,
          dt,
          direction: { x, y },
        } = input;
        const actor = this.state.actors.find(e => e.id === id)
        actor.direction.x = x;
        actor.direction.y = y;
        actor.position.x += x * dt * ACTOR_SPEED;
        actor.position.y += y * dt * ACTOR_SPEED;
        break;
      case InputTypeEnum.WeaponShoot:
        const { owner, position, direction, } = input;
        const bullet = {
          id: this.state.nextBulletId++,
          owner,
          position,
          direction,
          type: this.actorMap.get(owner)!.bulletType,
        }
        this.state.bullets.push(bullet);
        break;
    }
  }
}

