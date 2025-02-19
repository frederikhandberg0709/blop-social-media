const ChangeEmail: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold">Change Email</h1>

      <p className="mt-4">
        Here you can update your email address. Your new email address will be
        used for logging in.
      </p>

      <div className="mt-4">
        <p>Your Current Email</p>
        {/* TODO: Fetch account email */}
        <p className="text-[18px] font-semibold">example@email.com</p>
      </div>

      <button className="relative bottom-0 mt-6 rounded-xl bg-blue-600 px-4 py-2 text-white transition-all duration-150 ease-in-out hover:bottom-1 hover:shadow-[0_5px_40px_10px_rgb(37,99,235,0.5)]">
        Change Email
      </button>
    </div>
  );
};

export default ChangeEmail;
