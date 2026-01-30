import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import * as InvoiceService from "../../api/services/invoice.service";
import { PaymentMethodService } from "../../api/services/paymentMethod.service";
import { AppointmentTypeService } from "../../api/services/appointmentType.service";
import {
  PriceListService,
  type PriceListItem,
} from "../../api/services/priceList.service";

interface InvoiceItem {
  name: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  unit: string;
  isCustom: boolean;
  appointmentTypeId?: number;
}

export default function InvoiceAddPage() {
  const navigate = useNavigate();

  // Ustaw domyślne daty
  const today = new Date();
  const twoWeeksLater = new Date(today);
  twoWeeksLater.setDate(today.getDate() + 14);

  const [issueDate, setIssueDate] = useState(today.toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(
    twoWeeksLater.toISOString().split("T")[0],
  );
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [currency, setCurrency] = useState("PLN");
  const [buyerName, setBuyerName] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [buyerTaxId, setBuyerTaxId] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      name: "",
      quantity: 1,
      unitPrice: 0,
      vatRate: 23,
      unit: "usł",
      isCustom: true,
    },
  ]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [errors, setErrors] = useState({
    issueDate: "",
    dueDate: "",
    paymentMethodId: "",
    currency: "",
    buyerName: "",
    buyerAddress: "",
  });

  const [paymentMethods, setPaymentMethods] = useState<
    { id: number; methodName: string }[]
  >([]);
  const [appointmentTypes, setAppointmentTypes] = useState<
    { id: number; name: string; description: string }[]
  >([]);
  const [priceList, setPriceList] = useState<PriceListItem[]>([]);

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      setLoadingData(true);
      const [paymentMethodsRes, appointmentTypesRes, priceListRes] =
        await Promise.all([
          PaymentMethodService.getAll(),
          AppointmentTypeService.getAll(),
          PriceListService.getAll(),
        ]);
      setPaymentMethods(paymentMethodsRes.data);
      setAppointmentTypes(appointmentTypesRes.data);
      setPriceList(priceListRes.data);
    } catch (err) {
      setError("Failed to load form options");
    } finally {
      setLoadingData(false);
    }
  };

  const validateForm = () => {
    const newErrors = {
      issueDate: issueDate ? "" : "Issue date is required",
      dueDate: dueDate ? "" : "Due date is required",
      paymentMethodId: paymentMethodId ? "" : "Payment method is required",
      currency: currency ? "" : "Currency is required",
      buyerName: buyerName ? "" : "Buyer name is required",
      buyerAddress: buyerAddress ? "" : "Buyer address is required",
    };

    setErrors(newErrors);

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

    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        issueDate,
        dueDate,
        paymentMethodId: Number(paymentMethodId),
        currency,
        buyerName,
        buyerAddress,
        buyerTaxId: buyerTaxId || undefined,
        items: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          vatRate: item.vatRate,
          unit: item.unit,
        })),
      };

      await InvoiceService.create(payload);

      setSuccess("Invoice created successfully!");
      setTimeout(() => {
        navigate("/invoices");
      }, 2000);
    } catch (err) {
      setError("Failed to create invoice");
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
    field: keyof InvoiceItem,
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

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Add New Invoice
        </Typography>

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

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {/* Invoice Details Section */}
          <Typography variant="h6" color="primary" gutterBottom>
            Invoice Details
          </Typography>
          <Stack spacing={2} direction={{ xs: "column", md: "row" }}>
            <TextField
              size="small"
              label="Issue Date"
              type="date"
              value={issueDate}
              onChange={(e) => {
                setIssueDate(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  issueDate: e.target.value ? "" : "Issue date is required",
                }));
              }}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
              error={!!errors.issueDate}
              helperText={errors.issueDate}
            />
            <TextField
              size="small"
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  dueDate: e.target.value ? "" : "Due date is required",
                }));
              }}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
              error={!!errors.dueDate}
              helperText={errors.dueDate}
            />
          </Stack>
          <Stack spacing={2} direction={{ xs: "column", md: "row" }}>
            <TextField
              size="small"
              select
              fullWidth
              label="Payment Method"
              value={paymentMethodId}
              onChange={(e) => {
                setPaymentMethodId(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  paymentMethodId: e.target.value
                    ? ""
                    : "Payment method is required",
                }));
              }}
              margin="normal"
              required
              error={!!errors.paymentMethodId}
              helperText={errors.paymentMethodId}
            >
              {paymentMethods.map((method) => (
                <MenuItem key={method.id} value={method.id}>
                  {method.methodName}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              size="small"
              select
              label="Currency"
              value={currency}
              onChange={(e) => {
                setCurrency(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  currency: e.target.value ? "" : "Currency is required",
                }));
              }}
              margin="normal"
              required
              error={!!errors.currency}
              helperText={errors.currency}
            >
              <MenuItem value="PLN">PLN (Polish Zloty)</MenuItem>
              <MenuItem value="EUR">EUR (Euro)</MenuItem>
              <MenuItem value="USD">USD (US Dollar)</MenuItem>
              <MenuItem value="GBP">GBP (British Pound)</MenuItem>
            </TextField>
          </Stack>

          <Divider sx={{ my: 4 }} />

          {/* Buyer Information Section */}
          <Typography variant="h6" color="primary" gutterBottom>
            Buyer Information
          </Typography>
          <Stack spacing={2}>
            <TextField
              size="small"
              label="Buyer Name"
              value={buyerName}
              onChange={(e) => {
                setBuyerName(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  buyerName: e.target.value ? "" : "Buyer name is required",
                }));
              }}
              margin="normal"
              required
              error={!!errors.buyerName}
              helperText={errors.buyerName}
            />
            <TextField
              size="small"
              label="Buyer Address"
              value={buyerAddress}
              onChange={(e) => {
                setBuyerAddress(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  buyerAddress: e.target.value
                    ? ""
                    : "Buyer address is required",
                }));
              }}
              margin="normal"
              required
              error={!!errors.buyerAddress}
              helperText={errors.buyerAddress}
            />
            <TextField
              size="small"
              label="Buyer Tax ID (Optional)"
              value={buyerTaxId}
              onChange={(e) => setBuyerTaxId(e.target.value)}
              margin="normal"
            />
          </Stack>

          <Divider sx={{ my: 4 }} />

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
            <Tooltip title="Save invoice">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Save Invoice"}
              </Button>
            </Tooltip>
            <Tooltip title="Cancel">
              <Button
                variant="outlined"
                onClick={() => navigate("/invoices")}
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
