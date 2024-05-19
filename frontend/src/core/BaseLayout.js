import NavBar from "src/comp/NavBar";
import { Box } from "@mui/system";
import { useLocation } from "react-router-dom";

const BaseLayout = ({ children }) => {
  const $location = useLocation();
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
      }}
    >
      <NavBar />
      <Box
        sx={{
          height: "100%",
          width: "100%",
          background: "#1D1D1D",
        }}
      >
        <Box
          sx={{
            width: "100%",
            padding: "1rem 0.88rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #323232",
          }}
        >
          <Box
            sx={{
              color: "#fff",
              fontSize: "1.5rem",
              fontFamily: "Poppins",
            }}
          >
            {`${
              $location.pathname === "/"
                ? "All Missions"
                : $location.pathname.split("/")[1]
            }`}
          </Box>
        </Box>
        {children}
      </Box>
    </Box>
  );
};

export default BaseLayout;
