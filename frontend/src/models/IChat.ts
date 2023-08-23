export interface IChat{
    userID:string,
    username: string,
}
export interface INewMessage{
    sender: string,
    text: string,
    time: string,
    status: string
    myself: boolean;
}