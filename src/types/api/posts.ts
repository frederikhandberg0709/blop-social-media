export interface PostResponse {
  success: boolean;
  postId: string;
}

export interface CreatePostParams {
  userId: string | undefined;
  title?: string;
  content: string;
  timestamp?: string;
}

export interface QuotePostParams extends CreatePostParams {
  quotedPostId: string;
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
