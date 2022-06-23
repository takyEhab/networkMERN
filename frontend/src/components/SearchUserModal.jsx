import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Search from "./SearchUser";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function SearchUserModal(props) {
  const handleCloseModel = () => props.setOpenModel(false);

  return (
    <>
      <Modal
        open={props.openModel}
        onClose={props.handleCloseModel}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Search for a USER
          </Typography>
          <div id="modal-modal-description" sx={{ mt: 2 }}>
            <Search closeModel={handleCloseModel} />
          </div>
        </Box>
      </Modal>
    </>
  );
}
