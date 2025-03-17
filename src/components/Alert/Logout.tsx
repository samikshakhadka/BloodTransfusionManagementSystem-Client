import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../store/auth";
import { useAppDispatch } from "../../utils/hooks";

function LogoutAlert({
  open,
  onClose,
}: {
  open: boolean;
  onClose: (
    event: React.SyntheticEvent | MouseEvent,
    reason?: "backdropClick" | "escapeKeyDown"
  ) => void;
}) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogOut = async () => {
    try {
      dispatch(logoutUser());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <span className="text-2xl font-semibold leading-6 font-[Poppins]">
          You are logging out!
        </span>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <span className="text-lg font-medium leading-5 font-[Poppins]">
            Are you sure you want to logout? Some unsaved changes may be lost.
          </span>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          <span className="text-[#00CFE8] text-lg font-medium font-[Poppins]">
            Cancel
          </span>
        </Button>
        <Button
          onClick={() => {
            onClose(new MouseEvent("click"), "backdropClick");
            handleLogOut();
          }}
          autoFocus
        >
          <button className="bg-[#EA5455] flex justify-center items-center px-6 py-1 rounded-md">
              <span className="text-white text-lg font-medium font-[Poppins]">
                Log Out
              </span>
            </button>
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LogoutAlert;
