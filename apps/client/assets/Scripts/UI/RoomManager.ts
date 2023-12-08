import { _decorator, Component, EventTouch, input, Input, Node, UITransform, Vec2 ,Label } from 'cc';
import EventManager from '../Global/EventManager';
import { EventEnum } from '../Enum';
import { IPlayer, IRoom } from '../Common';
const { ccclass, property } = _decorator;

@ccclass('RoomManager')
export class RoomManager extends Component {
    id: number;
    init({ id, players }: IRoom) {
        this.id = id;
        const label = this.node.getComponent(Label)!;
        label.string = `房间${id}`;
        this.node.active =true;
    }

    handlerClick() {
        EventManager.Instance.emit(EventEnum.RoomJoin, this.id);
    }
}


