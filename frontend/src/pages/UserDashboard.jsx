// UserDashboard.jsx
import React, { useState } from "react";
import { 
  Box, Drawer, List, ListItem, ListItemIcon, ListItemText, 
  Avatar, Typography, Button 
} from "@mui/material";

import {
  Home as HomeIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  SmartToy as SmartToyIcon,
  AccountCircle as AccountIcon,
} from "@mui/icons-material";

import ProjectCards from "../components/ProjectCards";
import CommunityFeed from "../components/CommunityFeed";
import ViewProject from "../components/ViewProject";   //  YOU MUST CREATE THIS FILE
import { useAuth } from "../context/AuthContext";

export default function UserDashboard() {

  const [activeSidebarItem, setActiveSidebarItem] = useState("home");

  //  ADDED: For opening a single project details page
  const [selectedProject, setSelectedProject] = useState(null);

  const sidebarWidth = 280;

  
  const { user } = useAuth();

  
const handleProfilePicUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("profilePic", file);

  const token = localStorage.getItem("token");

  const res = await fetch("https://mern-7-2gn5.onrender.com/api/user/uploadProfilePic", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();

  if (data.user) {
    // Update user in AuthContext + localStorage
    localStorage.setItem("user", JSON.stringify(data.user));
    window.location.reload();
  }
};

  
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarWidth,
          "& .MuiDrawer-paper": {
            width: sidebarWidth,
            bgcolor: "#002147",
            color: "#FFD700",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          },
        }}
      >
        <Box sx={{ mt: 2 }}>
          <Typography variant="h4" align="center" sx={{ fontWeight: "bold", mb: 3 }}>
            π
          </Typography>

          <List>
            {[
              { id: "home", icon: HomeIcon, text: "Home" },
              { id: "search", icon: SearchIcon, text: "Search" },
              { id: "notifications", icon: NotificationsIcon, text: "Notifications" },
              { id: "ai", icon: SmartToyIcon, text: "AI Assistant" },
              { id: "profile", icon: AccountIcon, text: "Profile" },
            ].map((item) => (
              <ListItem
                key={item.id}
                button
                onClick={() => setActiveSidebarItem(item.id)}
                sx={{
                  bgcolor: activeSidebarItem === item.id ? "rgba(255,215,0,0.1)" : "transparent",
                  borderLeft: activeSidebarItem === item.id ? "4px solid #FFD700" : "4px solid transparent",
                }}
              >
                <ListItemIcon sx={{ color: "#FFD700" }}>
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>

          <input
  type="file"
  id="profilePicInput"
  accept="image/*"
  style={{ display: "none" }}
  onChange={handleProfilePicUpload}
/>


        </Box>

              {/* Profile Section */}
<Box
  sx={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    mb: 2,
    p: 2,
    borderTop: "1px solid rgba(255,255,255,0.2)"
  }}
>
  <Avatar
    src={user?.profilePicture || "https://via.placeholder.com/150"}
    sx={{
      width: 65,
      height: 65,
      marginBottom: 1,
      border: "2px solid #FFD700",
    }}
  />

  <Typography sx={{ fontWeight: "bold", color: "#fff" }}>
    {user?.username}
  </Typography>

  <Typography variant="caption" sx={{ color: "#FFD700" }}>
    {user?.role}
  </Typography>

  {/* HIDDEN FILE INPUT */}
  <input
    type="file"
    id="profilePicInput"
    accept="image/*"
    style={{ display: "none" }}
    onChange={handleProfilePicUpload}
  />

  {/* CHANGE PHOTO BUTTON */}
  <Button
    variant="outlined"
    size="small"
    sx={{ mt: 1, borderColor: "#FFD700", color: "#FFD700" }}
    onClick={() => document.getElementById("profilePicInput").click()}
  >
    ProfilePicture
  </Button>
</Box>


      </Drawer>

      {/* MAIN CONTENT (right side) */}
      <Box sx={{ flexGrow: 1, p: 3, bgcolor: "#F3F4F6" }}>

        {/* SHOW PROJECT CARDS & PASS OPEN PROJECT HANDLER */}
        {(activeSidebarItem === "home" || activeSidebarItem === "search") && (
          <ProjectCards onOpenProject={(p) => setSelectedProject(p)} />

        )}

        {activeSidebarItem === "notifications" && <div>Notifications Section</div>}
        {activeSidebarItem === "profile" && <div>Profile Section</div>}
        {activeSidebarItem === "ai" && <div>AI Assistant Here</div>}

        {/* COMMUNITY FEED ALWAYS AT BOTTOM */}
        <CommunityFeed />

        {/*  VIEW PROJECT MODAL / PAGE */}
        {selectedProject && (
          <ViewProject
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}


      </Box>
    </Box>
  );
}
