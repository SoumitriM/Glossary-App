import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";
import { FileDown, Pencil, Trash2 } from "lucide-react";
import { Save, Add } from "@mui/icons-material";
import initialData from "./assets/glossary_bilingual.json";
import GlossaryTable from "./GlossTable";
import AddDialog from "./AddDialog";

export default function Glossary() {
  const [columnOrder, setColumnOrder] = useState("de-en");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({ en: "", de: "" });
  const [data, setData] = useState([]);
  const [fromLang, setFromLang] = useState("en");
  const [toLang, setToLang] = useState("de");
  const [search, setSearch] = useState("");
  const [searchLang, setSearchLang] = useState("en");

  useEffect(() => {
    setData([...initialData]);
  }, []);

  const handleAdd = () => {
    if (form.en && form.de) {
      const newEntry = {
        en: [{ word: form.en, comment: null }],
        de: [{ word: form.de, comment: null }],
      };
      if (editIndex !== null) {
        const updated = [...data];
        updated[editIndex] = newEntry;
        setData(updated);
      } else {
        setData([...data, newEntry]);
        console.log("Added new entry:", newEntry);
      }
      setForm({ en: "", de: "" });
      setDialogOpen(false);
      setEditIndex(null);
    }
  };

  const handleDelete = (index) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      setData(data.filter((_, i) => i !== index));
    }
  };

  const handleEdit = (index) => {
    const entry = data[index];
    setForm({
      en: entry.en[0].word,
      de: entry.de[0].word,
    });
    setEditIndex(index);
    setDialogOpen(true);
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "glossary.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box maxWidth="xl" mx="auto">
      <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} justifyContent="space-between" gap={4} mb={6}>
        <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2}>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={search}
            sx={{ minWidth: 400 }}
            onChange={(e) => setSearch(e.target.value)}
          />

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Lang</InputLabel>
            <Select
              label="Lang"
              value={searchLang}
              onChange={(e) => setSearchLang(e.target.value)}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="de">German</MenuItem>
              <MenuItem value="all">All</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box display="flex" gap={2} height="56px">
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setDialogOpen(true)}
            sx={{
              height: '100%',
              minWidth: 160,
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
            }}
          >
            Add Word
          </Button>

          <Button
            variant="outlined"
            startIcon={<FileDown />}
            onClick={exportData}
            sx={{
              height: '100%',
              minWidth: 160,
              borderColor: '#1976d2',
              color: '#1976d2',
              '&:hover': {
                backgroundColor: '#e3f2fd',
                borderColor: '#1565c0',
                color: '#1565c0',
              },
            }}
          >
            Export
          </Button>
        </Box>
      </Box>

      <Box mb={4} display="flex" alignItems="flex-start" gap={2}>
        {/* <Typography variant="body1" fontWeight={500} mt={2}>
          Glossary Direction:
        </Typography> */}
        <FormControl>
          <Select
            value={columnOrder}
            onChange={(e) => setColumnOrder(e.target.value)}
            sx={{ width: 220 }}
          >
            <MenuItem value="en-de">English → German</MenuItem>
            <MenuItem value="de-en">German → English</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box overflow="auto">
        <GlossaryTable
          data={data}
          setData={setData}
          searchLang={searchLang}
          search={search}
          columnOrder={columnOrder}
        />
      </Box>

      <AddDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        form={form}
        setForm={setForm}
        handleAdd={handleAdd}
        fromLang={fromLang}
        setFromLang={setFromLang}
        toLang={toLang}
        setToLang={setToLang}
        editIndex={editIndex}
      />
    </Box>
  );
}
