// Will be deleted. Wait before testing new implementation.

import { PostProps } from "@/types/PostProps";
import { notFound } from "next/navigation";
import SendCommentClient from "../../send-comment/[postId]/SendCommentClient";

interface SendCommentProps {
  params: { slug: string[] };
}

export default async function SendComment({ params }: SendCommentProps) {
  const [type, id] = params.slug;

  //   if (!type || !id) {
  //     notFound();
  //   }

  let response;
  let data;

  if (type === "post") {
    response = await fetch(`${process.env.NEXTAUTH_URL}/api/fetch-post/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      notFound();
    }

    data = await response.json();

    const postProps: PostProps = {
      id: data.id,
      title: data.title,
      content: data.content,
      timestamp: data.timestamp,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      initialLikesCount: data.likesCount,
      userLiked: data.userLiked,
      user: {
        id: data.user.id,
        username: data.user.username,
        profileName: data.user.profileName,
        profilePicture: data.user.profilePicture,
        profileBanner: data.user.profileBanner,
        bio: data.user.bio,
        followersCount: data.user.followersCount,
        followingCount: data.user.followingCount,
        postsCount: data.user.postsCount,
      },
      imageContent: data.imageContent,
      videoContent: data.videoContent,
    };

    return <SendCommentClient post={postProps} />;
  } else if (type === "comment") {
    response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/fetch-comment/${id}`,
      { method: "GET", cache: "no-store" },
    );
    console.log("this is a comment", response);
  }
  //   if (type === "post") {
  //     response = await fetch(`${process.env.NEXTAUTH_URL}/api/fetch-post/${id}`, {
  //       method: "GET",
  //       cache: "no-store",
  //     });

  //     if (!response.ok) {
  //       notFound();
  //     }

  //     data = await response.json();

  //     const postProps: PostProps = {
  //       id: data.id,
  //       title: data.title,
  //       content: data.content,
  //       timestamp: data.timestamp,
  //       createdAt: data.createdAt,
  //       updatedAt: data.updatedAt,
  //       initialLikesCount: data.likesCount,
  //       userLiked: data.userLiked,
  //       user: {
  //         id: data.user.id,
  //         username: data.user.username,
  //         profileName: data.user.profileName,
  //         profilePicture: data.user.profilePicture,
  //         profileBanner: data.user.profileBanner,
  //         bio: data.user.bio,
  //         followersCount: data.user.followersCount,
  //         followingCount: data.user.followingCount,
  //         postsCount: data.user.postsCount,
  //       },
  //       imageContent: data.imageContent,
  //       videoContent: data.videoContent,
  //     };

  //     return <SendCommentClient post={postProps} comment={null} />;
  //   } else if (type === "comment") {
  //     response = await fetch(
  //       `${process.env.NEXTAUTH_URL}/api/fetch-comment/${id}`,
  //       { method: "GET", cache: "no-store" },
  //     );

  //     if (!response.ok) {
  //       notFound();
  //     }

  //     data = await response.json();

  //     return <SendCommentClient post={null} comment={data} />;
  //   } else {
  //     notFound();
  //   }
}
