import { _decorator, Component, director, EditBox, EventTouch, input, Input, instantiate, Node, Prefab, UITransform, Vec2 } from 'cc';
import { NetworkManager } from '../Global/NetworkManager';
import { ApiMsgEnum, IApiPlayerListRes, IApiRoomListRes } from '../Common';
import DataManager from '../Global/DataManager';
import { EventEnum, SceneEnum } from '../Enum';
import { PlayerManager } from '../UI/PlayerManager';
import { RoomManager } from '../UI/RoomManager';
import EventManager from '../Global/EventManager';
const { ccclass, property } = _decorator;

@ccclass('HallManager')
export class HallManager extends Component {
    @property(Node)
    playerContainer: Node;

    @property(Prefab)
    playerPrefab: Prefab;

    @property(Node)
    roomContainer: Node;

    @property(Prefab)
    roomPrefab: Prefab;

    onLoad(){
        EventManager.Instance.on(EventEnum.RoomJoin, this.handleJoinRoom, this);
        NetworkManager.Instance.listenMsg(ApiMsgEnum.MsgPlayerList, this.renderPlayer, this)
        NetworkManager.Instance.listenMsg(ApiMsgEnum.MsgRoomList, this.renderRoom, this)
        console.log("hall onload")
    }

    start() {
        
        this.playerContainer.destroyAllChildren();
        this.roomContainer.destroyAllChildren();
        this.getPlayers();
        this.getRooms();
    }

    onDestroy() {
        console.log("hall onDestroy")
        EventManager.Instance.off(EventEnum.RoomJoin, this.handleJoinRoom, this);
        NetworkManager.Instance.unListenMsg(ApiMsgEnum.MsgPlayerList, this.renderPlayer, this)
        NetworkManager.Instance.unListenMsg(ApiMsgEnum.MsgRoomList, this.renderRoom, this)
    }

    async getPlayers() {
        const { success, error, res } = await NetworkManager.Instance.callApi(ApiMsgEnum.ApiPlayerList, {})
        if (!success) {
            console.log(error);
            return;
        }
        this.renderPlayer(res);
    }

    renderPlayer({ list }: IApiPlayerListRes) {

        console.log("renderPlayer", list);

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

    async getRooms() {
        const { success, error, res } = await NetworkManager.Instance.callApi(ApiMsgEnum.ApiRoomList, {})
        if (!success) {
            console.log(error);
            return;
        }
        this.renderRoom(res);
    }

    renderRoom({ list }: IApiRoomListRes) {
        for (const c of this.roomContainer.children) {
            c.active = false;
        }
        while (this.roomContainer.children.length < list.length) {
            const room = instantiate(this.roomPrefab);
            room.active = false;
            this.roomContainer.addChild(room);
        }

        for (let i = 0; i < list.length; i++) {
            const data = list[i];
            const node = this.roomContainer.children[i];
            node.getComponent(RoomManager).init(data);
        }
    }


    async handleCreateRoom() {
        const { success, error, res } = await NetworkManager.Instance.callApi(ApiMsgEnum.ApiRoomCreate, {})
        if (!success) {
            console.log(error);
            return;
        }
        DataManager.Instance.roomInfo = res.room;
        director.loadScene(SceneEnum.Room);
        console.log("create room success " ,res.room);
    }

    async handleJoinRoom(rid: number) {
        const { success, error, res } = await NetworkManager.Instance.callApi(ApiMsgEnum.ApiRoomJoin, {
            rid
        })
        if (!success) {
            console.log(error);
            return;
        }
        DataManager.Instance.roomInfo = res.room;
        director.loadScene(SceneEnum.Room);
        console.log("create room success " ,res.room);
    }

}