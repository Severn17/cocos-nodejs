import { IApiPlayerJoinReq, IApiPlayerJoinRes, IApiPlayerListReq, IApiPlayerListRes, IApiRoomCreateReq, IApiRoomCreateRes, IApiRoomJoinReq, IApiRoomJoinRes, IApiRoomLeaveReq, IApiRoomLeaveRes, IApiRoomListReq, IApiRoomListRes, IApiStartGameReq, IApiStartGameRes } from "./Api";
import { ApiMsgEnum } from "./Enum";
import { IMsgClientSync, IMsgPlayerList, IMsgRoom, IMsgRoomList, IMsgServerSync, IMsgStartGame } from "./Msg";

export interface IModel {
    api: {
        [ApiMsgEnum.ApiPlayerJoin]: {
            req: IApiPlayerJoinReq,
            res: IApiPlayerJoinRes,
        }
        [ApiMsgEnum.ApiPlayerList]: {
            req: IApiPlayerListReq,
            res: IApiPlayerListRes,
        }
        [ApiMsgEnum.ApiRoomCreate]: {
            req: IApiRoomCreateReq,
            res: IApiRoomCreateRes,
        }
        [ApiMsgEnum.ApiRoomList]: {
            req: IApiRoomListReq,
            res: IApiRoomListRes,
        }
        [ApiMsgEnum.ApiRoomJoin]: {
            req: IApiRoomJoinReq,
            res: IApiRoomJoinRes,
        }
        [ApiMsgEnum.ApiRoomLeave]: {
            req: IApiRoomLeaveReq,
            res: IApiRoomLeaveRes,
        }
        [ApiMsgEnum.ApiStartGame]: {
            req: IApiStartGameReq,
            res: IApiStartGameRes,
        }
    }
    msg: {
        [ApiMsgEnum.MsgClientSync]: IMsgClientSync
        [ApiMsgEnum.MsgServerSync]: IMsgServerSync
        [ApiMsgEnum.MsgPlayerList]: IMsgPlayerList
        [ApiMsgEnum.MsgRoomList]: IMsgRoomList
        [ApiMsgEnum.MsgRoom]: IMsgRoom
        [ApiMsgEnum.MsgStartGame]: IMsgStartGame
    }
}