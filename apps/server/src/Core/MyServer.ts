import { WebSocketServer, WebSocket } from "ws";
import { Connection } from "./Connection";
import { ApiMsgEnum } from "../Common";

export class MyServer {
    port: number;
    wss: WebSocketServer;

    apiMap: Map<ApiMsgEnum, Function> = new Map();
    connections: Set<Connection> = new Set();

    constructor({ port }: { port: number }) {
        this.port = port;
    }

    start() {
        return new Promise((resolve, reject) => {
            this.wss = new WebSocketServer(
                {
                    port: this.port,
                }
            );
            this.wss.on('listening', function () {
                resolve(true);
            });
            this.wss.on('close', function () {
                reject(false);
            });
            this.wss.on('error', function (e) {
                reject(e);
            });
            this.wss.on('connection', (ws: WebSocket) => {
                const connection = new Connection(this, ws);
                this.connections.add(connection);
                console.log('connection add: ', this.connections.size);


                connection.on('close', () => {
                    this.connections.delete(connection);
                    console.log('connection delete: ', this.connections.size);
                });
            });
        });
    }

    setApi(name:ApiMsgEnum, cb:Function) {
        this.apiMap.set(name, cb);
    }

}