import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Box,
} from "@mui/material";
import MultiFieldEditor from "./MultiFieldEditor";

const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

const EditDialog = ({ open, onClose, onSave, editForm, setEditForm }) => {
  const [tempForm, setTempForm] = useState({ en: [], de: [] });

  // On open, make a fresh copy of editForm for temporary edits
  useEffect(() => {
    if (open) {
      setTempForm(deepClone(editForm));
    }
  }, [open, editForm]);

  const handleWordsChange = (lang, val) => {
    setTempForm((prev) => ({ ...prev, [lang]: val }));
  };

  const handleCancel = () => {
    // Discard temporary edits and close dialog
    setTempForm(deepClone(editForm));
    onClose();
  };

  const handleFinalSave = async () => {
    const cleaned = {
      en: tempForm.en
        .map((w) => ({
          ...w,
          word: w.word.trim(),
          comment: w.comment?.trim() || "",
        }))
        .filter((w) => w.word),
      de: tempForm.de
        .map((w) => ({
          ...w,
          word: w.word.trim(),
          comment: w.comment?.trim() || "",
        }))
        .filter((w) => w.word),
    };

    // Commit cleaned data to parent
    setEditForm(cleaned);

    // Perform API call
    await onSave(cleaned);

    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="lg">
      <DialogTitle>Edit Entry</DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            gap: 2,
            alignItems: "stretch",
          }}
        >
          {/* English editor */}
          <Box sx={{ flex: 1 }}>
            <MultiFieldEditor
              label="English"
              words={tempForm.en}
              onChange={(val) => handleWordsChange("en", val)}
              scrollToBottom={open}
            />
          </Box>

          {/* Divider */}
          <Divider orientation="vertical" flexItem />

          {/* German editor */}
          <Box sx={{ flex: 1 }}>
            <MultiFieldEditor
              label="German"
              words={tempForm.de}
              onChange={(val) => handleWordsChange("de", val)}
              scrollToBottom={open}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button variant="contained" onClick={handleFinalSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
