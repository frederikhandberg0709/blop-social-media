const Discover: React.FC = () => {
  return (
    <>
      <div className="mt-[70px] flex min-h-screen flex-col items-center justify-start py-6 sm:py-12">
        <div className="flex w-[800px] flex-col gap-[15px]">
          <div className="flex items-center justify-between">
            {/* Page title */}
            <h1 className="text-3xl font-semibold">DISCOVER</h1>
            {/* Filters */}
            <button className="rounded-md border border-transparent px-[15px] py-[5px] font-medium text-black/50 transition duration-150 ease-in-out hover:border-blue-500/50 hover:bg-black/10 hover:text-black dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white">
              Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Discover;
