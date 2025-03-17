import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useDeleteRequestMutation } from "../../api/apiHandler";
import { toast } from "react-toastify";

function DeleteDonor({
  open,
  onClose,
  slug,
  id,
}: {
  open: boolean;
  onClose: (
    event: React.SyntheticEvent | MouseEvent,
    reason?: "backdropClick" | "escapeKeyDown"
  ) => void;
  slug: string;
  id: string;
}) {
  const [deleteDonor] = useDeleteRequestMutation();
  async function handleDelete(slug: string, id: string) {
    await deleteDonor(`${slug}/${id}`)
      .unwrap()
      .then(() => {
        toast.success("Sucessfully Deleted");
      })
      .catch((error) => {
        toast.error(`Failed to delete ${error} `);
      });
  }
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <div className="p-4">
        <DialogTitle id="alert-dialog-title">
          <span className="text-2xl font-semibold leading-6 font-[Poppins]">
            Delete this record?
          </span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <span className="text-lg font-medium leading-5 font-[Poppins]">
              Are you sure you want to delete this record? It won't be retrieved
              once deleted.
            </span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            <span className="text-[#00CFE8] text-md font-medium font-[Poppins]">
              Cancel
            </span>
          </Button>
          <Button
            onClick={() => {
              onClose(new MouseEvent("click"), "backdropClick");
              handleDelete(slug, id);
            }}
            autoFocus
          >
            <button className="bg-[#EA5455] flex justify-center items-center px-6 py-1 rounded-md">
              <span className="text-white text-lg font-medium font-[Poppins]">
                Delete
              </span>
            </button>
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
}

export default DeleteDonor;
