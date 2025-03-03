import { getServerSession } from "next-auth";
import LinkAccountForm from "./LinkAccountForm";
import { redirect } from "next/navigation";

export default async function LinkAccount() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="mt-[150px] flex flex-col items-center justify-center">
      <h1 className="text-center text-3xl font-semibold">Link New Account</h1>
      <p className="text-primaryGray">
        Link your accounts to easily switch between them in an instant.
      </p>
      <LinkAccountForm />
    </div>
  );
}
