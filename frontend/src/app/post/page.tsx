"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "react-feather";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CommentList from "../components/Comments";
import PostComponent from "../components/Post";
import { Post } from "../types";
import { api } from "../utils";

const SinglePost = () => {
  const [post, setPost] = useState<Post | null>(null);

  const searchParams = useSearchParams();
  const postId = searchParams.get('id');

  useEffect(() => {
    async function loadPost() {
      const { data } = await api.get(`/post?id=${postId}`);
      setPost(data);
    }

    loadPost();
  }, []);

  return (
    <div className="p-10">
      <div className="ml-5">
        <Link href="http://localhost:3000/">
          <ArrowLeft size={30} color="#000" />
        </Link>
      </div>
      <>
        {
          !post ?
            <div className="flex items-center justify-center h-full">
              <strong>Carregando postagem...</strong>
            </div>
            : <div className="flex flex-col items-center justify-center h-full">
              <PostComponent
                children={post.children}
                content={post.content}
                User={post.User}
                likes={post.likes}
                isLiked={post.isLiked}
                date={post.date}
                id={post.id}
              />
              <div className='bg-slate-300 w-[500px]'>
                <CommentList comments={post} />
              </div>
            </div>
        }
      </>
    </div>
  );
}

export default SinglePost;