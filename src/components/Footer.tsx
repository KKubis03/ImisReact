import { Box, Typography, Container } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        // background: (theme) =>
        //   `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        backgroundColor: (theme) => theme.palette.primary.main,
        color: "white",
        py: 2,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1" align="center">
          © 2025 IMIS - Integrated Medical Information System
        </Typography>
        <Typography variant="body2" align="center">
          By Kacper Kubis
        </Typography>
      </Container>
    </Box>
  );
}
