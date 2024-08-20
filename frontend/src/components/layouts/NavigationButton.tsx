import { FC } from "react";
import { Link } from "react-router-dom";

interface NavigationButtonProps {
  path: string;
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

const NavigationButton: FC<NavigationButtonProps> = ({
  path,
  label,
  icon,
  isActive = false,
}) => {
  return (
    <Link
      to={path}
      className={`${
        isActive ? "text-primary" : "text-black"
      } text-lg flex items-center gap-3 hover:bg-blue-200 hover:text-primary py-3 px-4`}
    >
      <span className="text-xl">{icon}</span>
      <p className="text-lg">{label}</p>
    </Link>
  );
};

export default NavigationButton;
