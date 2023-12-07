import { _decorator, Component, director, EditBox, EventTouch, input, Input, Node, UITransform, Vec2 } from 'cc';
import { NetworkManager } from '../Global/NetworkManager';
import { ApiMsgEnum } from '../Common';
import DataManager from '../Global/DataManager';
import { SceneEnum } from '../Enum';
const { ccclass, property } = _decorator;

@ccclass('LoginManager')
export class LoginManager extends Component {

    input: EditBox;


    onLoad() {
        this.input = this.node.getComponentInChildren(EditBox)!;
        director.preloadScene(SceneEnum.Battle);
    }

    async start() {
        await NetworkManager.Instance.connect()
    }

    async handleClick() {
        if (!NetworkManager.Instance.isConnect) {
            console.log("未连接服务器");
            NetworkManager.Instance.connect();
            return;
        }

        const nickname = this.input.string;
        if (!nickname) {
            console.log("请输入昵称");
            return;
        }


        const { success, error, res } = await NetworkManager.Instance.callApi(ApiMsgEnum.ApiPlayerJoin, {
            nickname
        })
        if (!success) {
            console.log(error);
            return;
        }
        DataManager.Instance.myPlayerId = res.player.id
        console.log("res! : ", res);
        director.loadScene(SceneEnum.Battle);
    }

}