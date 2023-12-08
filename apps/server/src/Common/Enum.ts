export enum InputTypeEnum{
    ActorMove = "ActorMove",
    WeaponShoot = "WeaponShoot",
    TimePast = "TimePast",
}
export enum EntityTypeEnum{
    Map = "Map",
    Actor1 = "Actor1",
    Weapon1 = "Weapon1",
    Bullet1 = "Bullet1",
    Bullet2 = "Bullet2",
    Explosion = "Explosion",
}

export enum ApiMsgEnum{
    ApiPlayerJoin = "ApiPlayerJoin",
    ApiPlayerList = "ApiPlayerList",
    ApiRoomList = "ApiRoomList",
    ApiRoomCreate = "ApiRoomCreate",
    ApiRoomJoin = "ApiRoomJoin",
    ApiRoomLeave = "ApiRoomLeave",
    ApiStartGame = "ApiStartGame",
    
    MsgPlayerList = "MsgPlayerList",
    MsgRoomList = "MsgRoomList",
    MsgRoom = "MsgRoom",
    MsgStartGame = "MsgStartGame",

    MsgClientSync = "MsgClientSync",
    MsgServerSync = "MsgServerSync",
}