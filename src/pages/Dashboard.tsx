import React from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Stack,
  Divider,
  ButtonGroup,
  Tabs,
  Tab,
} from "@mui/material";
import { People } from "@mui/icons-material";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import PhotoCameraFrontOutlinedIcon from "@mui/icons-material/PhotoCameraFrontOutlined";
import PersonalInjuryOutlinedIcon from "@mui/icons-material/PersonalInjuryOutlined";

const StatCard = ({
  icon: Icon,
  title,
  value,
}: {
  icon: React.ElementType;
  title: string;
  value: string | number;
}) => (
  <Card>
    <CardContent>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            p: 2,
            bgcolor: "primary.main",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon sx={{ fontSize: 32, color: "primary.contrastText" }} />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  return (
    <Box sx={{ minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Dashboard
          </Typography>
          <Typography color="textSecondary">
            Welcome back! Here's your performance overview.
          </Typography>
        </Box>

        {/* Stats Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 3,
            mb: 4,
          }}
        >
          <StatCard icon={People} title="Users" value="21" />
          <StatCard
            icon={PhotoCameraFrontOutlinedIcon}
            title="Doctors"
            value="15"
          />
          <StatCard
            icon={PersonalInjuryOutlinedIcon}
            title="Patients"
            value="1"
          />
          <StatCard icon={BusinessOutlinedIcon} title="Departments" value="3" />
        </Box>

        {/* Quick Actions Section */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 3,
            mb: 4,
          }}
        >
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              View Analytics
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Check out metrics and other data.
            </Typography>
            <Button variant="outlined" size="small">
              Go to Analytics
            </Button>
          </Paper>

          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Manage Users
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Add, edit, or remove users from the system.
            </Typography>
            <Button variant="outlined" size="small" href="/users">
              Manage Users
            </Button>
          </Paper>

          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Settings
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Update your preferences and configurations.
            </Typography>
            <Button variant="outlined" size="small" href="/settings">
              Open Settings
            </Button>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}
