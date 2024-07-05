import { getProviders, signIn } from "next-auth/react";
import { useState } from "react";

const LogInPage = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      identifier,
      password,
      redirect: false,
    });

    if (res?.error) {
      alert(res.error);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="mt-[90px] w-full flex flex-col items-center justify-center">
      <div className="w-fit">
        <h1 className="text-[30px] font-semibold text-center">Login</h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center mt-[50px]"
        >
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            name="email"
            placeholder="Email or Username"
            required
            className="px-[20px] py-[12px] w-[400px] rounded-xl text-white bg-white/10 hover:bg-white/20 focus:bg-white/20 transition duration-200 ease-in-out outline-none"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            placeholder="Password"
            required
            className="px-[20px] py-[12px] w-[400px] rounded-xl text-white bg-white/10 hover:bg-white/20 focus:bg-white/20 transition duration-200 ease-in-out outline-none"
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}

export default LogInPage;
