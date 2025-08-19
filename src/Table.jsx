import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Checkbox,
  IconButton,
  Toolbar,
  Typography,
  Tooltip,
  TablePagination,
  FormControlLabel,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { alpha } from "@mui/material/styles";


const getHeadCells = (columnOrder) => {
  if (columnOrder === "en-de") {
    return [
      { id: "enWords", label: "English" },
      { id: "deWords", label: "German" },
      { id: "edit", label: "Edit" },
      { id: "delete", label: "Delete" },
    ];
  } else {
    return [
      { id: "deWords", label: "German" },
      { id: "enWords", label: "English" },
      { id: "edit", label: "Edit" },
      { id: "delete", label: "Delete" },
    ];
  }
};
 

// Sort helpers
function descendingComparator(a, b, orderBy) {
  return b[orderBy].localeCompare(a[orderBy]);
}
function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Table header
function EnhancedTableHead({ order, orderBy, onRequestSort, columnOrder }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox disabled />
        </TableCell>
        {getHeadCells(columnOrder).map((headCell) => (
          <TableCell key={headCell.id} sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

// Toolbar
function EnhancedTableToolbar({ numSelected, onDeleteSelected }) {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: "1 1 100%" }} color="inherit" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: "1 1 100%" }} variant="h6">
          Glossary
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete Selected">
          <IconButton onClick={onDeleteSelected}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list (future)">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

// Main table component
export default function GlossaryTable({ data, setData, search, searchLang, columnOrder }) {
  const [selected, setSelected] = React.useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("enWords");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [dense, setDense] = React.useState(false);

  // Edit dialog state
  const [editIndex, setEditIndex] = React.useState(null);
  const [editForm, setEditForm] = React.useState({ en: "", de: "" });
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    const lowered = search.toLowerCase();

    const filtered = data.filter((entry) => {
      if (!search) return true;

      if (searchLang === "all") {
        return ["en", "de"].some((lang) =>
          entry[lang]?.some(({ word }) => word.toLowerCase().includes(lowered))
        );
      }

      return entry[searchLang]?.some(({ word }) =>
        word.toLowerCase().includes(lowered)
      );
    });

    setFilteredData(filtered);
  }, [data, search, searchLang]);

  const dataRows = React.useMemo(() => {
    return filteredData.map((entry, idx) => ({
      id: idx + 1,
      enWords: entry.en.map((e) => e.word).join(", "),
      deWords: entry.de.map((d) => d.word).join(", "),
    }));
  }, [filteredData]);

  const handleRequestSort = (_, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    const newSelected =
      selectedIndex === -1
        ? [...selected, id]
        : selected.filter((selId) => selId !== id);
    setSelected(newSelected);
  };

  const isSelected = (id) => selected.includes(id);

  const handleDeleteRow = (id) => {
    setData((prev) => prev.filter((_, i) => i !== id - 1));
    setSelected((prev) => prev.filter((selId) => selId !== id));
  };

  const handleDeleteSelected = () => {
    setData((prev) => prev.filter((_, i) => !selected.includes(i + 1)));
    setSelected([]);
  };

  const handleEditRow = (id) => {
    const index = id - 1;
    const row = data[index];
    setEditIndex(index);
    setEditForm({
      en: row.en.map((e) => e.word).join(", "),
      de: row.de.map((d) => d.word).join(", "),
    });
  };

  const handleSaveEdit = () => {
    const updated = [...data];
    updated[editIndex] = {
      en: editForm.en.split(",").map((word) => ({ word: word.trim() })),
      de: editForm.de.split(",").map((word) => ({ word: word.trim() })),
    };
    setData(updated);
    setEditIndex(null);
  };

  const visibleRows = React.useMemo(() => {
    return [...dataRows]
      .sort(getComparator(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [dataRows, order, orderBy, page, rowsPerPage]);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          onDeleteSelected={handleDeleteSelected}
        />
        <TableContainer style={{ maxHeight: 600 }}>
          <Table stickyHeader size={dense ? "small" : "medium"}>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              columnOrder = {columnOrder}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                    <TableCell>{row.enWords}</TableCell>
                    <TableCell>{row.deWords}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditRow(row.id)}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDeleteRow(row.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={dataRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={(e) => setDense(e.target.checked)} />}
        label="Dense padding"
      />

      {/* Modal Edit Dialog */}
      <Dialog open={editIndex !== null} onClose={() => setEditIndex(null)} fullWidth>
        <DialogTitle>Edit Entry</DialogTitle>
        <DialogContent className="flex flex-col gap-4" sx={{ pt: 4 }}>
          <TextField
            label="English"
            value={editForm.en}
            onChange={(e) => setEditForm({ ...editForm, en: e.target.value })}
            fullWidth
          />
          <TextField
            label="German"
            value={editForm.de}
            onChange={(e) => setEditForm({ ...editForm, de: e.target.value })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditIndex(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

GlossaryTable.propTypes = {
  data: PropTypes.array.isRequired,
  setData: PropTypes.func.isRequired,
};
