import { ApiMsgEnum } from "./Common";
import { MyServer, Connection } from "./Core";
import { symlinkCommon } from "./Utils";


symlinkCommon();

const server = new MyServer({ port: 9876 });

server.setApi(ApiMsgEnum.ApiPlayerJoin, (connection: Connection, data: any) => {
    return data + '我是服务器端'
});

server.start()
    .then(() => {
        console.log('服務啟動成功!');
    })
    .catch(() => {
        console.log('服務啟動失敗!');
    });


// const wss = new WebSocketServer(
//     {
//         port: 9876,
//     }
// );

// let inputs = []

// wss.on('connection', function connection(socket) {
//     socket.on('message', (buffer) => {

//         const str = buffer.toString();
//         try {
//             const msg = JSON.parse(str);
//             const { name, data } = msg;
//             const { frameId, input } = data;
//             inputs.push(input);
//         } catch (error) {
//             console.log(error);
//         }
//         console.log(buffer.toString());
//     });

//     setInterval(() => {
//         const temp = inputs
//         inputs = [];
//         const msg = {
//             name: ApiMsgEnum.MsgServerSync,
//             data: {
//                 inputs: temp
//             }
//         }
//         socket.send(JSON.stringify(msg));
//     }, 100)

// });


// wss.on('listening', function () {
//     console.log('服務啟動!');
// });