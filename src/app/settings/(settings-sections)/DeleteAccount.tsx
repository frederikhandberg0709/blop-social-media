const DeleteAccount: React.FC = () => {
  return (
    <div>
      <h1 className="font-bold text-[25px]">Delete Account</h1>
      <p className="mt-4">
        Warning:{" "}
        <span className="font-semibold text-red-500">
          Deleting your account is a permanent action and cannot be undone.
        </span>{" "}
        All your data, including your profile, posts, and settings, will be
        permanently deleted.
        <br />
        <br />
        If you are sure you want to delete your account, please proceed with
        caution.
      </p>

      <button className="text-white bg-red-600 relative bottom-0 hover:bottom-1 hover:shadow-[0_5px_40px_10px_rgb(220,38,38,0.5)] px-4 py-2 mt-6 rounded-xl transition-all duration-150 ease-in-out">
        Delete My Account
      </button>
    </div>
  );
};

export default DeleteAccount;
