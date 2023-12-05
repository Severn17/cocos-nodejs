import { _decorator, Component, EventTouch, input, Input, instantiate, IVec2, Node, UITransform, Vec2 } from 'cc';
import { EntityTypeEnum, IActor, IBullet, InputTypeEnum } from '../../Common';
import { EntityManager } from '../../Base/EntityManager';
import { BulletStateMachine } from './BulletStateMachine';
import { EntityStateEnum, EventEnum } from '../../Enum';
import { rad2Angle } from '../../Utils';
import EventManager from '../../Global/EventManager';
import DataManager from '../../Global/DataManager';
import { ExplosionManager } from '../Explosion/ExplosionManager';
const { ccclass, property } = _decorator;

@ccclass('BulletManager')
export class BulletManager extends EntityManager {
    type: EntityTypeEnum;
    id: number;
    init(data: IBullet) {
        
        this.type = data.type
        this.id = data.id
        this.fsm = this.addComponent(BulletStateMachine);
        this.fsm.init(data.type);

        this.state = EntityStateEnum.Idle;
        this.node.active = false;
        EventManager.Instance.on(EventEnum.ExplosionBorn,this.handleExplosionBorn,this);
    }
    handleExplosionBorn(id: number, {x,y}: IVec2) {
        if (id !== this.id) {
            return
        }

        const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Explosion)
        const explosion = instantiate(prefab);
        explosion.setParent(DataManager.Instance.stage);
        explosion.addComponent(ExplosionManager).init(EntityTypeEnum.Explosion, {x,y});
        
        EventManager.Instance.off(EventEnum.ExplosionBorn,this.handleExplosionBorn,this);
        DataManager.Instance.bulletMap.delete(this.id);
        this.node.destroy();
    }

    render(data: IBullet) {
        this.node.active = true;
        const { direction, position } = data;
        this.node.setPosition(position.x, position.y);

        const side = Math.sqrt(direction.x ** 2 + direction.y **2);
        const angle = direction.x > 0 ? rad2Angle(Math.asin(direction.y / side)) : rad2Angle(Math.asin(-direction.y / side)) + 180;
        this.node.setRotationFromEuler(0,0,angle);
    }
}


