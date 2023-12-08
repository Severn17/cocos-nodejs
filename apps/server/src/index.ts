import { PlayerManager } from "./Biz/PlayerManager";
import { RoomManager } from "./Biz/RoomManager";
import { ApiMsgEnum, IApiPlayerJoinReq, IApiPlayerJoinRes, IApiPlayerListReq, IApiPlayerListRes, IApiRoomCreateReq, IApiRoomCreateRes, IApiRoomJoinReq, IApiRoomJoinRes, IApiRoomLeaveReq, IApiRoomLeaveRes, IApiRoomListReq, IApiRoomListRes, IApiStartGameReq, IApiStartGameRes, IMsgServerSync } from "./Common";
import { MyServer, Connection } from "./Core";
import { symlinkCommon } from "./Utils";


symlinkCommon();

declare module "./Core" {
    interface Connection {
        playerId: number;
    }
}

const server = new MyServer({ port: 9876 });


server.on('connection', (connection: Connection) => {
    console.log('connection add: ', server.connections.size);
});

server.on('disconnection', (connection: Connection) => {
    if (connection.playerId) {
        PlayerManager.Instance.removePlayer(connection.playerId);
    }
    PlayerManager.Instance.snycPlayers();
    console.log("PlayerManager.Instance.players.size : ", PlayerManager.Instance.players.size);
});

server.setApi(ApiMsgEnum.ApiPlayerJoin, (connection: Connection, data: IApiPlayerJoinReq): IApiPlayerJoinRes => {
    const { nickname } = data;
    const player = PlayerManager.Instance.createPlayer({
        nickname,
        connection
    });
    connection.playerId = player.id;
    PlayerManager.Instance.snycPlayers();
    return {
        player: PlayerManager.Instance.getPlayerView(player),
    };
});

server.setApi(ApiMsgEnum.ApiPlayerList, (connection: Connection, data: IApiPlayerListReq): IApiPlayerListRes => {
    return {
        list: PlayerManager.Instance.getPlayersView(),
    };
});

server.setApi(ApiMsgEnum.ApiRoomList, (connection: Connection, data: IApiRoomListReq): IApiRoomListRes => {
    return {
        list: RoomManager.Instance.getRoomsView(),
    };
});

server.setApi(ApiMsgEnum.ApiRoomCreate, (connection: Connection, data: IApiRoomCreateReq): IApiRoomCreateRes => {
    if (!connection.playerId) {
        throw new Error('connection.playerId is null');
    }
    else {
        const newRoom = RoomManager.Instance.createRoom();
        const room = RoomManager.Instance.joinRoom(newRoom.id, connection.playerId);
        if (room) {
            RoomManager.Instance.snycRooms();
            PlayerManager.Instance.snycPlayers();
            return {
                room: RoomManager.Instance.getRoomView(room),
            };
        }
        else {
            throw new Error('room is null');
        }

    }
});

server.setApi(ApiMsgEnum.ApiRoomJoin, (connection: Connection, { rid }: IApiRoomJoinReq): IApiRoomJoinRes => {
    if (!connection.playerId) {
        throw new Error('connection.playerId is null');
    }
    else {
        const room = RoomManager.Instance.joinRoom(rid, connection.playerId);
        if (room) {
            PlayerManager.Instance.snycPlayers();
            RoomManager.Instance.snycRooms();
            RoomManager.Instance.snycRoom(room.id);
            return {
                room: RoomManager.Instance.getRoomView(room),
            };
        }
        else {
            throw new Error('room is null');
        }

    }
});

server.setApi(ApiMsgEnum.ApiRoomLeave, (connection: Connection, data: IApiRoomLeaveReq): IApiRoomLeaveRes => {
    if (!connection.playerId) {
        throw new Error('connection.playerId is null');
    }
    else {
        const player = PlayerManager.Instance.idMapPlayer.get(connection.playerId);
        if (!player) {
            throw new Error('player is null');
        }
        else {
            const rid = player.rid;
            if (!rid) {
                throw new Error('rid is null');
            }
            else {
                console.log('ApiRoomLeave ', player.rid);
                const room = RoomManager.Instance.leaveRoom(rid, connection.playerId);
                PlayerManager.Instance.snycPlayers();
                RoomManager.Instance.snycRooms();
                RoomManager.Instance.snycRoom(rid);
                return {

                };
            }
        }
    }
});

server.setApi(ApiMsgEnum.ApiStartGame, (connection: Connection, data: IApiStartGameReq): IApiStartGameRes => {
    if (!connection.playerId) {
        throw new Error('connection.playerId is null');
    }
    else {
        const player = PlayerManager.Instance.idMapPlayer.get(connection.playerId);
        if (!player) {
            throw new Error('player is null');
        }
        else {
            const rid = player.rid;
            if (!rid) {
                throw new Error('rid is null');
            }
            else {
                console.log('ApiRoomLeave ', player.rid);
                const room = RoomManager.Instance.startGame(rid);
                return {

                };
            }
        }
    }
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