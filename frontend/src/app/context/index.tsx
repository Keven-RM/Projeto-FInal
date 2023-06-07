'use client';

import React, { ReactNode, createContext, useContext, useState } from 'react';
import { Post } from '../types';

interface ContextData {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  posts: Post[];
  updatePosts: React.Dispatch<Post>;
  updatePost: (post: Post, index: number) => void;
  setPosts:React.Dispatch<React.SetStateAction<Post[]>>;
}

interface ContextProvider {
  children: ReactNode;
}

const Context = createContext<ContextData>({} as ContextData);
export const context = () => useContext(Context);

const ContextProvider = ({ children }: ContextProvider) => {
  const [theme, setTheme] = useState<string>('light');
  const [posts, setPosts] = useState<Post[] | []>([]);
  
  const updatePosts = (post: Post) => {
    setPosts([post, ...posts])
  }

  const updatePost = (newPost: Post) => {
    const updatedObjects = posts.map((currentPost) => currentPost.id === newPost.id ? newPost : currentPost);
    setPosts(updatedObjects);
  }

  return (
    <Context.Provider value={{ theme, setTheme, posts, updatePosts, updatePost, setPosts }}>
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
