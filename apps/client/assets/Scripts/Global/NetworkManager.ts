import { _decorator, resources, Asset } from "cc";
import Singleton from "../Base/Singleton";

interface IItem {
    cb: Function;
    ctx: unknown;
}

export class NetworkManager extends Singleton {
    static get Instance() {
        return super.GetInstance<NetworkManager>();
    }

    port = 9876;
    ws: WebSocket;
    private map: Map<string, Array<IItem>> = new Map();

    connect() {

        return new Promise((resolve, reject) => {
            this.ws = new WebSocket(`ws://localhost:${9876}/`);
            this.ws.onopen = () => {
                resolve(true);
            };
            this.ws.onclose = () => {
                resolve(false);
            };
            this.ws.onerror = (e) => {
                console.log(e);
                resolve(false);
            };
            this.ws.onmessage = (e) => {
                console.log("onmessage", e.data);
                try {
                    const json = JSON.parse(e.data);
                    const { name, data } = json;
                    if (this.map.has(name)) {
                        this.map.get(name).forEach(({ cb, ctx }) => {
                            cb.call(ctx, data);
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            };
        });

    }

    sendMsg(data) {
        this.ws.send(data);
    }

    listenMsg(name: string, cb: Function, ctx: unknown) {
        if (this.map.has(name)) {
            this.map.get(name).push({ cb, ctx });
        } else {
            this.map.set(name, [{ cb, ctx }]);
        }
    }
}
