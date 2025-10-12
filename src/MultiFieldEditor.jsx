import { useRef, useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const MultiFieldEditor = ({
  label,
  wordEntries = [{ word: "", comment: "" }],
  onChange,
  scrollToBottom,
}) => {
  const containerRef = useRef(null);
  const [commentDialog, setCommentDialog] = useState({
    open: false,
    idx: null,
    tempComment: "",
  });

  const handleWordChange = (idx, newValue) => {
    const updated = [...wordEntries];
    updated[idx].word = newValue;
    onChange(updated);
  };

  const handleAdd = () => {
    const updated = [...wordEntries, { word: "", comment: "" }];
    onChange(updated);
    setTimeout(() => {
      containerRef.current?.lastElementChild?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 50);
  };

  const handleRemove = (idx) => {
    const updated = wordEntries.filter((_, i) => i !== idx);
    onChange(updated);
  };

  const handleOpenComment = (idx) => {
    const existingComment = wordEntries[idx].comment || "";
    setCommentDialog({ open: true, idx, tempComment: existingComment });
  };

  const handleCloseComment = () => {
    setCommentDialog({ open: false, idx: null, tempComment: "" });
  };

  const handleSaveComment = () => {
    const { idx, tempComment } = commentDialog;
    if (idx !== null) {
      const updated = [...wordEntries];
      updated[idx].comment = tempComment;
      onChange(updated);
    }
    handleCloseComment();
  };

  // Scroll when new items added
  useEffect(() => {
    if (scrollToBottom && containerRef.current?.lastElementChild) {
      setTimeout(() => {
        containerRef.current.lastElementChild.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 50);
    }
  }, [scrollToBottom]);

  return (
    <Box
      ref={containerRef}
      sx={{
        mb: 3,
        height: 400,
        maxHeight: 400,
        overflowY: "auto",
        borderRadius: 2,
        border: "1px solid #e0e0e0",
        bgcolor: "#fafafa",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          backgroundColor: "white",
          zIndex: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 1.2,
          borderBottom: "1px solid #ddd",
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          {label}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {wordEntries.filter((w) => w.word.trim() !== "").length} words
        </Typography>
      </Box>

      {/* Word List */}
      <Box sx={{ p: 1.5 }}>
        {wordEntries.map((entry, idx) => {
          const hasComment = entry.comment?.trim();

          return (
            <Box
              key={`${label}-${idx}`}
              sx={{
                mb: 1.5,
                border: "1px solid #eaeaea",
                borderRadius: 2,
                p: 1.2,
                bgcolor: "white",
                boxShadow: "0 0 3px rgba(0,0,0,0.04)",
              }}
            >
              {/* entry + Actions */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <TextField
                  label="Word"
                  size="small"
                  variant="outlined"
                  sx={{ flex: "0 0 60%" }}
                  value={entry.word}
                  placeholder="Type a word..."
                  onChange={(e) => handleWordChange(idx, e.target.value)}
                 slotProps={{ inputLabel: { shrink: true } }}

                />

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: entry.word.trim()
                        ? "#1976d2"
                        : "text.disabled",
                      cursor: entry.word.trim() ? "pointer" : "not-allowed",
                      "&:hover": entry.word.trim()
                        ? { textDecoration: "underline" }
                        : {},
                      opacity: entry.word.trim() ? 1 : 0.6,
                      pointerEvents: entry.word.trim() ? "auto" : "none",
                      userSelect: "none",
                      textTransform: "uppercase",
                    }}
                    onClick={() => entry.word.trim() && handleOpenComment(idx)}
                  >
                    {hasComment ? "EDIT COMMENT" : "ADD COMMENT"}
                  </Typography>

                  <DeleteIcon
                    onClick={() => handleRemove(idx)}
                    sx={{
                      fontSize: 20,
                      cursor: "pointer",
                      color: "action.active",
                      opacity: 0.7,
                      "&:hover": { opacity: 1 },
                    }}
                  />
                </Box>
              </Box>

              {/* Comment Display */}
              {hasComment && (
                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.8,
                    ml: 0.3,
                    fontStyle: "italic",
                    fontSize: "0.85rem",
                    color: "#444",
                  }}
                >
                  <strong>Comment:</strong> {entry.comment}
                </Typography>
              )}
            </Box>
          );
        })}

        <Button
          startIcon={<AddIcon />}
          onClick={handleAdd}
          variant="outlined"
          sx={{ mt: 1 }}
        >
          Add More
        </Button>
      </Box>

      {/* Comment Dialog */}
      <Dialog
        open={commentDialog.open}
        onClose={handleCloseComment}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Edit comment for the word "
          {commentDialog.idx !== null ? wordEntries[commentDialog.idx].word : ""}"
        </DialogTitle>

        <DialogContent>
          <TextField
            multiline
            minRows={4}
            fullWidth
            variant="outlined"
            placeholder="Enter your comment..."
            value={commentDialog.tempComment}
            onChange={(e) =>
              setCommentDialog((prev) => ({
                ...prev,
                tempComment: e.target.value,
              }))
            }
            sx={{ mt: 2 }}
          />
        </DialogContent>

        <DialogActions sx={{px: 3, pb: 3}}>
          <Button onClick={handleCloseComment}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveComment}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MultiFieldEditor;
