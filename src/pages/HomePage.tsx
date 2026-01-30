import {
  Typography,
  Button,
  Container,
  Box,
  Card,
  Paper,
  Stack,
  Tooltip,
  Divider,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Hero */}
      <Box
        component={Paper}
        elevation={0}
        square
        sx={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/szpital.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: (theme) => theme.palette.primary.main,
          color: "common.white",
          py: { xs: 8, md: 12 },
          minHeight: { xs: 300, md: 500 },
          alignContent: "end",
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3} alignItems="flex-start">
            <Typography variant="h2" component="h1" sx={{ fontWeight: 700 }}>
              Integrated Medical Information System
            </Typography>
            <Typography variant="h5" sx={{ maxWidth: 680 }}>
              Modern healthcare management platform designed to streamline
              medical operations, enhance patient care, and improve overall
              efficiency in healthcare facilities.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Tooltip title="Start using IMIS">
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/login")}
                >
                  Get Started
                </Button>
              </Tooltip>
              <Tooltip title="Learn more about IMIS">
                <Button
                  variant="outlined"
                  size="large"
                  color="inherit"
                  startIcon={<InfoIcon />}
                  onClick={() => navigate("/about")}
                >
                  Learn More
                </Button>
              </Tooltip>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container component="main" sx={{ py: 8 }} maxWidth="lg">
        {/* Features Section */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ fontWeight: 700, mb: 2 }}
          >
            Key Features
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 6 }}
          >
            Everything you need to manage your healthcare facility efficiently
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              justifyContent: "center",
            }}
          >
            {[
              {
                title: "Patient Management",
                icon: (
                  <LocalHospitalIcon
                    sx={{ fontSize: 48, color: "primary.main" }}
                  />
                ),
                body: "Comprehensive patient database with medical history, personal information, and appointment records. Secure HIPAA-compliant data storage.",
              },
              {
                title: "Smart Scheduling",
                icon: (
                  <CalendarTodayIcon
                    sx={{ fontSize: 48, color: "primary.main" }}
                  />
                ),
                body: "Intelligent appointment scheduling system with conflict detection, doctor availability management, and automated reminders.",
              },
              {
                title: "Role-Based Access",
                icon: (
                  <SecurityIcon sx={{ fontSize: 48, color: "primary.main" }} />
                ),
                body: "Advanced security with role-based permissions for administrators, doctors, and patients. Complete data protection and privacy.",
              },
              {
                title: "Fast Performance",
                icon: (
                  <SpeedIcon sx={{ fontSize: 48, color: "primary.main" }} />
                ),
                body: "Lightning-fast interface built with modern technologies. Optimized for quick data access and seamless user experience.",
              },
            ].map((feature) => (
              <Card
                key={feature.title}
                variant="outlined"
                sx={{
                  flex: "1 1 calc(25% - 32px)",
                  minWidth: "250px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 3,
                  textAlign: "center",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 4,
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.body}
                </Typography>
              </Card>
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 8 }} />

        {/* Benefits Section */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ fontWeight: 700, mb: 2 }}
          >
            Why Choose IMIS?
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 6 }}
          >
            Transform your healthcare facility with modern technology
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
            }}
          >
            {[
              {
                title: "Improved Efficiency",
                body: "Automate routine tasks and reduce administrative overhead by up to 60%. Focus more on patient care, less on paperwork.",
              },
              {
                title: "Better Patient Experience",
                body: "Patients can access their medical records, schedule appointments, and communicate with doctors through a user-friendly portal.",
              },
              {
                title: "Data-Driven Insights",
                body: "Make informed decisions with comprehensive analytics and reporting. Track key metrics and identify improvement areas.",
              },
              {
                title: "Compliance & Security",
                body: "Stay compliant with healthcare regulations. Enterprise-grade security ensures patient data is always protected.",
              },
              {
                title: "Scalable Solution",
                body: "Grows with your facility. From small clinics to large hospitals, IMIS adapts to your needs without compromising performance.",
              },
              {
                title: "24/7 Availability",
                body: "Cloud-based system accessible anytime, anywhere. Never miss an important update or appointment notification.",
              },
            ].map((benefit) => (
              <Box
                key={benefit.title}
                sx={{
                  flex: "1 1 calc(33.33% - 16px)",
                  minWidth: "280px",
                }}
              >
                <Box sx={{ height: "100%" }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600, color: "primary.main" }}
                  >
                    {benefit.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {benefit.body}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 8 }} />

        {/* CTA Section */}
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Join hundreds of healthcare facilities already using IMIS
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Tooltip title="Contact our team">
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/contact")}
              >
                Contact Us
              </Button>
            </Tooltip>
            <Tooltip title="Learn more about our platform">
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/about")}
              >
                Learn More
              </Button>
            </Tooltip>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
