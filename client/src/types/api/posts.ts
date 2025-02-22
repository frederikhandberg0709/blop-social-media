export interface PostResponse {
  id: string;
  userId: string;
  title: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  quoteCount: number;
}

export interface CreatePostParams {
  userId: string | undefined;
  title?: string;
  content: string;
  timestamp?: string;
}

export interface UpdatePostParams {
  postId: string;
  title?: string;
  content: string;
  timestamp?: string;
}

export interface UpdatePostResponse {
  id: string;
  title?: string;
  content: string;
  updatedAt: string;
}
