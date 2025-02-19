import ThemeDropdown from "@/components/ThemeDropdown";

const Appearance: React.FC = () => {
  return (
    <div>
      <h1 className="text-[25px] font-bold">Appearance</h1>
      <div>
        <h2 className="mt-4 text-[20px] font-semibold">Theme</h2>
        <p className="mt-2">
          Select your preferred theme. Light mode offers a brighter interface,
          while dark mode provides a more subdued, eye-friendly alternative.
        </p>
        <div className="mt-5">
          <ThemeDropdown />
        </div>
      </div>
    </div>
  );
};

export default Appearance;
