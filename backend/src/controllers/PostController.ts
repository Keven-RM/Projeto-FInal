import { PrismaClient } from "@prisma/client";
import { PrismaClientValidationError } from "@prisma/client/runtime";
import { Request, Response } from "express";
import { Post } from "../types";

const prisma = new PrismaClient();

async function create(req: Request, res: Response) {
  try {
    const { content, likes, parentId, authorId } = req.body;

    const post = await prisma.post.create({
      data: {
        date: new Date(),
        content,
        likes,
        authorId: Number(authorId),
        parentId: parentId
      }
    });

    res.status(201).json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Erro ao criar postagem' })
  }
}

// READ
async function getPostById(req: Request, res: Response) {
  try {
    const postId = Number(req.query.id);

    const post: Post[] = await prisma.$queryRaw`
      WITH RECURSIVE children AS (
        SELECT
          Post.id,
          Post.date,
          Post.content,
          Post.likes,
          Post.isLiked,
          Post.authorId,
          Post.parentId,
          User.email,
          User.name
        FROM
          Post
        INNER JOIN User ON Post.authorId = User.id
        WHERE
          Post.id = ${postId}
        UNION ALL
          SELECT
            Post.id,
            Post.date,
            Post.content,
            Post.likes,
            Post.isLiked,
            Post.authorId,
            Post.parentId,
            User.email,
            User.name
          FROM
            Post
          INNER JOIN children ON Post.parentId = Post.id
          INNER JOIN User ON Post.authorId = User.id
      )
      SELECT
        Post.id,
        Post.date,
        Post.content,
        Post.likes,
        Post.isLiked,
        Post.authorId,
        Post.parentId,
        User.email,
        User.name
      FROM
        Post
      INNER JOIN User ON Post.authorId = User.id;
    `;

    if (!post.length) {
      return res.status(404).json({ message: 'Postagem não encontrada' });
    }

    function flatListToTree(list: any) {
      let tree: any = [];
      const table: any = {};

      list.forEach((value: any) => {
        value.User = {
          id: value.authorId,
          name: value.name,
          email: value.email
        }

        table[value.id] = value;
        table[value.id].children = [];
      })

      list.forEach((row: any) => {
        if (table[row.parentId]) {
          table[row.parentId].children.push(row);
        } else {
          tree = row
        }
      });

      return tree;
    }

    const tree = flatListToTree(post);

    return res.status(200).json(tree);
  } catch (err) {
    if(err instanceof PrismaClientValidationError){
      console.error(err.message)
    }
    res.status(500).json({ message: 'Erro ao achar postagem' })
  }
}

async function getAllPosts(req: Request, res: Response) {
  try {

    const posts = await prisma.post.findMany({
      include: {
        User: true,
      },
      orderBy: {
        id: 'desc'
      }
    });

    res.status(200).json(posts)
  } catch (err) {
    if(err instanceof PrismaClientValidationError){
      console.error(err.message)
    }
    res.status(500).json({ message: 'Erro ao listar postagens' })
  }
}

// UPDATE
async function updatePost(req: Request, res: Response) {
  try {
    const { id, content, likes, parentId, authorId, isLiked } = req.body;

    const post = await prisma.post.update({
      where: { id },
      data: {
        content,
        likes,
        authorId,
        isLiked,
        parentId
      }
    });

    res.status(200).json(post);
  } catch (err) {
    if(err instanceof PrismaClientValidationError){
      console.error(err.message)
    }
    res.status(500).json({ message: 'Erro ao atualizar postagem' })
  }
}

// DELETE
async function removePost(req: Request, res: Response) {
  try {
    const postId = Number(req.body.id);
    const post = await prisma.post.delete({
      where: { id: postId },
    })
    res.status(200).json(post)
  } catch (err) {
    if(err instanceof PrismaClientValidationError){
      console.error(err.message)
    }
    res.status(500).json({ message: 'Erro ao excluir postagem' })
  }
}

export default { create, getPostById, getAllPosts, updatePost, removePost };