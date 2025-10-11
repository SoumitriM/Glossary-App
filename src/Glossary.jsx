import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,

} from "@mui/material";
import { FileDown } from "lucide-react";
import { Add } from "@mui/icons-material";
import GlossaryTable from "./Table";
import EditDialog from "./EditDialog";

export default function Glossary() {
  const [columnOrder, setColumnOrder] = useState("de-en");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [searchLang, setSearchLang] = useState("all");

  const fetchData = () => {
    if (search !== "") {
      fetch("http://localhost:3001/api/glossary/search?q=" + search + "&lang=" + searchLang)
        .then((res) => res.json())
        .then((json) => {
          setData(json);
        })
    } else fetch("http://localhost:3001/api/glossary")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
      })
      .catch((err) => {
        console.error("Failed to fetch glossary:", err);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchFilteredData = async () => {
      const response = await fetch(`http://localhost:3001/api/glossary/search?q=${search}&lang=${searchLang}`);
      const result = await response.json();
      setData(result);
    };
    fetchFilteredData();
  }, [search, searchLang]);

  const handleDeleteRow = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/glossary/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete item");
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteSelected = async (ids) => {
    if (!ids || ids.length === 0) return;

    try {
      const response = await fetch("http://localhost:3001/api/glossary/delete-multiple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }), // sending { ids: ["id1","id2",...] }
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log(result.message);

      fetchData();

    } catch (error) {
      console.error("Failed to delete rows:", error);
    }
  };


  const handleFinalEdit = async (updatedItem, id) => {
    console.log("Updating item with ID:", id, "to", updatedItem);
    try {
      const response = await fetch(`http://localhost:3001/api/glossary/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      });
      if (!response.ok) throw new Error("Failed to update item");
      const data = await response.json();
      console.log("Updated item:", data.item);
      fetchData(); // Refresh data after update
      return data.item;
    } catch (error) {
      console.error(error);
    }
  };


  const handleAdd = async (updatedItem) => {
  console.log("Adding new item:", updatedItem);
  try {
    const response = await fetch(`http://localhost:3001/api/glossary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedItem),
    });

    const data = await response.json(); // Parse response no matter what

    if (!response.ok) {
      // Instead of throwing, return the server error so the dialog can display it
      console.warn("Server returned error:", data);
      return data; // <- IMPORTANT: return error object to EditDialog
    }

    console.log("Added item:", data.item);
    // setForm({ en: "", de: "" });
    fetchData(); // refresh list
    setDialogOpen(false);
    return null; // success → no error
  } catch (error) {
    console.error("Network or unexpected error:", error);
    // Return a consistent error object so the dialog can show it too
    return { message: error.message || "Unexpected error occurred" };
  }
};



  const exportData = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/glossary/export");
      if (!response.ok) throw new Error("Failed to export data");

      // Convert response to blob for download
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "glossary_bilingual.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log("Export successful");
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  return (
    <Box maxWidth="xl" mx="auto">
      <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} justifyContent="space-between" gap={4}>
        <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2}>
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

        <Box display="flex" gap={2} height="56px">
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={search}
            sx={{ minWidth: 400 }}
            onChange={(e) => setSearch(e.target.value)}
          />
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

      <Box overflow="auto">
        <GlossaryTable
          data={data}
          setData={setData}
          searchLang={searchLang}
          search={search}
          columnOrder={columnOrder}
          handleDeleteRow={handleDeleteRow}
          handleDeleteSelected={handleDeleteSelected}
          handleFinalEdit={handleFinalEdit}
        />
      </Box>

      {/* <AddDialog
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
      /> */}
      <EditDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleAdd}
      />
    </Box>
  );
}
