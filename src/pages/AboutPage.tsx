import {
  Container,
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Avatar,
  Stack,
  Divider,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

export default function AboutPage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            About IMIS
          </Typography>
          <Typography variant="h5" sx={{ maxWidth: 800 }}>
            Transforming Healthcare Management Through Innovation and Technology
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 8 }}>
        {/* Mission Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
            Our Mission
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}
          >
            At IMIS, we are committed to revolutionizing healthcare management
            by providing cutting-edge software solutions that enhance
            operational efficiency, improve patient care, and empower healthcare
            professionals. Our mission is to bridge the gap between technology
            and healthcare, making medical facilities more accessible,
            efficient, and patient-centered.
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}
          >
            We believe that every healthcare facility, regardless of size,
            deserves access to world-class management tools. Through continuous
            innovation and dedication to excellence, we strive to create
            solutions that not only meet current needs but anticipate future
            challenges in the healthcare industry.
          </Typography>
        </Box>

        <Divider sx={{ my: 6 }} />

        {/* Core Values */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
            Our Core Values
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
                icon: <HealthAndSafetyIcon sx={{ fontSize: 48 }} />,
                title: "Patient-Centered Care",
                description:
                  "We prioritize patient wellbeing in every feature we design. Our systems are built to enhance the patient experience while maintaining the highest standards of privacy and security.",
                color: "#2196f3",
              },
              {
                icon: <TrendingUpIcon sx={{ fontSize: 48 }} />,
                title: "Continuous Innovation",
                description:
                  "Healthcare evolves rapidly, and so do we. We constantly update our platform with new features, security enhancements, and performance improvements to stay ahead of industry trends.",
                color: "#4caf50",
              },
              {
                icon: <BusinessIcon sx={{ fontSize: 48 }} />,
                title: "Professional Excellence",
                description:
                  "We maintain the highest standards in software development, security, and customer support. Our team consists of experienced healthcare IT professionals dedicated to your success.",
                color: "#ff9800",
              },
              {
                icon: <PeopleIcon sx={{ fontSize: 48 }} />,
                title: "Collaborative Approach",
                description:
                  "We work closely with healthcare providers to understand their unique challenges. Your feedback shapes our development roadmap and helps us create solutions that truly matter.",
                color: "#9c27b0",
              },
            ].map((value, index) => (
              <Card
                key={index}
                sx={{
                  flex: "1 1 calc(50% - 16px)",
                  minWidth: "300px",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "translateY(-4px)" },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: value.color,
                        width: 64,
                        height: 64,
                        mr: 2,
                      }}
                    >
                      {value.icon}
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {value.title}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ lineHeight: 1.7 }}
                  >
                    {value.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 6 }} />

        {/* What We Offer */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
            What We Offer
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            <Paper
              sx={{
                p: 3,
                flex: "1 1 calc(33.33% - 16px)",
                minWidth: "280px",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 600, color: "primary.main" }}
              >
                Comprehensive Patient Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complete digital patient records system with secure storage,
                easy retrieval, and detailed medical history tracking.
                HIPAA-compliant and designed for maximum efficiency.
              </Typography>
            </Paper>
            <Paper
              sx={{
                p: 3,
                flex: "1 1 calc(33.33% - 16px)",
                minWidth: "280px",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 600, color: "primary.main" }}
              >
                Advanced Scheduling System
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Intelligent appointment booking with real-time availability,
                automated reminders, conflict resolution, and integration with
                doctor schedules for optimal resource utilization.
              </Typography>
            </Paper>
            <Paper
              sx={{
                p: 3,
                flex: "1 1 calc(33.33% - 16px)",
                minWidth: "280px",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 600, color: "primary.main" }}
              >
                Multi-Role Portal Access
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Separate portals for administrators, doctors, and patients with
                customized interfaces and role-based permissions ensuring data
                security and optimal workflow.
              </Typography>
            </Paper>
          </Box>
        </Box>

        <Divider sx={{ my: 6 }} />

        {/* Statistics */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ fontWeight: 700, mb: 4, textAlign: "center" }}
          >
            IMIS in Numbers
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
              { number: "500+", label: "Healthcare Facilities" },
              { number: "50K+", label: "Active Users" },
              { number: "1M+", label: "Appointments Managed" },
              { number: "99.9%", label: "Uptime Guarantee" },
            ].map((stat, index) => (
              <Box
                key={index}
                sx={{
                  flex: "1 1 calc(25% - 16px)",
                  minWidth: "150px",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="h2"
                  sx={{ fontWeight: 700, color: "primary.main", mb: 1 }}
                >
                  {stat.number}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 6 }} />

        {/* Our Story */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
            Our Story
          </Typography>
          <Stack spacing={3}>
            <Typography
              variant="body1"
              sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}
            >
              IMIS was founded in 2020 by a team of healthcare professionals and
              software engineers who recognized the need for modern,
              user-friendly healthcare management systems. Frustrated with
              outdated, complex software that hindered rather than helped
              medical operations, we set out to create something better.
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}
            >
              What started as a small project to digitize appointment scheduling
              for a single clinic has grown into a comprehensive healthcare
              management platform used by facilities across the country. Our
              success is built on listening to healthcare providers,
              understanding their challenges, and continuously improving our
              platform based on real-world feedback.
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}
            >
              Today, IMIS serves hundreds of healthcare facilities, from small
              private practices to large hospital networks. We remain committed
              to our founding principles: simplicity, security, and unwavering
              focus on improving patient care through technology.
            </Typography>
          </Stack>
        </Box>

        {/* Contact CTA */}
        <Box
          sx={{
            bgcolor: "primary.main",
            color: "white",
            p: 6,
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Want to Learn More?
          </Typography>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Get in touch with our team to discover how IMIS can transform your
            facility
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
