import { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import type { SelectListItem } from "../../api/types/pagination";
interface SearchableModalSelectProps {
  label: string;
  value: string;
  options: SelectListItem[];
  error?: string;
  placeholder?: string;
  onChange: (val: string) => void;
}
export function SearchableModalSelect({
  label,
  value,
  options,
  error,
  placeholder,
  onChange,
}: SearchableModalSelectProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const selectedDisplayName = useMemo(() => {
    return (
      options.find((opt) => String(opt.id) === String(value))?.displayName || ""
    );
  }, [value, options]);
  const filteredOptions = useMemo(() => {
    return options.filter((opt) =>
      opt.displayName.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [options, searchQuery]);
  const handleSelect = (id: string | number) => {
    onChange(String(id));
    setIsModalOpen(false);
    setSearchQuery("");
  };
  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        label={label}
        value={selectedDisplayName}
        fullWidth
        error={!!error}
        helperText={error}
        placeholder={placeholder || `Select ${label}...`}
        autoComplete="off"
        onClick={() => setIsModalOpen(true)}
        InputProps={{
          readOnly: true,
          sx: { cursor: "pointer" },
        }}
      />
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fullWidth
        maxWidth="sm"
        scroll="paper"
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {label} Selection
          <IconButton onClick={() => setIsModalOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Box sx={{ px: 2, pb: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery("")}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <DialogContent dividers sx={{ p: 0, maxHeight: "400px" }}>
          <List>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <ListItem key={option.id} disablePadding>
                  <ListItemButton
                    selected={String(option.id) === String(value)}
                    onClick={() => handleSelect(option.id)}
                  >
                    <ListItemText primary={option.displayName} />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography color="text.secondary">No results found</Typography>
              </Box>
            )}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
