import { useState, useMemo } from "react";
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
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { alpha } from "@mui/material/styles";
import EditDialog from "./EditDialog";
import ConfirmDialog from "./ConfirmDialog";

const getHeadCells = (columnOrder) =>
  columnOrder === "en-de"
    ? [
      { id: "enWords", label: "English" },
      { id: "deWords", label: "Deutsch" },
      { id: "edit", label: "Edit" },
      { id: "delete", label: "Delete" },
    ]
    : [
      { id: "deWords", label: "Deutsch" },
      { id: "enWords", label: "English" },
      { id: "edit", label: "Edit" },
      { id: "delete", label: "Delete" },
    ];

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
  const createSortHandler = (property) => (event) => onRequestSort(event, property);

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox disabled />
        </TableCell>
        {getHeadCells(columnOrder).map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
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
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: "1 1 100%" }} color="inherit" variant="subtitle1">
          {numSelected} Row/s selected
        </Typography>
      ) : (
        <Typography sx={{ flex: "1 1 100%" }} variant="h6">
          Glossary
        </Typography>
      )}

      {numSelected > 1 ? (
        <Tooltip title={`Delete ${numSelected} selectedRows rows`}>
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

// Main component
export default function GlossaryTable({ data, columnOrder, handleDeleteRow, handleDeleteSelected, handleFinalEdit }) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [order, setOrder] = useState(null);
  const [orderBy, setOrderBy] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [editIndex, setEditIndex] = useState(null);
  const [editForm, setEditForm] = useState({});

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteMode, setDeleteMode] = useState(null);

  {/* variable to display words in comma separated format */ }
  const dataRows = useMemo(
    () =>
      data.map((entry) => ({
        id: entry.id,
        enWords: entry.en.map((e) => e.word).join(", "),
        deWords: entry.de.map((d) => d.word).join(", "),
        en: entry.en,
        de: entry.de,
      })),
    [data]
  );

  {/* function to sort columns */ }
  const handleRequestSort = (_, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  {/* function to append selected row IDs */ }
  const handleRowSelection = (id) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selId) => selId !== id)
        : [...prevSelected, id]
    );
  };

  {/* function to check if a row is selected */ }
  const isSelected = (id) => selectedRows.includes(id);

  {/* select the row data and open the dialog */ }
  const handleEditRow = (row) => {
    setEditIndex(row.id);
    setEditForm({
      ...row
    });
    setOpenEditDialog(true);
  };

  {/* function to save edited row */ }
  const handleSaveEdit = async () => {

    const updatedItem = {
      en: editForm.en,
      de: editForm.de,
    };
    console.log(updatedItem)
    handleFinalEdit(updatedItem, editIndex);
    setOpenConfirmDialog(false);
  };

  {/* function to show specific number of rows per page */ }
  const visibleRows = useMemo(() => {
    let rows = [...dataRows];

    // only sort after user clicks a column
    if (orderBy && order) {
      rows = rows.sort(getComparator(order, orderBy));
    }

    return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [dataRows, order, orderBy, page, rowsPerPage]);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selectedRows.length}
          onDeleteSelected={() => {
            setDeleteMode("bulk");
            setOpenDeleteDialog(true);
          }}
        />
        <TableContainer>
          <Table size="small">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              columnOrder={columnOrder}
            />
            <TableBody>
              {visibleRows.map((row) => {
                const isItemSelected = isSelected(row.id);
                return (
                  <TableRow hover key={row.id} role="checkbox" selected={isItemSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={() => handleRowSelection(row.id)}
                      />
                    </TableCell>

                    {/* dynamically render cells based on columnOrder */}
                    {getHeadCells(columnOrder).map((headCell) => {
                      if (headCell.id === "edit") {
                        return (
                          <TableCell key="edit">
                            <IconButton onClick={() => handleEditRow(row)}>
                              <EditIcon />
                            </IconButton>
                          </TableCell>
                        );
                      }

                      if (headCell.id === "delete") {
                        return (
                          <TableCell key="delete">
                            <IconButton
                              onClick={() => {
                                setRowToDelete(row.id);
                                setDeleteMode("single");
                                setOpenDeleteDialog(true);
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        );
                      }
                      // render enWords or deWords dynamically
                      return <TableCell key={headCell.id}>{row[headCell.id]}</TableCell>;
                    })}
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
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Dialog to add a new entry in the glossary */}
      <EditDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        onSave={() => {
          setOpenEditDialog(false);
          setOpenConfirmDialog(true);
        }}
        editForm={editForm}
        setEditForm={setEditForm}
      />
      {/* Confirm  Dialog  to save changes*/}
      <ConfirmDialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        onConfirm={handleSaveEdit}
      />

      {/* Confirm  Dialog to  delete rows */}
      <ConfirmDialog
        open={openDeleteDialog}
        primaryBtnText="Delete"
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={() => {
          if (deleteMode === "single") handleDeleteRow(rowToDelete);
          else if (deleteMode === "bulk") handleDeleteSelected(selectedRows);
          setSelectedRows([]);
          setOpenDeleteDialog(false);
        }}
        title="Confirm Delete"
        message={`Are you sure you want to delete ${deleteMode === "single" ? "this entry" : `${selectedRows.length} entries`
          }?`}
      />
    </Box>
  );
}
