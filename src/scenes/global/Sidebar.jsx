import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { Menu, MenuItem, ProSidebar } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "20px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  sx={{ fontWeight: "bold" }}
                >
                  Admin
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="5px">
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "20px 0 0 0" }}
                ></Typography>
              </Box>
            </Box>
          )}

          <Box height="85.5vh" paddingLeft={isCollapsed ? 0 : "10%"}>
            <Item
              title="Dashboard"
              to="/dd"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{
                m: "25px 0 5px 20px",
                fontWeight: "bold",
              }}
            >
              Tags
            </Typography>
            {/* <Item
              title="Add New Client"
              to="/addclient"
              icon={<PersonAddOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            <Item
              title="Blogs Log"
              to="/blog"
              icon={<GroupOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Approved Castings"
              to="/approved"
              icon={<GroupAddOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {/* <Item
              title="Logout"
              to="/"
              icon={<EventNoteOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            {/* <Link
              to={"/"}
              onClick={() => {
                // localStorage.removeItem("accessToken");
              }}
            >
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{
                  m: "25px 0 5px 20px",
                  fontWeight: "bold",
                  fontSize: "20px",
                }}
              >
                Log Out
              </Typography>
            </Link> */}
            ;
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
