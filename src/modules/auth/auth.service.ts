import { prisma } from "../../config/db";
import { Prisma, User } from "@prisma/client";
import bcryptjs from "bcryptjs";
const loginWithEmailAndPassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || !user.password) {
    throw new Error("User not found or password missing!");
  }

  const isValid = await bcryptjs.compare(password, user.password); // safe now
  if (!isValid) {
    throw new Error("Password is incorrect!");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

// const authWithGoogle = async (data: Prisma.UserCreateInput) => {
//     let user = await prisma.user.findUnique({
//         where: {
//             email: data.email
//         }
//     })

//     if (!user) {
//         user = await prisma.user.create({
//             data
//         })
//     }

//     return user;
// }

export const AuthService = {
  loginWithEmailAndPassword,
  // authWithGoogle
};
