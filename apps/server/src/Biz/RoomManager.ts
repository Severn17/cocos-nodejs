import Singleton from "../Base/Singleton";
import { ApiMsgEnum } from "../Common";
import { Player } from "./Player";
import { PlayerManager } from "./PlayerManager";
import { Room } from "./Room";

export class RoomManager extends Singleton {



    static get Instance() {
        return super.GetInstance<RoomManager>();
    }

    nextRoomId = 1;

    rooms: Set<Room> = new Set();
    idMapRoom: Map<number, Room> = new Map();

    createRoom() {
        const room = new Room(this.nextRoomId++);
        this.rooms.add(room);
        this.idMapRoom.set(room.id, room);
        return room;
    }

    removeRoom(id: number) {
        const room = this.idMapRoom.get(id)
        if (room) {
            room.close();
            this.rooms.delete(room);
            this.idMapRoom.delete(id);
        }
    }

    removePlayer(pid: number) {
        const player = this.idMapRoom.get(pid);
        if (player) {
            this.rooms.delete(player);
            this.idMapRoom.delete(pid);
        }
    }

    joinRoom(rid: number, uid: number) {
        const room = this.idMapRoom.get(rid)
        if (room) {
            room.join(uid)
            return room
        }
    }

    leaveRoom(rid: number, uid: number) {
        const room = this.idMapRoom.get(rid)
        if (room) {
            room.leave(uid)
            return room
        }
    }

    snycRooms() {
        for (const player of PlayerManager.Instance.players) {
            player.connection.sendMsg(ApiMsgEnum.MsgRoomList, {
                list: this.getRoomsView(),
            })
        }
    }

    snycRoom(rid: number) {
        const room = this.idMapRoom.get(rid)
        if(room){
            room.sync()
        }
    }

    getRoomsView(rooms: Set<Room> = this.rooms) {
        return [...rooms].map(room => this.getRoomView(room));
    }

    getRoomView({ id, players }: Room) {
        return {
            id,
            players: PlayerManager.Instance.getPlayersView(players),
        };
    }

    startGame(rid: number){
        const room = this.idMapRoom.get(rid)
        if(room){
            room.startGame()
        }
    }

}