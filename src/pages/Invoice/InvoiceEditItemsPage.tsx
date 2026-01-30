import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  MenuItem,
  CircularProgress,
  Tooltip,
  IconButton,
  Divider,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import * as InvoiceService from "../../api/services/invoice.service";
import type {
  Invoice,
  InvoiceItemResponse,
} from "../../api/services/invoice.service";
import { AppointmentTypeService } from "../../api/services/appointmentType.service";
import {
  PriceListService,
  type PriceListItem,
} from "../../api/services/priceList.service";

// Local type for managing items with additional UI state
interface EditableInvoiceItem {
  id?: number;
  name: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  unit: string;
  isCustom: boolean;
  appointmentTypeId?: number;
}

export default function InvoiceEditItemsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [items, setItems] = useState<EditableInvoiceItem[]>([]);
  const [currency, setCurrency] = useState("PLN");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [appointmentTypes, setAppointmentTypes] = useState<
    { id: number; name: string; description: string }[]
  >([]);
  const [priceList, setPriceList] = useState<PriceListItem[]>([]);

  useEffect(() => {
    loadInvoiceAndOptions();
  }, [id]);

  const loadInvoiceAndOptions = async () => {
    if (!id) return;

    try {
      setLoadingData(true);
      const [invoiceRes, appointmentTypesRes, priceListRes] = await Promise.all(
        [
          InvoiceService.getById(Number(id)),
          AppointmentTypeService.getAll(),
          PriceListService.getAll(),
        ],
      );

      const invoiceData = invoiceRes.data;
      setInvoice(invoiceData);
      setCurrency(invoiceData.currency);

      const appointmentTypesData = appointmentTypesRes.data;
      const priceListData = priceListRes.data;

      // Convert invoice items to editable format
      if (invoiceData.items && invoiceData.items.length > 0) {
        const editableItems: EditableInvoiceItem[] = invoiceData.items.map(
          (item: InvoiceItemResponse) => {
            // Try to find matching appointment type by name
            const matchingType = appointmentTypesData.find(
              (type) => type.name === item.name,
            );

            if (matchingType) {
              // Check if price matches as well
              const priceItem = priceListData.find(
                (p) => p.appointmentTypeId === matchingType.id,
              );

              // If both name and price match, treat as appointment type
              if (
                priceItem &&
                Math.abs(priceItem.price - item.unitPrice) < 0.01
              ) {
                return {
                  id: item.id,
                  name: item.name,
                  quantity: item.quantity,
                  unitPrice: item.unitPrice,
                  vatRate: item.vatRate,
                  unit: item.unit,
                  isCustom: false,
                  appointmentTypeId: matchingType.id,
                };
              }
            }

            // Otherwise treat as custom
            return {
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              vatRate: item.vatRate,
              unit: item.unit,
              isCustom: true,
            };
          },
        );
        setItems(editableItems);
      } else {
        setItems([
          {
            name: "",
            quantity: 1,
            unitPrice: 0,
            vatRate: 23,
            unit: "usł",
            isCustom: true,
          },
        ]);
      }

      setAppointmentTypes(appointmentTypesData);
      setPriceList(priceListData);
    } catch (err) {
      setError("Failed to load invoice details");
    } finally {
      setLoadingData(false);
    }
  };

  const validateForm = () => {
    // Validate items
    const hasInvalidItems = items.some(
      (item) =>
        !item.name || item.quantity <= 0 || item.unitPrice < 0 || !item.unit,
    );

    if (hasInvalidItems) {
      setError("All items must have a name, valid quantity, price, and unit");
      return false;
    }

    if (items.length === 0) {
      setError("At least one item is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        vatRate: item.vatRate,
        unit: item.unit,
      }));

      await InvoiceService.updateItems(Number(id), payload);

      setSuccess("Invoice items updated successfully!");
      setTimeout(() => {
        navigate(`/invoice/${id}`);
      }, 2000);
    } catch (err) {
      setError("Failed to update invoice items");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        name: "",
        quantity: 1,
        unitPrice: 0,
        vatRate: 23,
        unit: "usł",
        isCustom: true,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (
    index: number,
    field: keyof EditableInvoiceItem,
    value: any,
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleAppointmentTypeSelect = (index: number, typeId: string) => {
    if (typeId === "custom") {
      const newItems = [...items];
      newItems[index] = {
        ...newItems[index],
        isCustom: true,
        appointmentTypeId: undefined,
        name: "",
        unitPrice: 0,
        vatRate: 23,
        unit: "usł",
      };
      setItems(newItems);
    } else {
      const selectedType = appointmentTypes.find(
        (t) => t.id === Number(typeId),
      );
      const priceItem = priceList.find(
        (p) => p.appointmentTypeId === Number(typeId),
      );
      if (selectedType) {
        const newItems = [...items];
        newItems[index] = {
          ...newItems[index],
          isCustom: false,
          appointmentTypeId: selectedType.id,
          name: selectedType.name,
          unitPrice: priceItem?.price || 0,
          vatRate: 23,
          unit: "usł",
        };
        setItems(newItems);
      }
    }
  };

  if (loadingData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 10, mb: 6 }}>
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error && !invoice) {
    return (
      <Container maxWidth="lg" sx={{ mt: 10, mb: 6 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Tooltip title="Go back">
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
            Back
          </Button>
        </Tooltip>
      </Container>
    );
  }

  if (!invoice) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 6 }}>
      <Box sx={{ mb: 3 }}>
        <Tooltip title="Go back">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mb: 2 }}
          >
            Back
          </Button>
        </Tooltip>

        <Typography variant="h3" color="primary" gutterBottom>
          Edit Invoice Items
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {invoice.invoiceNumber}
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {/* Items Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" color="primary">
              Invoice Items
            </Typography>
            <Tooltip title="Add new item">
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddItem}
              >
                Add Item
              </Button>
            </Tooltip>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {items.map((item, index) => (
            <Paper
              key={index}
              variant="outlined"
              sx={{ p: 2, mb: 2, position: "relative" }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                }}
              >
                <Tooltip title="Remove item">
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleRemoveItem(index)}
                    disabled={items.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              <Typography variant="subtitle1" gutterBottom>
                Item {index + 1}
              </Typography>

              <Stack spacing={2}>
                <TextField
                  size="small"
                  select
                  label="Service Type"
                  value={
                    item.isCustom
                      ? "custom"
                      : item.appointmentTypeId?.toString() || "custom"
                  }
                  onChange={(e) =>
                    handleAppointmentTypeSelect(index, e.target.value)
                  }
                  margin="normal"
                >
                  <MenuItem value="custom">Custom Service</MenuItem>
                  {appointmentTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </TextField>

                {!item.isCustom && (
                  <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Service:</strong> {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Unit Price:</strong> {item.unitPrice.toFixed(2)}{" "}
                      {currency}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>VAT Rate:</strong> {item.vatRate}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Unit:</strong> {item.unit}
                    </Typography>
                  </Box>
                )}

                {item.isCustom && (
                  <Stack spacing={2}>
                    <TextField
                      size="small"
                      fullWidth
                      label="Service Name"
                      value={item.name}
                      onChange={(e) =>
                        handleItemChange(index, "name", e.target.value)
                      }
                      margin="normal"
                      required
                    />
                    <Stack spacing={2} direction={{ xs: "column", md: "row" }}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Unit Price"
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "unitPrice",
                            Number(e.target.value),
                          )
                        }
                        margin="normal"
                        required
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                      <TextField
                        size="small"
                        fullWidth
                        label="VAT Rate (%)"
                        type="number"
                        value={item.vatRate}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "vatRate",
                            Number(e.target.value),
                          )
                        }
                        margin="normal"
                        required
                        inputProps={{ min: 0, max: 100, step: 1 }}
                      />
                      <TextField
                        size="small"
                        fullWidth
                        label="Unit"
                        value={item.unit}
                        onChange={(e) =>
                          handleItemChange(index, "unit", e.target.value)
                        }
                        margin="normal"
                        required
                        placeholder="e.g., usł, szt, kg"
                      />
                    </Stack>
                  </Stack>
                )}

                <TextField
                  size="small"
                  fullWidth
                  label="Quantity"
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", Number(e.target.value))
                  }
                  margin="normal"
                  required
                  inputProps={{ min: 1, step: 1 }}
                />
              </Stack>

              <Box sx={{ mt: 2, textAlign: "right" }}>
                <Typography variant="body2" color="text.secondary">
                  Total: {(item.quantity * item.unitPrice).toFixed(2)}{" "}
                  {currency}
                </Typography>
              </Box>
            </Paper>
          ))}

          {/* Summary */}
          <Box sx={{ mt: 3, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Summary
            </Typography>
            <Stack spacing={1}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1">Net Total:</Typography>
                <Typography variant="body1">
                  {items
                    .reduce(
                      (sum, item) => sum + item.quantity * item.unitPrice,
                      0,
                    )
                    .toFixed(2)}{" "}
                  {currency}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1">VAT:</Typography>
                <Typography variant="body1">
                  {items
                    .reduce(
                      (sum, item) =>
                        sum +
                        item.quantity * item.unitPrice * (item.vatRate / 100),
                      0,
                    )
                    .toFixed(2)}{" "}
                  {currency}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" color="primary">
                  Gross Total:
                </Typography>
                <Typography variant="h6" color="primary">
                  {items
                    .reduce(
                      (sum, item) =>
                        sum +
                        item.quantity *
                          item.unitPrice *
                          (1 + item.vatRate / 100),
                      0,
                    )
                    .toFixed(2)}{" "}
                  {currency}
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Tooltip title="Save changes">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Save Changes"}
              </Button>
            </Tooltip>
            <Tooltip title="Cancel">
              <Button
                variant="outlined"
                onClick={() => navigate(`/invoices/${id}`)}
                disabled={loading}
              >
                Cancel
              </Button>
            </Tooltip>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
