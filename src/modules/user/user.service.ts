import { afterEach } from "node:test";
import { prisma } from "../../lib/prisma.js";
import { auth } from "../../lib/auth.js";

const aboutMe = async (userId:string) => {
    const user = await prisma.user.findUniqueOrThrow({
        where:{
            id: userId
        }
    })
    return user
}

const getAllUsers = async () => {
    const users = await prisma.user.findMany()
    return users
}

const updateUserStatus = async (userId:string,status:boolean) => {
    const updated = await prisma.user.update({
        where:{
            id:userId
        },
        data:{
            isActive:status
        }
    })
    return updated
}

const updateUserProfile = async ({
  userId,
  name,
  image,
}: {
  userId: string
  name?: string
  image?: string
}) => {
  // Prepare data only if value exists
  const dataToUpdate: { name?: string; image?: string } = {}
  
  if (name && name.trim().length > 0) dataToUpdate.name = name.trim()
  if (image && image.trim().length > 0) dataToUpdate.image = image.trim()

  // Only update fields that have values
  const updated = await prisma.user.update({
    where: { id: userId },
    data: dataToUpdate,
  })

  return updated
}

const getSession = async (cookie:any,sessionToken:string) => {
    const data = await auth.api.getSession({
        headers: new Headers({
            cookie: cookie ?? `session_token=${sessionToken}`
        })
    })
    return data
}




export default {
    aboutMe,
    getAllUsers,
    updateUserStatus,
    updateUserProfile,
    getSession
}