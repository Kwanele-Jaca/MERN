import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

export default function ProjectCards({ onOpenProject }) {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  const fetchUserProjects = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/projects/myProjects", {
        headers: {
          Authorization: `Bearer ${token}`,   // FIXED
        },
      });

      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  };

  useEffect(() => {
    fetchUserProjects();
  }, []);

  return (
    <Box>
      {/* TITLE + ADD BUTTON */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" sx={{ color: "#1E3A8A", fontWeight: "bold" }}>
          My Projects
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ bgcolor: "#1E3A8A" }}
          onClick={() => navigate("/upload")}
        >
          Add Project
        </Button>
      </Box>

      {/* PROJECT GRID */}
      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} md={6} lg={4} key={project._id}>
            <Card
              sx={{
                p: 2,
                cursor: "pointer",
                transition: "0.2s",
                "&:hover": { transform: "translateY(-4px)", boxShadow: 4 },
              }}
              onClick={() => onOpenProject(project)}   // send project to ViewProject page
            >
              {/* IMAGE */}
              {project.images?.length > 0 ? (
                <img
                  src={project.images[0]}
                  alt="project"
                  style={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                    borderRadius: 6,
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: 180,
                    background: "#eee",
                    borderRadius: 2,
                  }}
                />
              )}

              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {project.title}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {project.company}
                </Typography>

                {/* PROGRESS BAR */}
                <Box sx={{ mt: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={project.progress ?? 0}
                    sx={{ height: 8, borderRadius: 5 }}
                  />
                  <Chip
                    label={`${project.progress ?? 0}%`}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>

                {/* PDF INDICATOR */}
                {project.pdfs?.length > 0 && (
                  <Typography sx={{ mt: 1 }} color="primary">
                    {project.pdfs.length} report(s) available
                  </Typography>
                )}

                {/* LOCATION */}
                <Typography sx={{ mt: 1 }} color="text.secondary">
                   {project.location}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
