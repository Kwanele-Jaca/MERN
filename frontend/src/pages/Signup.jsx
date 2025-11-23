import { useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Box,
  MenuItem,
  Typography,
  Paper,
} from "@mui/material";

function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/register", form);
      alert("User registered successfully!");
      setForm({ username: "", email: "", password: "", role: "" });
    } catch (err) {
      console.error(err);
      alert("Error registering user.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Paper elevation={4} sx={{ p: 4, width: 350, textAlign: "center" }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Sign Up
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            margin="normal"
            value={form.username}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            margin="normal"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            margin="normal"
            value={form.password}
            onChange={handleChange}
            required
          />

          {/* Dropdown for Role */}
          <TextField
            select
            fullWidth
            label="Select Role"
            name="role"
            margin="normal"
            value={form.role}
            onChange={handleChange}
            required
            helperText="Choose your role in the system"
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Register
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default Signup;
