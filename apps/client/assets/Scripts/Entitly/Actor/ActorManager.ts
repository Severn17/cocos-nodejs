import { _decorator, Component, EventTouch, input, Input, instantiate, Node, ProgressBar, UITransform, Vec2 } from 'cc';
import DataManager from '../../Global/DataManager';
import { EntityTypeEnum, IActor, InputTypeEnum } from '../../Common';
import { EntityManager } from '../../Base/EntityManager';
import { ActorStateMachine } from './ActorStateMachine';
import { EntityStateEnum, EventEnum } from '../../Enum';
import { WeaponManager } from '../Weapon/WeaponManager';
import { rad2Angle } from '../../Utils';
import EventManager from '../../Global/EventManager';
const { ccclass, property } = _decorator;

@ccclass('ActorManager')
export class ActorManager extends EntityManager {
    bulletType: EntityTypeEnum;
    private wm: WeaponManager;
    id: number;
    hp:ProgressBar;

    init(data: IActor) {
        this.hp = this.node.getComponentInChildren(ProgressBar);
        this.id = data.id;
        this.bulletType = data.bulletType
        this.fsm = this.addComponent(ActorStateMachine);
        this.fsm.init(data.type);

        this.state = EntityStateEnum.Idle;

        const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Weapon1);
        const weapon = instantiate(prefab);
        this.node.addChild(weapon);
        this.wm = weapon.addComponent(WeaponManager);
        this.wm.init(data);
    }

    tick(dt) {
        if(this.id != DataManager.Instance.myPlayerId){
            return;
        }
        if (DataManager.Instance.jm.input.length()) {
            const { x, y } = DataManager.Instance.jm.input;
            EventManager.Instance.emit(EventEnum.ClientSync,{
                id: 1,
                type: InputTypeEnum.ActorMove,
                direction: {
                    x,
                    y,
                },
                dt,
            })

            this.state = EntityStateEnum.Run;
        }
        else {
            this.state = EntityStateEnum.Idle;
        }
    }

    render(data: IActor) {
        const { direction, position } = data;
        this.node.setPosition(position.x, position.y);

        if (direction.x !== 0) {
            this.node.setScale(direction.x > 0 ? 1 : -1, 1);
            this.hp.node.setScale(direction.x > 0 ? 1 : -1, 1);
        }

        const side = Math.sqrt(direction.x ** 2 + direction.y **2);
        const rad = Math.asin(direction.y / side);
        const angle = rad2Angle(rad)
        this.wm.node.setRotationFromEuler(0,0,angle);
        this.hp.progress = data.hp / this.hp.totalLength;
    }
}


