import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Button,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Folder as FolderIcon,
  Logout as LogoutIcon,
  AddCircleOutline as AddIcon,
  Upload as UploadIcon,
  AttachFile as AttachFileIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

function Dashboard() {
  const sidebarWidth = 240;

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  

  const [projects, setProjects] = useState([
    {
      title: "Community Water Supply Upgrade",
      budget: "R1.2 Million",
      progress: 65,
      completion: "Expected: Dec 2025",
      company: "Aqua Solutions Ltd",
      files: [],
    },
    {
      title: "Local School Renovation",
      budget: "R850,000",
      progress: 40,
      completion: "Expected: Mar 2026",
      company: "BuildRight Construction",
      files: [],
    },
    {
      title: "Road Infrastructure Expansion",
      budget: "R3.4 Million",
      progress: 90,
      completion: "Expected: Oct 2025",
      company: "InfraDevelop Inc",
      files: [],
    },
  ]);

  const [open, setOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    budget: "",
    progress: 0,
    completion: "",
    company: "",
    files: [],
  });
  const [profilePic, setProfilePic] = useState("https://i.pravatar.cc/150?img=32");
  const [filter, setFilter] = useState("All");

const handleAddProject = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token); // Debug log
    
    if (!token) {
      alert("No token found. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("title", newProject.title);
    formData.append("company", newProject.company);
    formData.append("location", newProject.location);
    formData.append("budget", newProject.budget);
    formData.append("progress", newProject.progress);
    formData.append("expectedCompletion", newProject.completion);

    // Append the actual File objects
    newProject.files.forEach(file => {
      formData.append("files", file.file); // Send the actual File object
    });

  

    const res = await fetch("/projects/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");

    console.log("Project uploaded:", data.project);

    // Update UI
    setProjects([...projects, data.project]);
    setNewProject({
      title: "",
      budget: "",
      progress: 0,
      completion: "",
      company: "",
      location: "",
      files: [],
    });
    setOpen(false);
  } catch (err) {
    console.error("Upload error:", err.message);
    alert("Failed to upload project: " + err.message);
  }
};


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
    }
  };

const handleFileUpload = (e) => {
  const files = Array.from(e.target.files);
  
  // Store the actual File objects, not just metadata
  const fileObjects = files.map(file => ({
    name: file.name,
    type: file.type,
    size: file.size,
    url: URL.createObjectURL(file),
    file: file // Store the actual File object here
  }));
  
  setNewProject({
    ...newProject,
    files: [...newProject.files, ...fileObjects]
  });
};

  const handleRemoveFile = (index) => {
    const updatedFiles = newProject.files.filter((_, i) => i !== index);
    setNewProject({
      ...newProject,
      files: updatedFiles
    });
  };

  const filteredProjects =
    filter === "All"
      ? projects
      : projects.filter((proj) => proj.category === filter);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: sidebarWidth,
            boxSizing: "border-box",
            backgroundColor: "#002147",
            color: "white",
          },
        }}
      >
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Avatar
            alt="Admin"
            src={profilePic}
            sx={{ width: 80, height: 80, margin: "0 auto", mb: 1 }}
          />
          <input
            accept="image/*"
            type="file"
            id="upload-photo"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
          <label htmlFor="upload-photo">
            <IconButton component="span" sx={{ color: "white" }}>
              <UploadIcon />
            </IconButton>
          </label>
          <Typography variant="h6">Admin User</Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Tenderpreneur
          </Typography>
        </Box>

        <List>
          <ListItem button>
            <ListItemIcon sx={{ color: "white" }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>

          <ListItem button>
            <ListItemIcon sx={{ color: "white" }}>
              <FolderIcon />
            </ListItemIcon>
            <ListItemText primary="Projects" />
          </ListItem>

           <ListItem button onClick={handleLogout}>
            <ListItemIcon sx={{ color: "white" }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 4, ml: `${sidebarWidth}px` }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Project Dashboard
          </Typography>
          <Box>
            <TextField
              select
              size="small"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              sx={{ mr: 2, bgcolor: "white", borderRadius: 1 }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Ongoing">Ongoing</MenuItem>
              <MenuItem value="Upcoming">Upcoming</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </TextField>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ bgcolor: "#004aad", color: "#fff" }}
              onClick={() => setOpen(true)}
            >
              Add Project
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {filteredProjects.map((proj, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-5px)" },
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" color="#002147">
                    {proj.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Company: {proj.company}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Budget: {proj.budget}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    {proj.completion}
                  </Typography>
                  {proj.files && proj.files.length > 0 && (
                    <Box mt={1}>
                      <Typography variant="caption" color="text.secondary">
                        Attachments: {proj.files.length}
                      </Typography>
                    </Box>
                  )}
                  <Box mt={2}>
                    <LinearProgress
                      variant="determinate"
                      value={proj.progress}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        bgcolor: "#e0e0e0",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: "#004aad",
                        },
                      }}
                    />
                    <Typography
                      variant="body2"
                      mt={1}
                      textAlign="right"
                      color="text.secondary"
                    >
                      {proj.progress}%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Add Project Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Project</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                label="Project Title"
                fullWidth
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                label="Company Name"
                fullWidth
                value={newProject.company}
                onChange={(e) => setNewProject({ ...newProject, company: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                label="Location"
                fullWidth
                value={newProject.location}
                onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                label="Budget"
                fullWidth
                value={newProject.budget}
                onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                label="Progress (%)"
                type="number"
                fullWidth
                value={newProject.progress}
                onChange={(e) =>
                  setNewProject({ ...newProject, progress: parseInt(e.target.value) })
                }
                InputProps={{ inputProps: { min: 0, max: 100 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Expected Completion"
                fullWidth
                value={newProject.completion}
                onChange={(e) =>
                  setNewProject({ ...newProject, completion: e.target.value })
                }
                placeholder="e.g., Expected: Dec 2025"
              />
            </Grid>
            
            {/* File Upload Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Attach Files (Reports, Pictures, etc.)
              </Typography>
              <input
                accept="*/*"
                type="file"
                id="upload-files"
                multiple
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
              <label htmlFor="upload-files">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<AttachFileIcon />}
                  sx={{ mb: 2 }}
                >
                  Upload Files
                </Button>
              </label>
              
              {/* Display uploaded files */}
              {newProject.files.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Uploaded files:
                  </Typography>
                  {newProject.files.map((file, index) => (
                    <Chip
                      key={index}
                      icon={<AttachFileIcon />}
                      label={file.name}
                      onDelete={() => handleRemoveFile(index)}
                      variant="outlined"
                      size="small"
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleAddProject}
            disabled={!newProject.title || !newProject.company}
          >
            Add Project
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Dashboard;