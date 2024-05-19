import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const { Box, Typography } = require("@mui/material");
const { NavConfig } = require("src/config/NavConfig");

const NavBar = () => {
  const [currentPath, setCurrentPath] = useState();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#001118",
        justifyContent: "center",
        alignItems: "center",
        padding: "1.44rem 1rem",
        width: "300px",
      }}
    >
      <Box
        sx={{
          height: "50%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        {NavConfig.map(($ele) => {
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: ".5rem",
                padding: "1rem",
                justifyContent: "flex-start",
                borderRadius: ".5rem",
                background:
                  currentPath === $ele.path ? "#013447" : "transparent",
                cursor: "pointer",
                width: "100%",
              }}
              onClick={() => {
                navigate($ele.path);
              }}
            >
              {$ele.icon}
              <Typography
                sx={{
                  color: currentPath === $ele.path ? "#fff" : "#8F8F8F",
                  fontSize: "1.1rem",
                  alignItems: "center",
                  cursor: "pointer",
                  fontFamily: "Poppins, Roboto",
                  fontWeight: currentPath === $ele.path ? "500" : "400",
                }}
              >
                {$ele.title}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default NavBar;
