import { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  alpha,
  useTheme,
  Fade,
  Slide,
  Zoom,
} from "@mui/material";
import { Link } from "react-router-dom";
import { 
  FaBalanceScale, 
  FaUsers, 
  FaBuilding, 
  FaChartLine,
  FaArrowRight,
  FaShieldAlt,
  FaHandshake,
  FaMobileAlt
} from "react-icons/fa";

function LandingPage() {
  const theme = useTheme();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const features = [
    {
      icon: <FaBuilding size={40} />,
      title: "Transparent Projects",
      description: "Real-time access to government project details including budgets, timelines, and progress updates with full audit trails."
    },
    {
      icon: <FaUsers size={40} />,
      title: "Citizen Engagement",
      description: "Interactive platform for citizens to monitor tenders, provide feedback, and ensure contractor accountability."
    },
    {
      icon: <FaChartLine size={40} />,
      title: "Progress Tracking",
      description: "Live progress reports, expenditure tracking, and milestone monitoring with intelligent alerts."
    },
    {
      icon: <FaShieldAlt size={40} />,
      title: "Anti-Corruption",
      description: "Advanced monitoring systems to detect and prevent irregularities in public project execution."
    }
  ];

  const stats = [
    { number: "500+", label: "Projects Monitored" },
    { number: "50K+", label: "Active Users" },
    { number: "98%", label: "Transparency Score" },
    { number: "24/7", label: "Real-time Updates" }
  ];

  return (
    <Box
      sx={{
        bgcolor: "#f8fafc",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #001e3c 0%, #004aad 50%, #0066ff 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 30% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)",
          }
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              py: { xs: 8, md: 12 },
              textAlign: "center",
              position: "relative",
            }}
          >
            <Fade in={loaded} timeout={800}>
              <Box>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: alpha("#FFD700", 0.1),
                    p: 2,
                    borderRadius: 4,
                    mb: 3,
                  }}
                >
                  <FaBalanceScale size={60} color="#FFD700" />
                </Box>
                
                <Typography 
                  variant="h2" 
                  fontWeight="bold" 
                  mb={2}
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    background: "linear-gradient(45deg, #FFD700, #FFFFFF)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  TenderWatch
                </Typography>
                
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 4, 
                    opacity: 0.9,
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                    maxWidth: "600px",
                    mx: "auto",
                    lineHeight: 1.6
                  }}
                >
                  Empowering citizens with <strong>real-time transparency</strong>, 
                  <strong> accountability</strong>, and <strong>trust</strong> in public projects
                </Typography>

                <Box 
                  sx={{ 
                    display: "flex", 
                    gap: 2, 
                    justifyContent: "center",
                    flexWrap: "wrap",
                    mb: 6
                  }}
                >
                  <Link to="/Signup" style={{ textDecoration: "none" }}>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        bgcolor: "#FFD700",
                        color: "#001e3c",
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        "&:hover": {
                          bgcolor: "#FFC400",
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 25px rgba(255, 215, 0, 0.3)",
                        },
                        transition: "all 0.3s ease",
                      }}
                      endIcon={<FaArrowRight />}
                    >
                      Get Started Free
                    </Button>
                  </Link>
                  
                  <Link to="/login" style={{ textDecoration: "none" }}>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{
                        color: "#fff",
                        borderColor: alpha("#fff", 0.3),
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        "&:hover": {
                          borderColor: "#fff",
                          bgcolor: alpha("#fff", 0.1),
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Login
                    </Button>
                  </Link>
                </Box>

                {/* Stats Section */}
                <Slide in={loaded} timeout={1000} direction="up">
                  <Grid container spacing={3} sx={{ maxWidth: "800px", mx: "auto" }}>
                    {stats.map((stat, index) => (
                      <Grid item xs={6} md={3} key={index}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography variant="h4" fontWeight="bold" color="#FFD700">
                            {stat.number}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            {stat.label}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Slide>
              </Box>
            </Fade>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Fade in={loaded} timeout={800}>
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="h3"
              fontWeight="bold"
              color="#001e3c"
              sx={{ mb: 2 }}
            >
              Why Choose TenderWatch?
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: "600px", mx: "auto" }}
            >
              Comprehensive tools to ensure transparency and accountability in public spending
            </Typography>
          </Box>
        </Fade>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Zoom in={loaded} timeout={800} style={{ transitionDelay: `${index * 200}ms` }}>
                <Card
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                    height: "100%",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 16px 48px rgba(0, 74, 173, 0.15)",
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: "center", p: 0 }}>
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: alpha("#004aad", 0.1),
                        p: 2,
                        borderRadius: 3,
                        mb: 3,
                        color: "#004aad",
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" fontWeight="bold" color="#001e3c" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Demo Preview Section */}
      <Box sx={{ bgcolor: "#001e3c", color: "white", py: 12 }}>
        <Container maxWidth="lg">
          <Grid container alignItems="center" spacing={6}>
            <Grid item xs={12} md={6}>
              <Fade in={loaded} timeout={800}>
                <Box>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Real-time Project Monitoring
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
                    Track project progress, expenditures, and milestones with our intuitive dashboard
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {[
                      "Live budget tracking and alerts",
                      "Interactive progress maps",
                      "Document verification system",
                      "Citizen feedback integration"
                    ].map((item, index) => (
                      <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{ width: 8, height: 8, bgcolor: "#FFD700", borderRadius: "50%" }} />
                        <Typography>{item}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Zoom in={loaded} timeout={800}>
                <Box
                  sx={{
                    background: "linear-gradient(135deg, #004aad, #0066ff)",
                    borderRadius: 4,
                    p: 3,
                    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 8,
                      left: 8,
                      right: -8,
                      bottom: -8,
                      background: "linear-gradient(135deg, rgba(255,215,0,0.2), transparent)",
                      borderRadius: 4,
                      zIndex: -1,
                    }
                  }}
                >
                  {/* Mock Dashboard Preview */}
                  <Box sx={{ bgcolor: "white", borderRadius: 2, p: 2, color: "black" }}>
                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#ff5f57" }} />
                      <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#ffbd2e" }} />
                      <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#28ca42" }} />
                    </Box>
                    <Box sx={{ bgcolor: "#f8f9fa", borderRadius: 1, p: 2, mb: 2 }}>
                      <Typography variant="body2" fontWeight="bold">Project Progress Dashboard</Typography>
                    </Box>
                    <Grid container spacing={1}>
                      {[1, 2, 3, 4].map((item) => (
                        <Grid item xs={6} key={item}>
                          <Box sx={{ bgcolor: "#f8f9fa", borderRadius: 1, p: 1, textAlign: "center" }}>
                            <Typography variant="caption">Project {item}</Typography>
                            <Box sx={{ width: "100%", height: 4, bgcolor: "#e9ecef", borderRadius: 2, mt: 1 }}>
                              <Box sx={{ width: `${75 + item * 5}%`, height: "100%", bgcolor: "#004aad", borderRadius: 2 }} />
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Box>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Final CTA Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #FFD700, #FFC400)",
          py: 12,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Fade in={loaded} timeout={800}>
            <Box>
              <Typography variant="h3" fontWeight="bold" color="#001e3c" gutterBottom>
                Ready to Make a Difference?
              </Typography>
              <Typography variant="h6" color="#001e3c" sx={{ mb: 4, opacity: 0.9 }}>
                Join thousands of citizens already monitoring public projects and ensuring accountability
              </Typography>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                <Link to="/Signup" style={{ textDecoration: "none" }}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      bgcolor: "#001e3c",
                      color: "white",
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      "&:hover": {
                        bgcolor: "#004aad",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(0, 30, 60, 0.3)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Start Monitoring Now
                  </Button>
                </Link>
                <Link to="/Dashboard" style={{ textDecoration: "none" }}>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      color: "#001e3c",
                      borderColor: "#001e3c",
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      "&:hover": {
                        bgcolor: "#001e3c",
                        color: "white",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    View Demo
                  </Button>
                </Link>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: "#001e3c",
          color: "white",
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <FaBalanceScale size={24} color="#FFD700" />
                <Typography variant="h6" fontWeight="bold">
                  TenderWatch
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Empowering citizens with transparency and accountability in public governance.
                Building trust one project at a time.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", gap: 3, justifyContent: "flex-end", flexWrap: "wrap" }}>
                <Link to="/Dashboard" style={{ textDecoration: "none" }}>
                  <Button sx={{ color: "white" }}>Dashboard</Button>
                </Link>
                <Link to="/userDashboard" style={{ textDecoration: "none" }}>
                  <Button sx={{ color: "white" }}>User Portal</Button>
                </Link>
                <Link to="/login" style={{ textDecoration: "none" }}>
                  <Button sx={{ color: "white" }}>Login</Button>
                </Link>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.1)", mt: 3, pt: 3, textAlign: "center" }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © {new Date().getFullYear()} TenderWatch. All rights reserved. | 
              Building transparent communities together.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default LandingPage;