"use client";
import React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { fetchDefaultImages } from "@/utils/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ActiveLink from "./active.link";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20rem",
    },
  },
}));

export default function AppHeader() {
  const { data: session } = useSession();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <Link
          href={`/profile/${session?.user._id}`}
          style={{ color: "unset", textDecoration: "unset" }}
        >
          Profile
        </Link>
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleMenuClose();
          signOut();
        }}
      >
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "#092b4d" }}>
        <Container>
          <Toolbar>
            <Image
              width={35}
              height={35}
              alt="icon"
              style={{
                marginRight: 10,
              }}
              src="/user/music-icon.svg"
            />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              <Link
                href={"/"}
                style={{
                  color: "unset",
                  textDecoration: "unset",
                  cursor: "pointer",
                }}
              >
                MUZIKK
              </Link>
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                onKeyDown={(e: any) => {
                  if (e.key === "Enter") {
                    if (e?.target?.value)
                      router.push(`/search?q=${e?.target?.value}`);
                  }
                }}
              />
            </Search>
            <Box sx={{ flexGrow: 1 }} />
            <Box
              sx={{
                display: {
                  xs: "none",
                  md: "flex",
                  alignItems: "center",
                  gap: 25,
                  cursor: "pointer",
                  "> a": {
                    color: "unset",
                    textDecoration: "unset",
                    padding: '5px',
                      "&.active":{
                        background: "#3b4a59",
                        color: "#cefaff",
                        borderRadius: "5px"
                      }
                  },
                },
              }}
            >
              {session ? (
                <>
                  {" "}
                  <ActiveLink href={"/playlist"}>Playlists</ActiveLink>
                  <ActiveLink href={"/like"}>Likes</ActiveLink>
                  <ActiveLink href={"/track/upload"}>Upload</ActiveLink>
                  <Image
                    alt={session.user.username}
                    src={fetchDefaultImages(session.user.type)}
                    onClick={handleProfileMenuOpen}
                    width={35}
                    height={35}
                  />
                </>
              ) : (
                <>
                  <Link href={"/auth/signin"}>Login</Link>
                </>
              )}
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {renderMenu}
    </Box>
  );
}
