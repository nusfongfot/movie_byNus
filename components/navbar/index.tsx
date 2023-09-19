import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
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
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloseIcon from "@mui/icons-material/Close";

import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "50ch",
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
    width: "50ch",
    // [theme.breakpoints.up("md")]: {
    //   width: "20ch",
    // },
  },
}));

type Props = {
  setMovies: React.Dispatch<React.SetStateAction<any[]>>;
  movies: any[];
  setCarts: React.Dispatch<React.SetStateAction<any[]>>;
  carts: any[];
};

export default function MyNavbar({
  movies,
  setMovies,
  carts,
  setCarts,
}: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [search, setSearch] = React.useState<string>("");
  const newSearch = search.replace(/ /g, "+");

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [open, setOpen] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(60);
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const [total, setTotal] = React.useState(0);
  const [beforeDis, setBeforeDis] = React.useState(0);
  const [discount, setDiscount] = React.useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const isMenuOpen = Boolean(anchorEl);

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

  const handleSearchMovies = async (e: React.FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/search/movie?query=${newSearch}&api_key=${process.env.NEXT_PUBLIC_MOVIE_API_KEY}`
    );
    const newData = data.results.map((item: any) => {
      return {
        ...item,
        price: "0",
      };
    });
    console.log("new", newData);
    console.log('newssearch', newSearch)
    setMovies(newData);
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (timeLeft > 0 && open) {
        setTimeLeft(timeLeft - 1);
      } else {
        clearInterval(interval);
      }
    }, 1000);

    if (timeLeft == 0) {
      window.location.reload();
    }

    return () => clearInterval(interval);
  }, [timeLeft, open]);

  React.useEffect(() => {
    if (carts.length < 3) {
      setDiscount(10);
    }
    if (carts.length > 5) {
      setDiscount(20);
    }
    setTotal(
      carts.reduce((acc, val) => {
        const price = parseInt(val.price);
        const discountedPrice = price - (price * discount) / 100;
        return acc + discountedPrice;
      }, 0)
    );
    setBeforeDis(
      carts.reduce((acc, val) => {
        const price = parseInt(val.price);
        return acc + price;
      }, 0)
    );
  }, [carts, discount]);

  return (
    <Box sx={{ flexGrow: 1, mb: 5 }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              Movies_ByNus
            </Typography>
          </Box>

          <Box
            // sx={{ flexGrow: 1 }}
            component={"form"}
            onSubmit={(e: React.FormEvent<HTMLDivElement>) =>
              handleSearchMovies(e)
            }
          >
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                value={search}
                onChange={(
                  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                ) => setSearch(e.target.value)}
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                type="search"
              />
            </Search>
          </Box>

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              // aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Badge badgeContent={carts.length} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
        {carts.length > 0 ? (
          <Box sx={{ width: 300, p: 1 }}>
            <Stack
              flexDirection={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              mb={3}
            >
              <Typography variant="h5">Shopping Cart</Typography>
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  setCarts([]);
                  localStorage.removeItem("movies");
                }}
              >
                Clear
              </Button>
            </Stack>
            {carts.map((item) => (
              <Box key={item.id}>
                <Stack
                  flexDirection={"row"}
                  gap={2}
                  justifyContent={"space-between"}
                  mb={1}
                >
                  <img
                    src={
                      item.poster_path
                        ? `http://image.tmdb.org/t/p/w500/${item.poster_path}`
                        : "data:image/png;base64,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"
                    }
                    style={{ width: 50, height: 50 }}
                  />
                  <Typography>
                    {item.original_title.substring(0, 15) + "..."}
                  </Typography>

                  <Typography>{item.price || 0}</Typography>
                </Stack>
              </Box>
            ))}
            <Button
              variant="contained"
              size="small"
              fullWidth
              onClick={handleClickOpen}
            >
              Check out now
            </Button>
          </Box>
        ) : (
          <h3>Your cart is empty!</h3>
        )}
      </Menu>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Check Out
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Box>
            <img
              style={{ width: 300, height: 300 }}
              src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
            />
            <Typography align="center">{`Before discount ${beforeDis}$`}</Typography>

            <Typography align="center">{`discount ${discount}%`}</Typography>
            <Typography align="center">{`total ${total.toFixed(
              2
            )}$`}</Typography>

            <Typography align="center">
              Please pay before: {minutes}:
              {seconds < 10 ? `0${seconds}` : seconds}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} variant="contained">
            Ok
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </Box>
  );
}
