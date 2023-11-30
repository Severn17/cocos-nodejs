import { _decorator, Component, EventTouch, input, Input, instantiate, Node, UITransform, Vec2 } from 'cc';
import DataManager from '../../Global/DataManager';
import { EntityTypeEnum, IActor, IBullet, InputTypeEnum } from '../../Common';
import { EntityManager } from '../../Base/EntityManager';
import { BulletStateMachine } from './BulletStateMachine';
import { EntityStateEnum } from '../../Enum';
import { WeaponManager } from '../Weapon/WeaponManager';
import { rad2Angle } from '../../Utils';
const { ccclass, property } = _decorator;

@ccclass('BulletManager')
export class BulletManager extends EntityManager {
    type: EntityTypeEnum;
    init(data: IBullet) {
        
        this.type = data.type
        this.fsm = this.addComponent(BulletStateMachine);
        this.fsm.init(data.type);

        this.state = EntityStateEnum.Idle;
    }

    render(data: IBullet) {
        const { direction, position } = data;
        this.node.setPosition(position.x, position.y);

        const side = Math.sqrt(direction.x ** 2 + direction.y **2);
        const angle = direction.x > 0 ? rad2Angle(Math.asin(direction.y / side)) : rad2Angle(Math.asin(-direction.y / side)) + 180;
        this.node.setRotationFromEuler(0,0,angle);
    }
}


