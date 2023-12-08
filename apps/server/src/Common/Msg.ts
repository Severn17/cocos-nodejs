import { IPlayer, IRoom } from "./Api";
import { IClientInput, IState } from "./IState";

export interface IMsgClientSync {
    input: IClientInput
    frameId: number
}

export interface IMsgServerSync {
    inputs: IClientInput[]
    lastFrameId: number
}

export interface IMsgPlayerList {
    list: IPlayer[]
}

export interface IMsgRoomList {
    list: IRoom[]
}

export interface IMsgRoom {
    room: IRoom
}
export interface IMsgStartGame {
    state: IState
}