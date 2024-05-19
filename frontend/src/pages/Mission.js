import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Typography,
  Paper,
  TableBody,
} from "@mui/material";
import { Button } from "bootstrap";
import { useEffect } from "react";
import { useState } from "react";
import ApiClient from "src/bin/ApiClient";
import { BASE_ENDPOINT, baseConfig } from "src/config/baseConfig";
import { baseBtn } from "src/core/BaseLayout";

/*
[
    {
        "id": 1,
        "mission_start_date": "Thu, 16 May 2024 12:22:04 GMT",
        "mission_status": "active",
        "title": "shuja"
    }
]

*/

const Mission = () => {
  const [missions, setMissions] = useState([]);
  const api = new ApiClient(BASE_ENDPOINT, baseConfig);

  const $thCell = {
    fontSize: "1rem",
    fontFamily: "Poppins",
    fontWeight: "600",
    color: "#fff",
    borderBottom: "none",
  };

  const $trCell = {
    fontSize: "1rem",
    fontFamily: "Poppins",
    color: "#fff",
    borderBottom: "none",
  };

  useEffect(() => {
    api
      .callApi("_missions")
      .then((response) => {
        setMissions(response);
      })
      .catch((error) => {
        throw new Error(error ?? "Request failed for missions");
      });
  }, []);

  const EmptyMissions = () => (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: ".5rem",
        }}
      >
        <Typography
          sx={{
            color: "#fff",
            fontFamily: "Poppins",
            fontWeight: "600",
            fontSize: "1.5rem",
          }}
        >
          No Missions Found
        </Typography>
        <Box sx={baseBtn}>Create New</Box>
      </Box>
    </Box>
  );

  const MissionList = () => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: "0 1rem",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Box sx={{ ...baseBtn, my: "1rem" }}>Create New</Box>
        </Box>
        <TableContainer
          component={Paper}
          sx={{
            my: "1rem",
            background: "#1D1D1D",
            color: "#fff",
            maxHeight: "600px",
            overflowY: "auto",
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background: "#393939",
                  height: "80px",
                  fontSize: "1rem",
                  fontFamily: "Poppins",
                  fontWeight: "600",
                  color: "#fff",
                }}
              >
                <TableCell sx={$thCell}>ID</TableCell>
                <TableCell sx={$thCell}>Title</TableCell>
                <TableCell sx={$thCell}>Start Date</TableCell>
                <TableCell sx={$thCell}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {missions.map((mission) => (
                <TableRow
                  key={mission.id}
                  sx={{
                    height: "70px",
                  }}
                >
                  <TableCell sx={$trCell}>{mission.id}</TableCell>
                  <TableCell sx={$trCell}>{mission.title}</TableCell>
                  <TableCell sx={$trCell}>
                    {mission.mission_start_date}
                  </TableCell>
                  <TableCell sx={$trCell}>
                    {mission.mission_status === "active" ? (
                      <Box
                        sx={{
                          background: "#00FF00",
                          borderRadius: "50%",
                          width: "10px",
                          height: "10px",
                        }}
                      ></Box>
                    ) : (
                      <Box
                        sx={{
                          background: "#FF0000",
                          borderRadius: "50%",
                          width: "10px",
                          height: "10px",
                        }}
                      ></Box>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "92%",
        width: "100%",
      }}
    >
      {Array.isArray(missions) && missions.length ? (
        <MissionList />
      ) : (
        <EmptyMissions />
      )}
    </Box>
  );
};

export const MissionPageConfig = {
  path: "/",
  exact: true,
  component: <Mission />,
  title: "All Missions",
  strict: true,
};
