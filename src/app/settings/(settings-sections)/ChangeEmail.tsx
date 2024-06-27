const ChangeEmail: React.FC = () => {
  return (
    <div>
      <h1 className="font-bold text-[25px]">Change Email</h1>

      <p className="mt-4">
        Here you can update your email address. Make sure to use a valid email
        address as you will need to verify it. Your new email address will be
        used for logging in and receiving important notifications.
      </p>

      <div className="mt-4">
        <p>Your Current Email</p>
        <p className="font-semibold text-[18px]">example@email.com</p>
      </div>

      <button className="text-white bg-blue-600 relative bottom-0 hover:bottom-1 hover:shadow-[0_5px_40px_10px_rgb(37,99,235,0.5)] px-4 py-2 mt-6 rounded-xl transition-all duration-150 ease-in-out">
        Change Email
      </button>
    </div>
  );
};

export default ChangeEmail;
