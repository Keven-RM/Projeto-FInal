export interface User {
  id: number;
  email: string;
  name: string;
  posts?: Post[]
}

export interface Post {
  id: number;
  date: Date;
  content?: string;
  likes: number;
  parentId?: number;
  author: User;
  authorId: number;
  isLiked: boolean;
}
