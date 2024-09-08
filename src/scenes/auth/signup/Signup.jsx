import { Visibility, VisibilityOff } from "@mui/icons-material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { CircularProgress, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const defaultTheme = createTheme();

export default function SignInSide() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formData = {
      email: data.get("email"),
      password: data.get("password"),
    };

    setError("");
    setEmailError("");
    setPasswordError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      setEmailError("Email is required");
    } else if (!emailRegex.test(formData.email)) {
      setEmailError("Email is not a valid format");
    }

    if (!formData.password) {
      setPasswordError("Password is required");
    }

    if (
      formData.email &&
      emailRegex.test(formData.email) &&
      formData.password
    ) {
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://admin.pfimage.hasthiya.org/admin/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          const token = responseData.token;

          localStorage.setItem("accessToken", token);

          setSnackbarMessage("Login successful!");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);

          setTimeout(() => {
            navigate("/dd");
          }, 2000);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Login failed");
        }
      } catch (error) {
        console.error("Error during login:", error.message);
        setError("An error occurred during login");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (event) => {
    setEmailError("");
    setPasswordError("");
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <div className="login-container">
        <Grid container component="main" sx={{ height: "100vh" }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              height: "100%",
            }}
          >
            <img
              alt="login image"
              src={`../../assets/user.png`}
              style={{ height: "80%", width: "80%" }}
            />
          </Grid>

          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography
                component="h1"
                variant="h5"
                sx={{ mb: 5, fontWeight: "bold" }}
              >
                Sign in
              </Typography>
              <Typography component="h1" sx={{ fontSize: "1rem" }}>
                Perfect Images Entertainment group,LLC
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  error={!!emailError}
                  helperText={emailError}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  error={!!passwordError}
                  helperText={passwordError}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, height: 56 }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Sign In"
                  )}
                </Button>

                {error && (
                  <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                    {error}
                  </Typography>
                )}
              </Box>
              <Box
                position="fixed"
                bottom="20px"
                right="20px"
                display="flex"
                alignItems="center"
              >
                <Box cursor="pointer">
                  {" "}
                  © 2024 Perfect Images Entertainment.
                </Box>
                <Box
                  ml={1}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="50px"
                  height="50px"
                  borderRadius="20%"
                  bgcolor="rgba(255, 255, 255, 0.5)"
                ></Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          sx={{ borderRadius: 10 }}
        >
          <MuiAlert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
}
