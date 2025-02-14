"use client";

import PostTemplate from "@/components/post/PostTemplate";
import { useHomeTimeline } from "@/hooks/api/timelines/useHomeTimeline";

const Home: React.FC = () => {
  const {
    data: timelineData,
    error: timelineError,
    isPending: isPendingTimeline,
  } = useHomeTimeline();

  return (
    <>
      <div className="mt-[70px] flex min-h-screen flex-col items-center justify-start py-6 sm:py-12">
        <div className="flex w-[800px] flex-col gap-[15px]">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold">HOME</h1>
            <button className="rounded-md px-[15px] py-[5px] font-medium text-primaryGray transition duration-150 ease-in-out hover:bg-primaryBlue hover:text-black dark:hover:text-white">
              Filters
            </button>
          </div>

          {isPendingTimeline && <p>Loading posts...</p>}
          {timelineError && (
            <p className="text-red-500">{timelineError.message}</p>
          )}

          {timelineData?.posts.map((post) => (
            <PostTemplate key={post.id} {...post} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
