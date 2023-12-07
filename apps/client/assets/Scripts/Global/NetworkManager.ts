import { _decorator, resources, Asset, error } from "cc";
import Singleton from "../Base/Singleton";

interface IItem {
    cb: Function;
    ctx: unknown;
}

interface ICallApiRet{
    success:boolean;
    res?:any;
    error?:Error
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

    callApi(name: string, data):Promise<ICallApiRet> {
        return new Promise((resolve, reject) => {
            try {
                const timer = setTimeout(() => {
                    resolve({ success: false, error: new Error("timeout") });
                    this.unListenMsg(name, cb, null);
                }, 5000);

                const cb = (res) => {
                    resolve(res);
                    clearTimeout(timer);
                    this.unListenMsg(name, cb, null);
                }
                this.listenMsg(name, cb, null);
                this.sendMsg(name, data)
            } catch (error) {
                resolve({ success: false, error: new Error("timeout") });
            }
        });
    }

    sendMsg(name: string, data) {
        const msg = {
            name,
            data,
        }
        this.ws.send(JSON.stringify(msg));
    }

    listenMsg(name: string, cb: Function, ctx: unknown) {
        if (this.map.has(name)) {
            this.map.get(name).push({ cb, ctx });
        } else {
            this.map.set(name, [{ cb, ctx }]);
        }
    }

    unListenMsg(name: string, cb: Function, ctx: unknown) {
        if (this.map.has(name)) {
            const index = this.map.get(name).findIndex((i) => cb === i.cb && i.ctx === ctx);
            index > -1 && this.map.get(name).splice(index, 1);
        }
    }

}
