"use client";

import { useEffect } from "react";

import CreatePost from "./components/CreatePost";
import PostComponent from "./components/Post";
import { context } from './context';
import { api } from "./utils";

export default function Home() {
  const { posts, setPosts } = context();

  useEffect(() => {
    async function loadFeed() {
      const { data } = await api.get(`/post/feed`);
      setPosts(data);
    }
    loadFeed();
  }, []);

  return (
    <>
      <ul className='flex flex-col items-center w-full h-screen gap-5 px-10 py-6 overflow-y-scroll '>
        <CreatePost />
        {
          !posts.length ? (
            <li>
              <strong className="text-lg text-gray-600">Nenhuma postagem foi feita ainda.</strong>
            </li>
          ) : (
            posts.map((value, key) =>
              !value.parentId ? (
                <li key={key}>
                  <PostComponent
                    children={value.children}
                    content={value.content}
                    User={value.User}
                    isLiked={value.isLiked}
                    likes={value.likes}
                    date={value.date}
                    id={value.id}
                  />
                </li>
              ) : null
            )
          )
        }

      </ul>
    </>
  );
}