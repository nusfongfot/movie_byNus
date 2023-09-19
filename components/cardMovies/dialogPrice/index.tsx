import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Stack, TextField, Typography } from "@mui/material";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPrice: React.Dispatch<React.SetStateAction<string>>;
  price: string;
  setCarts: React.Dispatch<React.SetStateAction<any[]>>;
  carts: any[];
  priceInCart: any;
};

export default function AlertDialog({
  open,
  setOpen,
  price,
  setPrice,
  carts,
  setCarts,
  priceInCart,
}: Props) {
  const handleClose = () => {
    setOpen(false);
    setPrice("");
  };
  const handleCickAddPrice = () => {
    setOpen(false);
    if (price) {
      priceInCart.price = price;
      const save = [priceInCart, ...carts];
      localStorage.setItem("movies", JSON.stringify(save));
      setCarts([priceInCart, ...carts]);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box p={2}>
        <Typography variant="h5" align="center" mb={2}>
          Add a price
        </Typography>
        <TextField
          size="small"
          fullWidth
          type="number"
          value={price}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => setPrice(e.target.value)}
        />
        <Stack flexDirection={"row"} gap={2} mt={2}>
          <Button onClick={handleClose} variant="contained" color="error">
            Cancel
          </Button>
          <Button onClick={handleCickAddPrice} autoFocus variant="contained">
            Confirm
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}
