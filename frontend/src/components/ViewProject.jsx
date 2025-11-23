// ViewProject.jsx
import React from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  IconButton,
  Chip,
  Divider
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ImageIcon from "@mui/icons-material/Image";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";

export default function ViewProject({ project, onClose }) {
  if (!project) return null;

  const {
    title,
    company,
    progress,
    budget,
    images,
    pdfs,
    pdfUrls,
    coordinates,
    location,
  } = project;

  const displayPdfs = pdfUrls || pdfs;

  // Chart data
  const progressChartData = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: [progress, 100 - progress],
        backgroundColor: ["#1E3A8A", "#E0E0E0"],
        borderWidth: 0,
      },
    ],
  };

  const budgetData = {
    labels: ["Budget"],
    datasets: [
      {
        label: "Amount (R)",
        data: [budget],
        backgroundColor: ["#1E3A8A"],
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      }
    },
    maintainAspectRatio: false
  };

  const getViewablePDFUrl = (pdfUrl) => {
    return pdfUrl + (pdfUrl.includes('?') ? '&fl_inline' : '?fl_inline');
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        bgcolor: "rgba(0,0,0,0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        p: 2,
      }}
    >
      <Card
        sx={{
          width: "90%",
          maxWidth: "1200px",
          maxHeight: "95vh",
          overflowY: "auto",
          borderRadius: 3,
          p: 4,
          boxShadow: 24,
          background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
        }}
      >
        {/* HEADER */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1E3A8A", mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h6" sx={{ color: "#666", mb: 1 }}>
              {company}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip 
                label={`${progress}% Complete`} 
                color="primary" 
                variant="outlined"
              />
              <Chip 
                label={`R ${budget?.toLocaleString()}`} 
                color="success" 
                variant="outlined"
              />
            </Box>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{ 
              color: "#666",
              "&:hover": { 
                backgroundColor: "rgba(30, 58, 138, 0.1)",
                color: "#1E3A8A"
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* IMAGE GALLERY */}
        {images?.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <ImageIcon sx={{ mr: 1, color: "#1E3A8A" }} />
              <Typography variant="h6" sx={{ fontWeight: "600", color: "#1E3A8A" }}>
                Project Gallery
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                overflowX: "auto",
                gap: 2,
                p: 2,
                bgcolor: "white",
                borderRadius: 2,
                boxShadow: 1,
                "&::-webkit-scrollbar": {
                  height: 8,
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f1f1f1",
                  borderRadius: 4,
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#c1c1c1",
                  borderRadius: 4,
                },
              }}
            >
              {images.map((img, i) => (
                <Box
                  key={i}
                  sx={{
                    flexShrink: 0,
                    position: "relative",
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: 2,
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <img
                    src={img}
                    alt={`Project view ${i + 1}`}
                    style={{
                      width: "280px",
                      height: "180px",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* MAP SECTION */}
        {coordinates?.lat && coordinates?.lng && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <LocationOnIcon sx={{ mr: 1, color: "#1E3A8A" }} />
              <Typography variant="h6" sx={{ fontWeight: "600", color: "#1E3A8A" }}>
                Project Location
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 2, color: "#666" }}>
              {location}
            </Typography>
            <Box
              sx={{
                height: 300,
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 2,
              }}
            >
              <MapContainer
                center={[coordinates.lat, coordinates.lng]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[coordinates.lat, coordinates.lng]}>
                  <Popup>
                    <Typography variant="body2" fontWeight="bold">
                      {title}
                    </Typography>
                    <Typography variant="body2">
                      {company}
                    </Typography>
                  </Popup>
                </Marker>
              </MapContainer>
            </Box>
          </Box>
        )}

        {/* CHARTS SECTION */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <AssessmentIcon sx={{ mr: 1, color: "#1E3A8A" }} />
            <Typography variant="h6" sx={{ fontWeight: "600", color: "#1E3A8A" }}>
              Project Analytics
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            <Box sx={{ width: 280, height: 280 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, textAlign: "center", fontWeight: "500" }}>
                Progress Breakdown
              </Typography>
              <Pie data={progressChartData} options={chartOptions} />
            </Box>
            <Box sx={{ width: 320, height: 280 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, textAlign: "center", fontWeight: "500" }}>
                Project Budget
              </Typography>
              <Bar 
                data={budgetData} 
                options={{
                  ...chartOptions,
                  indexAxis: 'y',
                  scales: {
                    x: {
                      beginAtZero: true,
                      grid: {
                        color: "rgba(0,0,0,0.1)"
                      }
                    }
                  }
                }} 
              />
            </Box>
          </Box>
        </Box>

        {/* PDF SECTION */}
        {displayPdfs?.length > 0 && (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <PictureAsPdfIcon sx={{ mr: 1, color: "#1E3A8A" }} />
              <Typography variant="h6" sx={{ fontWeight: "600", color: "#1E3A8A" }}>
                Project Documents
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {displayPdfs.map((pdf, idx) => {
                const pdfUrl = typeof pdf === 'string' ? getViewablePDFUrl(pdf) : pdf?.display;
                const pdfName = `Project Report ${idx + 1}`;

                return (
                  <Box key={idx} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<PictureAsPdfIcon />}
                      sx={{
                        bgcolor: "#1E3A8A",
                        color: "white",
                        fontWeight: "600",
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        "&:hover": {
                          bgcolor: "#152C6B",
                          transform: "translateY(-2px)",
                          boxShadow: 3,
                        },
                        transition: "all 0.2s",
                      }}
                      href={pdfUrl}
                      target="_blank"
                    >
                      {pdfName}
                    </Button>
                    {typeof pdf !== 'string' && pdf?.download && (
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: "#1E3A8A",
                          color: "#1E3A8A",
                          fontWeight: "500",
                          borderRadius: 2,
                        }}
                        href={pdf.download}
                        download
                      >
                        Download
                      </Button>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
      </Card>
    </Box>
  );
}