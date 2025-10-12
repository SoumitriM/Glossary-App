const PORT = import.meta.env.VITE_PORT || 3001;

const BASE_URL = `${
  import.meta.env.VITE_PRODUCTION_ENV === "true"
    ? import.meta.env.VITE_PRODUCTION_URL
    : `http://localhost:${PORT}`
}/api/glossary`;

export const BASE_URLS = {
  BASE_URL,

  // Glossary Endpoints
  GET_ALL: `${BASE_URL}/getAll`,                 // GET all glossary entries
  GET_FIRST: `${BASE_URL}/first`,          // GET first entry
  ADD_ENTRY: `${BASE_URL}/create`,               // POST new glossary entry
  UPDATE_ENTRY: `${BASE_URL}/update`,            // PUT (append ID later)
  DELETE_ENTRY: `${BASE_URL}/delete`,            // DELETE (append ID later)
  DELETE_MULTIPLE: `${BASE_URL}/delete-multiple`, // POST multiple deletions
  EXPORT_JSON: `${BASE_URL}/export`,       // GET download JSON
  SEARCH: `${BASE_URL}/search`,            // GET search entries
};