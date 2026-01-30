import { Typography, Box, Paper, Container } from "@mui/material";

export default function DoctorAppointmentsPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Moje Wizyty
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Przeglądaj i zarządzaj swoimi wizytami
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Tutaj będą wyświetlane wizyty lekarza.
        </Typography>
      </Paper>
    </Container>
  );
}
