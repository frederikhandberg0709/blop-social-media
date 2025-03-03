"use client";

import Link from "next/link";
import React, { JSX, useEffect, useRef, useState } from "react";
import useAutosizeTextArea from "@/hooks/useAutosizeTextArea";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import PostTemplate from "@/components/post/PostTemplate";
import { parseTextWithEnhancements } from "@/utils/parseTextWithEnhancements";
import { UserProps } from "@/types/components/user";
import { useCreatePost } from "@/hooks/api/posts/useCreatePost";
import Button from "@/components/buttons/Button";
import QuotedTemplate from "@/components/post/QuotedTemplate";
import { CreatePostParams } from "@/types/api/posts";
import { usePosts } from "@/hooks/api/posts/usePosts";

const CreatePost: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("postId");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [characterCount, setCharacterCount] = useState<number>(0);
  const [wordCount, setWordCount] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [quotedPostIds, setQuotedPostIds] = useState<string[]>([]);

  const { posts: quotedPosts, isLoading: isQuotedPostsLoading } = usePosts({
    postIds: quotedPostIds,
    enabled: quotedPostIds.length > 0,
  });

  const {
    mutate: createPost,
    isPending: isCreatingPost,
    error: createPostError,
  } = useCreatePost();

  useEffect(() => {
    if (postId) {
      const postUrl = `${window.location.origin}/post/${postId}`;
      setContent(`\n\n${postUrl}`);
    }
  }, [postId]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  useAutosizeTextArea(textareaRef.current, content);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    setContent(newText);
    setCharacterCount(newText.length);
    setWordCount(newText ? newText.trim().split(/\s+/).length : 0);

    const val = event.target?.value;
    setContent(val);
  };

  const handleCreatePost = () => {
    if (isCreatingPost) return;

    const params: CreatePostParams = {
      userId: session?.user.id,
      title,
      content,
      timestamp: new Date().toISOString(),
    };

    createPost(params, {
      onSuccess: (response) => {
        router.push(`/post/${response.id}?success=true`);
      },
    });
  };

  const user: UserProps = {
    id: session?.user.id || "",
    username: session?.user.username || "",
    profileName: session?.user.profileName || "",
    profilePicture: session?.user.profilePicture || "",
    profileBanner: "",
    bio: "",
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
  };

  const renderPreviewContent = () => {
    console.log("Current content:", content);

    const regex = new RegExp(
      `${window.location.origin}/post/([a-zA-Z0-9-_]+)`,
      "g",
    );
    const matches = Array.from(content.matchAll(regex));
    console.log("Found matches:", matches);

    const foundPostIds = matches.map((match) => match[1]);
    console.log("Extracted post IDs:", foundPostIds);

    if (
      JSON.stringify(foundPostIds.sort()) !==
      JSON.stringify(quotedPostIds.sort())
    ) {
      console.log("Updating quoted post IDs:", foundPostIds);
      setQuotedPostIds(foundPostIds);
    }

    if (foundPostIds.length === 0) {
      return parseTextWithEnhancements(content, () => {});
    }

    const elements: JSX.Element[] = [];
    let remainingContent = content;

    matches.forEach((match, index) => {
      const [fullUrl] = match;
      const splitIndex = remainingContent.indexOf(fullUrl);

      if (splitIndex > -1) {
        const beforeUrl = remainingContent.slice(0, splitIndex);
        if (beforeUrl) {
          elements.push(
            <React.Fragment key={`text-${index}`}>
              {parseTextWithEnhancements(beforeUrl, () => {})}
            </React.Fragment>,
          );
        }

        const quote = quotedPosts[index];
        if (quote) {
          elements.push(
            <QuotedTemplate
              key={`quote-${index}`}
              id={quote.id}
              user={quote.user}
              title={quote.title}
              content={quote.content}
              createdAt={quote.createdAt}
            />,
          );
        }

        remainingContent = remainingContent.slice(splitIndex + fullUrl.length);
      }
    });

    if (remainingContent) {
      elements.push(
        <React.Fragment key="text-final">
          {parseTextWithEnhancements(remainingContent, () => {})}
        </React.Fragment>,
      );
    }

    return <>{elements}</>;
  };

  return (
    <>
      <div className="mb-[100px] mt-[90px] flex justify-center">
        <div className="flex w-[800px] flex-col gap-[30px]">
          <div>
            <h1 className="text-3xl font-semibold">
              {postId ? "Quote Post" : "Create Post"}
            </h1>
            <input
              type="text"
              placeholder="Title of post (optional)..."
              value={title}
              onChange={handleTitleChange}
              className="mt-[30px] w-full rounded-xl border-2 border-blue-500/30 bg-transparent p-[15px] outline-none transition duration-200 ease-in-out hover:border-blue-500/75 focus:border-blue-500/75"
            />
            <textarea
              placeholder="Write your post here..."
              value={content}
              onChange={handleTextChange}
              ref={textareaRef}
              className="my-[30px] min-h-[400px] w-full overflow-hidden rounded-xl border-2 border-blue-500/30 bg-transparent p-[15px] outline-none transition duration-200 ease-in-out hover:border-blue-500/75 focus:border-blue-500/75"
            />

            {createPostError && (
              <p className="text-center text-red-500">
                {createPostError.message ===
                "You need to be logged in to create posts"
                  ? "Please log in to create a post"
                  : createPostError.message}
              </p>
            )}

            <div className="flex items-center justify-between gap-[30px]">
              <div className="flex gap-[30px]">
                <p className="text-white/50">
                  Character count: {characterCount}
                </p>
                <p className="text-white/50">Word count: {wordCount}</p>
              </div>
              <div className="flex gap-[30px]">
                {/* TODO: Implement save draft functionality */}
                <Link
                  href={""}
                  className="w-[100px] rounded-xl py-[12px] text-center font-semibold text-green-500 transition duration-150 ease-in-out hover:bg-green-700 hover:text-white"
                >
                  Save Draft
                </Link>
                <Button
                  onClick={handleCreatePost}
                  disabled={!content.trim() || isCreatingPost}
                >
                  {isCreatingPost ? "Publishing..." : "Publish"}
                </Button>
                {/* TODO: Show warning modal before cancelling */}
                <Button variant="danger" onClick={() => router.push("/home")}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
          <div className="h-[1px] w-full bg-white/5"></div>
          <div>
            <h1 className="mb-[20px] font-bold text-white/50">
              {postId ? "Preview Quote Post" : "Preview Post"}
            </h1>
            <PostTemplate
              id={session?.user.id || ""}
              type="original"
              user={user}
              createdAt={new Date().toISOString()}
              updatedAt={new Date().toISOString()}
              timestamp={new Date().toISOString()}
              title={title}
              content={renderPreviewContent()}
              initialLikesCount={0}
              userLiked={false}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
