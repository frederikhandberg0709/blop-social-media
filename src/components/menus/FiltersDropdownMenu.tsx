import DropdownButton from "../buttons/DropdownButton";
import { Clock, Filter, TrendingUp } from "lucide-react";

const FiltersDropdownMenu = () => {
  const filterOptions = [
    {
      label: "Recent",
      onClick: () => handleFilterChange("recent"),
      icon: <Clock className="h-4 w-4" />,
    },
    {
      label: "Recommended",
      onClick: () => handleFilterChange("recommended"),
      icon: <Filter className="h-4 w-4" />,
    },
    {
      label: "Trending",
      onClick: () => handleFilterChange("trending"),
      icon: <TrendingUp className="h-4 w-4" />,
    },
  ];

  const handleFilterChange = (filter: string) => {};

  return (
    <DropdownButton
      variant="ghost"
      align="right"
      width="w-56"
      options={filterOptions}
    >
      Filters
    </DropdownButton>
  );
};

export default FiltersDropdownMenu;
