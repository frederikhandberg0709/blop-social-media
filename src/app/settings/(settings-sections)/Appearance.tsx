const Appearance: React.FC = () => {
  return (
    <div>
      <h1 className="font-bold text-[25px]">Appearance</h1>
      <div>
        <h2 className="font-semibold text-[20px] mt-4">Theme</h2>
        <p className="text-white mt-2">
          Select your preferred theme. Light mode offers a brighter interface,
          while dark mode provides a more subdued, eye-friendly alternative.
        </p>
      </div>
      <div>
        <h2 className="font-semibold text-[20px] mt-4">Accent Color</h2>
        <p className="text-white mt-2">
          Choose an accent color to personalize the look and feel of your
          interface. This color will be used for highlights and other prominent
          elements.
        </p>
      </div>
    </div>
  );
};

export default Appearance;
