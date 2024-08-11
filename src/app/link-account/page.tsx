import LinkAccountForm from "./LinkAccountForm";

export default function LinkAccount() {
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
