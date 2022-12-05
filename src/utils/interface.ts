/* eslint-disable @typescript-eslint/indent */
export interface IUser {
    id?: string
    username: string
    firstName?: string
    lastName?: string
    email: string
    password: string
    phone?: string
    photo?: string
    balance?: number
}
export interface ITokenDetails {
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
