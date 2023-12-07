import { _decorator, Component, EventTouch, input, Input, instantiate, Node, Prefab, SpriteFrame, UITransform, Vec2 } from 'cc';
import DataManager from '../Global/DataManager';
import { JoyStickManager } from '../UI/JoyStickManager';
import { ResourceManager } from '../Global/ResourceManager';
import { ActorManager } from '../Entitly/Actor/ActorManager';
import { EventEnum, PrefabPathEnum as PrefabPathEnum, TexturePathEnum } from '../Enum';
import { ApiMsgEnum, EntityTypeEnum, IClientInput, InputTypeEnum } from '../Common';
import { BulletManager } from '../Entitly/Bullet/BulletManager';
import { ObjectPoolManager } from '../Global/ObjectPoolManager';
import { NetworkManager } from '../Global/NetworkManager';
import EventManager from '../Global/EventManager';
const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {
    private stage: Node;
    private ui: Node;

    private shouldUpdate = false;

    onLoad() {

    }

    async start() {
        this.clearGame();
        await Promise.all([this.connectServer(), this.loadRes()])
        // this.initGame();
    }

    initGame() {
        DataManager.Instance.jm = this.ui.getComponentInChildren(JoyStickManager)!;
        this.initMap();
        this.shouldUpdate = true;
        EventManager.Instance.on(EventEnum.ClientSync, this.handleClientSync, this);
        NetworkManager.Instance.listenMsg(ApiMsgEnum.MsgServerSync, this.handleServerSync, this)
    }

    clearGame() {
        this.stage = this.node.getChildByName("Stage");
        this.ui = this.node.getChildByName("UI");
        this.stage.destroyAllChildren();
        DataManager.Instance.stage = this.stage;
        EventManager.Instance.off(EventEnum.ClientSync, this.handleClientSync, this);
        NetworkManager.Instance.unListenMsg(ApiMsgEnum.MsgServerSync, this.handleServerSync, this)
    }


    async connectServer() {
        if (!await NetworkManager.Instance.connect().catch((e) => false)) {
            await new Promise(rs => setTimeout(rs, 1000));
            await this.connectServer();
        }
    }

    initMap() {
        const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Map);
        const map = instantiate(prefab);
        this.stage.addChild(map);
    }
    async loadRes() {
        const list = [];
        for (const type in PrefabPathEnum) {
            const p = ResourceManager.Instance.loadRes(PrefabPathEnum[type], Prefab).then((res) => {
                DataManager.Instance.prefabMap.set(type, res);
            });
            list.push(p);
        }
        for (const type in TexturePathEnum) {
            const p = ResourceManager.Instance.loadDir(TexturePathEnum[type], SpriteFrame).then((textureFrames) => {
                DataManager.Instance.textureMap.set(type, textureFrames);
            });
            list.push(p);
        }
        await Promise.all(list);
    }

    update(dt) {
        if (!this.shouldUpdate) {
            return;
        }
        this.render();
        this.tick(dt);
    }

    tick(dt) {
        this.tickActor(dt);
        DataManager.Instance.applyInput({
            type: InputTypeEnum.TimePast,
            dt,
        })
    }

    tickActor(dt) {
        for (const data of DataManager.Instance.state.actors) {
            const { id } = data;
            let am = DataManager.Instance.actorMap.get(id)
            am.tick(dt);
        }
    }

    render() {
        this.renderActor();
        this.renderBullet();
    }

    async renderActor() {
        for (const data of DataManager.Instance.state.actors) {
            const { id, type } = data;
            let am = DataManager.Instance.actorMap.get(id)
            if (!am) {
                const prefab = DataManager.Instance.prefabMap.get(type);
                const actor = instantiate(prefab);
                this.stage.addChild(actor);
                am = actor.addComponent(ActorManager);
                DataManager.Instance.actorMap.set(id, am);
                am.init(data);
            }
            else {
                am.render(data);
            }
        }
    }
    renderBullet() {
        for (const data of DataManager.Instance.state.bullets) {
            const { id, type } = data;
            let bm = DataManager.Instance.bulletMap.get(id)
            if (!bm) {
                const bullet = ObjectPoolManager.Instance.get(type);
                bm = bullet.getComponent(BulletManager) || bullet.addComponent(BulletManager);
                DataManager.Instance.bulletMap.set(id, bm);
                bm.init(data);
            }
            else {
                bm.render(data);
            }
        }
    }


    handleClientSync(input: IClientInput) {
        const msg = {
            input,
            frameId: DataManager.Instance.frameId++,
        }
        NetworkManager.Instance.sendMsg(ApiMsgEnum.MsgClientSync, msg)
    }

    handleServerSync({ inputs }: any) {
        for (let input of inputs) {
            DataManager.Instance.applyInput(input);
        }
    }

}


