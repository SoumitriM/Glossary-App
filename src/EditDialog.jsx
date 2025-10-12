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

const EditDialog = ({ open, formType="Edit",onClose, onSave, editForm, setEditForm = () => { } }) => {
  const [tempForm, setTempForm] = useState({ en: [{ word: "", comment: "" }], de: [{ word: "", comment: "" }] });
  const [error, setError] = useState({ isError: false, message: "" });

  // When dialog opens, make a fresh temporary copy
  useEffect(() => {
    if (open && editForm && editForm.en && editForm.de) {
      setTempForm(deepClone(editForm));
    }
  }, [open, editForm]);

  const handleWordsChange = (lang, updatedWords) => {
    setTempForm((prev) => ({ ...prev, [lang]: updatedWords }));
  };

  const handleCancel = () => {
    if (editForm && editForm.en && editForm.de) {
      setTempForm(deepClone(editForm));
    }
    else setTempForm({ en: [{ word: "", comment: "" }], de: [{ word: "", comment: "" }] });
    setError({ isError: false, message: "" });
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
        .filter((w) => w.word), // remove empty words
      de: tempForm.de
        .map((w) => ({
          ...w,
          word: w.word.trim(),
          comment: w.comment?.trim() || "",
        }))
        .filter((w) => w.word),
    };

    // ✅ Check if both en and de have at least one valid word
    if (cleaned.en.length === 0 || cleaned.de.length === 0) {
      setError({
        isError: true,
        message: "There should be at least one English and one Deutsch word.",
      });
      return;
    }

    // ✅ Check for duplicate words (within each language only)
    const hasDuplicate = (arr) => {
      const words = arr.map((w) => w.word.toLowerCase());
      return new Set(words).size !== words.length;
    };

    if (hasDuplicate(cleaned.en) || hasDuplicate(cleaned.de)) {
      setError({
        isError: true,
        message:
          "There are one or more duplicate words added. Please remove them before saving.",
      });
      return;
    }

    // ✅ If all good, continue saving
    console.log("Cleaned data to save:", cleaned);
    setEditForm(cleaned);
    const res = await onSave(cleaned);
    console.log("Save response:", res);

    if (res) {
      console.log("Error saving:", res);
      setError({ isError: true, message: res.message });
      return;
    }

    // ✅ Reset temp form and close
    setTempForm({
      en: [{ word: "", comment: "" }],
      de: [{ word: "", comment: "" }],
    });
    onClose();
  };



  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="lg">
      <DialogTitle>{formType} Entry</DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            gap: 2,
            alignItems: "stretch",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <MultiFieldEditor
              label="English"
              wordEntries={tempForm.en}
              onChange={(val) => handleWordsChange("en", val)}
              scrollToBottom={open}
            />
          </Box>

          <Divider orientation="vertical" flexItem />

          <Box sx={{ flex: 1 }}>
            <MultiFieldEditor
              label="Deutsch"
              wordEntries={tempForm.de}
              onChange={(val) => handleWordsChange("de", val)}
              scrollToBottom={open}
            />
          </Box>
        </Box>
        {error.isError && (
          <Box sx={{ color: "red", mt: 2 }}>
            *{error.message}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{px: 3, pb: 3}}>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button variant="contained" onClick={handleFinalSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
