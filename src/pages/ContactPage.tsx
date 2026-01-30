import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Card,
  CardContent,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
    alert("Thank you for contacting us! We will get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

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
            Contact Us
          </Typography>
          <Typography variant="h5" sx={{ maxWidth: 800 }}>
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
          }}
        >
          {/* Contact Form */}
          <Box sx={{ flex: "1 1 calc(58.33% - 16px)", minWidth: "300px" }}>
            <Paper sx={{ p: 4 }}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: 700, mb: 3 }}
              >
                Send us a Message
              </Typography>
              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    multiline
                    rows={6}
                    variant="outlined"
                  />
                  <Tooltip title="Send your message">
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{ alignSelf: "flex-start" }}
                    >
                      Send Message
                    </Button>
                  </Tooltip>
                </Stack>
              </Box>
            </Paper>
          </Box>

          {/* Contact Information */}
          <Box sx={{ flex: "1 1 calc(41.67% - 16px)", minWidth: "300px" }}>
            <Stack spacing={3}>
              <Card>
                <CardContent>
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}
                  >
                    <EmailIcon
                      sx={{ color: "primary.main", fontSize: 32, mr: 2 }}
                    />
                    <Box>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 600 }}
                      >
                        Email
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        support@imis.healthcare
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        sales@imis.healthcare
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}
                  >
                    <PhoneIcon
                      sx={{ color: "primary.main", fontSize: 32, mr: 2 }}
                    />
                    <Box>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 600 }}
                      >
                        Phone
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        +1 (555) 123-4567
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        +1 (555) 987-6543
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}
                  >
                    <LocationOnIcon
                      sx={{ color: "primary.main", fontSize: 32, mr: 2 }}
                    />
                    <Box>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 600 }}
                      >
                        Address
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        123 Healthcare Boulevard
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Medical District, MD 12345
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        United States
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}
                  >
                    <AccessTimeIcon
                      sx={{ color: "primary.main", fontSize: 32, mr: 2 }}
                    />
                    <Box>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 600 }}
                      >
                        Business Hours
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Monday - Friday: 8:00 AM - 6:00 PM
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Saturday: 9:00 AM - 2:00 PM
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Sunday: Closed
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </Box>

        {/* Additional Information */}
        <Box sx={{ mt: 8 }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
            }}
          >
            <Paper
              sx={{
                p: 3,
                flex: "1 1 calc(33.33% - 16px)",
                minWidth: "250px",
                bgcolor: "primary.light",
                color: "white",
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Sales Inquiries
              </Typography>
              <Typography variant="body2">
                Interested in implementing IMIS at your facility? Contact our
                sales team for a personalized demo and pricing information.
              </Typography>
            </Paper>
            <Paper
              sx={{
                p: 3,
                flex: "1 1 calc(33.33% - 16px)",
                minWidth: "250px",
                bgcolor: "secondary.light",
                color: "white",
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Technical Support
              </Typography>
              <Typography variant="body2">
                Our dedicated support team is available 24/7 to help you with
                any technical issues or questions about using IMIS.
              </Typography>
            </Paper>
            <Paper
              sx={{
                p: 3,
                flex: "1 1 calc(33.33% - 16px)",
                minWidth: "250px",
                bgcolor: "success.light",
                color: "white",
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Partnership Opportunities
              </Typography>
              <Typography variant="body2">
                Interested in partnering with IMIS? We're always looking for
                strategic partnerships that benefit the healthcare community.
              </Typography>
            </Paper>
          </Box>
        </Box>

        {/* FAQ Teaser */}
        <Box
          sx={{
            mt: 8,
            p: 6,
            bgcolor: "grey.100",
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Frequently Asked Questions
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, maxWidth: 800, mx: "auto" }}
          >
            Before reaching out, you might find the answer to your question in
            our comprehensive FAQ section. We've compiled answers to the most
            common questions about IMIS features, implementation, pricing, and
            support.
          </Typography>
          <Tooltip title="View FAQ section">
            <Button variant="outlined" size="large">
              View FAQ
            </Button>
          </Tooltip>
        </Box>
      </Container>
    </Box>
  );
}
