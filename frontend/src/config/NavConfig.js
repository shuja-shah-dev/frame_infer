import ConnectingAirportsIcon from "@mui/icons-material/ConnectingAirports";
import SmartToyIcon from "@mui/icons-material/SmartToy";

export const NavConfig = [
  {
    title: "Missions",
    path: "/",
    icon: (
      <ConnectingAirportsIcon
        sx={{
          color: "#fff",
          fill: "#fff",
        }}
      />
    ),
    exact: true,
    strict: true,
  },

  // {
  //   title: "Analytics",
  //   path: "/analytics",
  //   icon: (
  //     <SmartToyIcon
  //       sx={{
  //         color: "#fff",
  //         fill: "#fff",
  //       }}
  //     />
  //   ),
  //   exact: true,
  //   strict: true,
  // },
];
