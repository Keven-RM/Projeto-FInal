import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

async function listUser(req: Request, res: Response) {
  try {
    const newUser = await prisma.user.findMany();

    return res.status(201).json(newUser);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: 'Error listing user' });
  }
};

async function createUser(req: Request, res: Response) {
  try {
    const { email, name } = req.body;
    const newUser = await prisma.user.create({
      data: {
        name,
        email
      }
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: 'Error creating user' });
  }
};

async function getUser(req: Request, res: Response) {
  try {
    const userId = Number(req.query.id);

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: `User with id ${userId} not found` });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: 'Error retrieving user' });
  }
};


async function updateUser(req: Request, res: Response){
  try {
    const userId = Number(req.query.id);
    const { email, name } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email
      }
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: 'Error updating user' });
  }
};

async function removeUser(req: Request, res: Response){
  try {
    const userId = Number(req.query.id);

    await prisma.user.delete({ where: { id: userId } });

    return res.status(204)
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: 'Error deleting user' });
  }
};

export default { listUser, createUser, getUser, updateUser, removeUser };
