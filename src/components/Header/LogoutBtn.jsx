import authService from "../../appwrite/auth";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";

function LogoutBtn() {
  const dispatch = useDispatch();
  const logoutHandler = () => {
    authService.logout().then(() => dispatch(logout()));
  };
  return (
    <button onClick={logoutHandler} className="cursor-pointer text-sm font-semibold underline-offset-4 hover:text-accent hover:underline">
      Logout
    </button>
  );
}

export default LogoutBtn;