import jwt from 'jsonwebtoken'
import config from '../config';

export interface JwtPayload {
    userId: string;
    email:string;
    role: string;
}

export const generateAccessToken = (payload:JwtPayload)=>{
    return jwt.sign(payload,config.jwt_access_secret as string, { expiresIn: "15m" })
}


export const generateRefreshToken = (payload:JwtPayload)=>{
    return jwt.sign(payload,config.jwt_refresh_secret as string, { expiresIn: "7d" })
}


export const verifyAccessToken = (token: string):JwtPayload=>{
    return jwt.verify(token,config.jwt_access_secret as string) as JwtPayload
}

export const verifyRefreshToken = (token: string):JwtPayload=>{
    return jwt.verify(token,config.jwt_refresh_secret as string) as JwtPayload
}