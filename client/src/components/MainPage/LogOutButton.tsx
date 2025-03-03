import { LogOut } from "lucide-react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";

export default function LogOutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-white text-black font-medium p-3 rounded-lg shadow-lg transition hover:text-white hover:bg-accent flex gap-2 justify-center items-center cursor-pointer"
    >
      Выйти
      <LogOut />
    </button>
  );
}
