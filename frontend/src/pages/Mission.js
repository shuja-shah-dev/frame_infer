const { Box } = require("@mui/material");

const Mission = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
      }}
    ></Box>
  );
};

export const MissionPageConfig = {
  path: "/",
  exact: true,
  component: <Mission />,
  title: "All Missions",
  strict: true,
};
