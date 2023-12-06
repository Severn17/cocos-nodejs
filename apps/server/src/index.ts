import { symlinkCommon } from "./Utils";
import { WebSocketServer } from "ws";


symlinkCommon();

const wss = new WebSocketServer(
    {
        port: 9876,
    }
);

wss.on('connection', function connection(socket) {
    socket.on('message', (buffer) => {
        console.log(buffer.toString());
    });
    socket.send("hello wo shi server");
});

wss.on('listening', function () {
    console.log('服務啟動!');
});