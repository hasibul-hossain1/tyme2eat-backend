import { Request, Response } from "express";
import config from "../../config";
import authService from "./auth.service";


const signUp = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;


  const {refreshToken,accessToken,user}= await authService.signUp({name,email,password})



  res.cookie("refreshToken",refreshToken, {
        httpOnly: true,
        secure: config.node_env === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
  
  
  
  return res.status(201).json({
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
};


const signIn = async (req:Request,res:Response) => {
    const { email, password } = req.body;
    const { refreshToken, accessToken, user } = await authService.signIn({ email, password });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: config.node_env === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
        accessToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    });
};

const refreshToken = async (req:Request,res:Response) => {
    const token = req.cookies?.refreshToken;
    console.log(token);

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const {accessToken,refreshToken}  = await authService.refreshTokens(token)


    res.cookie("refreshToken", refreshToken,{
        httpOnly: true,
        secure: config.node_env === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.json({accessToken})
}

const logout = async (req:Request,res:Response) => {
    const token = req.cookies?.refreshToken;
    await authService.logout(token)
    res.clearCookie("refreshToken");
    return res.json({success:true, message: "Logged out successfully" });
}

const getMe = async (req:Request,res:Response) => {
    const user = await authService.getMe(req.user.id);
    return res.json({success:true,data:user});
}

export default {
    signUp,
    signIn,
    refreshToken,
    logout,
    getMe
};
