import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

export default function ConfirmSaveDialog({
  open,
  onConfirm,
  onClose,
  title="Confirm Changes",
  message = "Are you sure you want to save the changes?",
  primaryBtnText = "Save",
  secondaryBtnText = "Cancel",
}) {
  const handleConfirm = () => {
    onConfirm?.();
    console.log("Changes saved!");
    onClose?.();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { width: 400 }, // custom width
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {secondaryBtnText}
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          {primaryBtnText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
