import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, IconButton
} from "@mui/material";
import { Save, SwapHoriz } from "@mui/icons-material";

const AddDialog = ({
  dialogOpen, setDialogOpen, form, setForm, handleAdd, fromLang, setFromLang, toLang, setToLang, editIndex, setEditIndex
}) => {
  const languages = [
    { code: "en", label: "English" },
    { code: "de", label: "German" },
    // { code: "es", label: "Spanish" },
    // { code: "fr", label: "French" },
    // Add more as needed
  ];

  return (
  <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}
   fullWidth>
    <DialogTitle>{editIndex !== null ? "Edit Word" : "Add Word"}</DialogTitle>

    <DialogContent className="flex flex-col gap-4 mt-4 pt-4" sx={{
      height: "500px",
      pt: '32px !important', // Force override
      px: 4, // Optional: add horizontal padding too
  }}>
      {/* Language selection with swap button */}
      <div className="flex items-center gap-2">
        <TextField
          select
          label="From"
          value={fromLang}
          onChange={(e) => {
            const newFrom = e.target.value;
            if (newFrom === toLang) {
              setFromLang(toLang);
              setToLang(fromLang);
              setForm({ ...form, [newFrom]: form[toLang], [toLang]: form[newFrom] });
            } else {
              setFromLang(newFrom);
            }
          }}
          className="flex-1"
        >
          {languages.map((lang) => (
            <MenuItem key={lang.code} value={lang.code}>
              {lang.label}
            </MenuItem>
          ))}
        </TextField>

        <IconButton onClick={() => {
          const temp = fromLang;
          setFromLang(toLang);
          setToLang(temp);
          setForm({ en: form.de, de: form.en }); // swap values too
        }}>
          <SwapHoriz />
        </IconButton>

        <TextField
          select
          label="To"
          value={toLang}
          onChange={(e) => {
            const newTo = e.target.value;
            if (newTo === fromLang) {
              setToLang(fromLang);
              setFromLang(toLang);
              setForm({ ...form, [newTo]: form[fromLang], [fromLang]: form[newTo] });
            } else {
              setToLang(newTo);
            }
          }}
          className="flex-1"
        >
          {languages.map((lang) => (
            <MenuItem key={lang.code} value={lang.code}>
              {lang.label}
            </MenuItem>
          ))}
        </TextField>
      </div>

      {/* Input fields for the words */}
      <div className="flex gap-4">
        <TextField
          label={languages.find(l => l.code === fromLang)?.label || "From"}
          fullWidth
          value={form[fromLang]}
          onChange={(e) => setForm({ ...form, [fromLang]: e.target.value })}
        />
        <TextField
          label={languages.find(l => l.code === toLang)?.label || "To"}
          fullWidth
          value={form[toLang]}
          onChange={(e) => setForm({ ...form, [toLang]: e.target.value })}
        />
      </div>
    </DialogContent>

    <DialogActions>
      <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
      <Button variant="contained" startIcon={<Save />} onClick={handleAdd}>
        Save
      </Button>
    </DialogActions>
  </Dialog>)
}

export default AddDialog;