"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PostHistory from "@/components/PostHistory";
import PostTemplate from "@/components/post/PostTemplate";
import { useUpdatePost } from "@/hooks/api/posts/useUpdatePost";
import { usePost } from "@/hooks/api/posts/usePost";
import Button from "@/components/buttons/Button";
import { UserProps } from "@/types/components/user";

const EditPost: React.FC = () => {
  const { id } = useParams();
  const postId = id as string;
  const { data: session } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [initialTitle, setInitialTitle] = useState<string>("");
  const [initialContent, setInitialContent] = useState<string>("");
  const [characterCount, setCharacterCount] = useState<number>(0);
  const [wordCount, setWordCount] = useState<number>(0);
  const [view, setView] = useState<"preview" | "history">("preview");

  const {
    data: post,
    isPending: isLoadingPost,
    error: postError,
  } = usePost({ postId });

  const {
    mutate: updatePost,
    isPending: isUpdatingPost,
    error: updatePostError,
  } = useUpdatePost();

  useEffect(() => {
    if (post) {
      setTitle(post.title || "");
      setContent(post.content);
      setInitialTitle(post.title || "");
      setInitialContent(post.content);
    }
  }, [post]);

  const handleUpdatePost = async () => {
    if (!postId) return;
    if (!content.trim()) return;

    if (!session) {
      alert("You must be logged in to edit a post.");
      return;
    }

    updatePost(
      { postId, title, content },
      {
        onSuccess: (updatedPost) => {
          router.push(`/post/${updatedPost.id}`);
        },
        onError: (error) => {
          console.error("Error updating post:", error);
          alert(
            error instanceof Error ? error.message : "Failed to update post",
          );
        },
      },
    );
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    setContent(newText);
    setCharacterCount(newText.length);
    setWordCount(newText ? newText.trim().split(/\s+/).length : 0);

    const val = event.target?.value;
    setContent(val);
  };

  const parseTextWithEnhancements = (inputText: string) => {
    const mediaRegex = /(https:\/\/.*?\.(jpg|jpeg|png|gif|mp4|avi|mov))/g;
    let parts = [];
    let lastIndex = 0;

    let match;
    while ((match = mediaRegex.exec(inputText)) !== null) {
      const textBeforeMedia = inputText.slice(lastIndex, match.index);
      parts.push(
        textBeforeMedia.split("\n").map((line, index, array) => (
          <React.Fragment key={`${lastIndex}-${index}`}>
            {line}
            {index < array.length + 1 && <br />}
          </React.Fragment>
        )),
      );

      const mediaLink = match[0];
      const isImage = /\.(jpg|jpeg|png|gif)$/.test(mediaLink);
      if (isImage) {
        parts.push(
          <img
            key={mediaLink}
            src={mediaLink}
            alt="User uploaded content"
            className="rounded-[10px]"
          />,
        );
      } else {
        parts.push(
          <video
            key={mediaLink}
            src={mediaLink}
            className="rounded-[10px]"
            width="100%"
            controls
            autoPlay
            muted
          />,
        );
      }

      lastIndex = mediaRegex.lastIndex;
    }

    const remainingText = inputText.slice(lastIndex);
    parts.push(
      remainingText.split("\n").map((line, index, array) => (
        <React.Fragment key={`${lastIndex}-${index}`}>
          {line}
          {index < array.length - 1 && <br />}
        </React.Fragment>
      )),
    );

    return parts;
  };

  const isPostChanged = () => {
    return title !== initialTitle || content !== initialContent;
  };

  if (isLoadingPost) return <div>Loading...</div>;
  if (postError) return <div>Error loading post: {postError.message}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <>
      <div className="mb-[100px] mt-[90px] flex justify-center">
        <div className="flex w-[800px] flex-col gap-[30px]">
          <div>
            <h1 className="text-[25px] font-semibold">Edit Post</h1>
            <input
              type="text"
              placeholder="Title of post (optional)..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-dynamic mt-[30px] w-full rounded-xl border-2 border-blue-500/30 bg-transparent p-[15px] outline-none transition duration-200 ease-in-out hover:border-blue-500/75 focus:border-blue-500/75"
            />
            <textarea
              placeholder="Write your post here..."
              value={content}
              onChange={handleTextChange}
              className="border-dynamic my-[30px] min-h-[400px] w-full overflow-hidden rounded-xl border-2 border-blue-500/30 bg-transparent p-[15px] outline-none transition duration-200 ease-in-out hover:border-blue-500/75 focus:border-blue-500/75"
            />

            <div className="flex items-center justify-between gap-[30px]">
              <div className="flex gap-[30px]">
                <p className="text-white/50">
                  Character count: {characterCount}
                </p>
                <p className="text-white/50">Word count: {wordCount}</p>
              </div>
              <div className="flex gap-[30px]">
                <Button
                  onClick={handleUpdatePost}
                  disabled={
                    !isPostChanged() || !content.trim() || isUpdatingPost
                  }
                >
                  {isUpdatingPost ? "Updating..." : "Update Post"}
                </Button>
                <Button variant="danger" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
          <div className="h-[1px] w-full bg-white/5"></div>
          <div className="flex gap-5">
            <Button
              variant="secondary"
              onClick={() => setView("preview")}
              className={view === "preview" ? "opacity-100" : "opacity-50"}
            >
              Preview Post
            </Button>
            <Button
              variant="secondary"
              onClick={() => setView("history")}
              className={view === "history" ? "opacity-100" : "opacity-50"}
            >
              Post Revisions
            </Button>
          </div>
          {view === "preview" ? (
            <div>
              <h1 className="mb-[20px] font-bold text-white/50">
                Preview Post
              </h1>
              <PostTemplate
                id={session?.user.id || ""}
                user={session?.user as UserProps}
                createdAt={new Date().toISOString()}
                updatedAt={new Date().toISOString()}
                timestamp={new Date().toISOString()}
                title={title}
                content={parseTextWithEnhancements(content)}
                initialLikesCount={0}
                userLiked={false}
                type="original"
              />
            </div>
          ) : (
            <PostHistory postId={postId} />
          )}
        </div>
      </div>
    </>
  );
};

export default EditPost;
