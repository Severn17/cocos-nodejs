import { _decorator, resources, Asset, error } from "cc";
import Singleton from "../Base/Singleton";
import { IModel } from "../Common";

interface IItem {
    cb: Function;
    ctx: unknown;
}

interface ICallApiRet<T> {
    success: boolean;
    res?: T;
    error?: Error
}

export class NetworkManager extends Singleton {
    static get Instance() {
        return super.GetInstance<NetworkManager>();
    }

    isConnect: boolean = false;
    port = 9876;
    ws: WebSocket;
    private map: Map<string, Array<IItem>> = new Map();

    connect() {

        return new Promise((resolve, reject) => {
            if (this.isConnect) {
                resolve(true);
                return;
            }
            this.ws = new WebSocket(`ws://localhost:${9876}/`);
            this.ws.onopen = () => {
                this.isConnect = true;
                resolve(true);
            };
            this.ws.onclose = () => {
                this.isConnect = false;
                reject(false);
            };
            this.ws.onerror = (e) => {
                this.isConnect = false;
                console.log(e);
                reject(false);
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
                    else {
                        console.log("no listener", name);
                    }
                } catch (error) {
                    console.log(error);
                }
            };
        });

    }

    callApi<T extends keyof IModel['api']>(name: T, data: IModel['api'][T]["req"]): Promise<ICallApiRet<IModel['api'][T]["res"]>> {
        return new Promise((resolve, reject) => {
            try {
                const timer = setTimeout(() => {
                    resolve({ success: false, error: new Error("timeout") });
                    this.unListenMsg(name as any, cb, null);
                }, 5000);

                const cb = (res) => {
                    resolve(res);
                    clearTimeout(timer);
                    this.unListenMsg(name as any, cb, null);
                }
                this.listenMsg(name as any, cb, null);
                this.sendMsg(name as any, data)
            } catch (error) {
                resolve({ success: false, error: new Error("timeout") });
            }
        });
    }

    sendMsg<T extends keyof IModel['msg']>(name: T, data: IModel['msg'][T]) {
        const msg = {
            name,
            data,
        }
        this.ws.send(JSON.stringify(msg));
    }

    listenMsg<T extends keyof IModel['msg']>(name: T, cb: (args: IModel['msg'][T]) => void, ctx: unknown) {
        if (this.map.has(name)) {
            this.map.get(name).push({ cb, ctx });
        } else {
            this.map.set(name, [{ cb, ctx }]);
        }
    }

    unListenMsg<T extends keyof IModel['msg']>(name: T, cb: (args: IModel['msg'][T]) => void, ctx: unknown) {
        if (this.map.has(name)) {
            const index = this.map.get(name).findIndex((i) => cb === i.cb && i.ctx === ctx);
            index > -1 && this.map.get(name).splice(index, 1);
        }
    }

}
