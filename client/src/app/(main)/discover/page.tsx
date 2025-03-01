"use client";

import FiltersDropdownMenu from "@/components/menus/FiltersDropdownMenu";
import PostTemplate from "@/components/post/PostTemplate";
import { useDiscoverTimeline } from "@/hooks/api/timelines/useDiscoverTimeline";

const Discover: React.FC = () => {
  const {
    data: timelineData,
    error: timelineError,
    isPending: isPendingTimeline,
  } = useDiscoverTimeline();

  return (
    <>
      <div className="mt-[70px] flex min-h-screen flex-col items-center justify-start py-6 sm:py-12">
        <div className="flex w-[800px] flex-col gap-[15px]">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold">DISCOVER</h1>
            <FiltersDropdownMenu />
          </div>

          {isPendingTimeline && <p>Loading posts...</p>}
          {timelineError && (
            <p className="text-red-500">{timelineError?.message}</p>
          )}

          {timelineData?.posts.length === 0 && (
            <p className="text-primaryGray text-center">No posts found.</p>
          )}

          {timelineData?.posts.map((post) => (
            <PostTemplate key={`${post.id}-${post.createdAt}`} {...post} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Discover;
