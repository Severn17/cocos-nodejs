import { _decorator, Component, director, EditBox, EventTouch, input, Input, instantiate, Node, Prefab, UITransform, Vec2 } from 'cc';
import { NetworkManager } from '../Global/NetworkManager';
import { ApiMsgEnum, IApiPlayerListRes, IApiRoomListRes, IMsgRoom } from '../Common';
import DataManager from '../Global/DataManager';
import { SceneEnum } from '../Enum';
import { PlayerManager } from '../UI/PlayerManager';
const { ccclass, property } = _decorator;

@ccclass('RoomManager')
export class RoomManager extends Component {
    @property(Node)
    playerContainer: Node;

    @property(Prefab)
    playerPrefab: Prefab;

    onLoad() {
        NetworkManager.Instance.listenMsg(ApiMsgEnum.MsgRoom, this.renderPlayer, this)
    }

    start() {
        this.renderPlayer({
            room: DataManager.Instance.roomInfo
        })
    }

    onDestroy() {
        NetworkManager.Instance.unListenMsg(ApiMsgEnum.MsgRoom, this.renderPlayer, this)
    }


    renderPlayer({ room: { players: list } }: IMsgRoom) {
        for (const c of this.playerContainer.children) {
            c.active = false;
        }
        while (this.playerContainer.children.length < list.length) {
            const player = instantiate(this.playerPrefab);
            player.active = false;
            this.playerContainer.addChild(player);
        }

        for (let i = 0; i < list.length; i++) {
            const data = list[i];
            const node = this.playerContainer.children[i];
            node.getComponent(PlayerManager).init(data);
        }
    }


    async handleLeaveRoom() {
        const { success, error, res } = await NetworkManager.Instance.callApi(ApiMsgEnum.ApiRoomLeave, {})
        if (!success) {
            console.log(error);
            return;
        }
        DataManager.Instance.roomInfo = null;
        director.loadScene(SceneEnum.Hall);
    }

}