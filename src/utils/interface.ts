/* eslint-disable @typescript-eslint/indent */
export interface IUser {
    id?: string
    username?: string
    firstname?: string
    lastname?: string
    email: string
    password: string
    phone?: string
    photo?: string
    balance?: number
}
export interface ITokenDetails {
    id: string
    data: IUser
}
export interface CustomRequest {
  user: IUser
  file: object
  params: object
  query: object
  path: object
}
export interface ILogin {
  email: string
  password: string
}
export interface IOtp {
  id?: string
  email: string
  token: number
  expired: boolean
}
export interface INotifications {
  id?: string
  message?: string
  owner?: string
  title?: string
  status?: string
}