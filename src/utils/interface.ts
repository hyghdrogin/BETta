export interface IUser {
  id?: string
  username?: string
  firstname?: string
  lastname?: string
  phone?: string
  dob?: string
  email: string
  balance?: number
  location?: string
  password: string
  active?: boolean
  verified?: boolean,
  createdAt?: Date,
  updatedAt?: Date,
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
  username: string
  password: string
}
export interface IOtp {
  id?: string
  userId?: string
  token: number
  expired: boolean
  createdAt?: Date
  updatedAt?: Date
}
