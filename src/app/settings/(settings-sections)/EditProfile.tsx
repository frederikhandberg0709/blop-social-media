const EditProfile: React.FC = () => {
  return (
    <div>
      <h1 className="font-bold text-[25px]">Edit Profile</h1>
      <div className="flex flex-col gap-[30px] mt-[30px]">
        <p>
          Customize and personalize your public appearance by editing your
          profile. This includes updating your profile name, username, profile
          picture, and profile banner.
        </p>
        <div>
          <p>Profile Picture</p>
          <img
            src=""
            alt=""
            className="h-[90px] w-[90px] rounded-full mt-2 bg-white/50"
          />
        </div>
        <div>
          <p>Profile Banner</p>
          <img
            src=""
            alt=""
            className="h-[300px] max-w-[1000px] rounded-3xl mt-2 bg-white/50"
          />
        </div>
        <div>
          <p>Profile Name</p>
          <p className="font-bold text-[20px]">John Doe</p>
        </div>
        <div>
          <p>Username</p>
          <p className="font-bold text-[20px]">@username</p>
        </div>
        <div>
          <p>Bio</p>
          <p className="font-bold text-[20px]">
            Some textsadsadsadkosapdkpoasd...
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
