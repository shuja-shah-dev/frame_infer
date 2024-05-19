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
  CircularProgress,
  Alert,
} from "@mui/material";
import { Button } from "bootstrap";
import { useEffect } from "react";
import { useState } from "react";
import ApiClient from "src/bin/ApiClient";
import { BASE_ENDPOINT, baseConfig } from "src/config/baseConfig";
import { baseBtn } from "src/core/BaseLayout";
import { Close } from "@mui/icons-material";

import "../comp/_stylesheets/login.css";
import { useNavigate } from "react-router-dom";

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

const _ico = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M58.3334 36.6667C51.2634 36.6667 47.7267 36.6667 45.53 34.4701C43.3334 32.2734 43.3334 28.7367 43.3334 21.6667C43.3334 14.5967 43.3334 11.0601 45.53 8.86341C47.7267 6.66675 51.2634 6.66675 58.3334 6.66675C65.4034 6.66675 68.94 6.66675 71.1367 8.86341C73.3334 11.0601 73.3334 14.5967 73.3334 21.6667C73.3334 28.7367 73.3334 32.2734 71.1367 34.4701C68.94 36.6667 65.4034 36.6667 58.3334 36.6667ZM60.8334 15.0001C60.8334 14.337 60.57 13.7012 60.1011 13.2323C59.6323 12.7635 58.9964 12.5001 58.3334 12.5001C57.6703 12.5001 57.0344 12.7635 56.5656 13.2323C56.0968 13.7012 55.8334 14.337 55.8334 15.0001V19.1667H51.6667C51.0037 19.1667 50.3678 19.4301 49.8989 19.899C49.4301 20.3678 49.1667 21.0037 49.1667 21.6667C49.1667 22.3298 49.4301 22.9657 49.8989 23.4345C50.3678 23.9034 51.0037 24.1667 51.6667 24.1667H55.8334V28.3334C55.8334 28.9965 56.0968 29.6323 56.5656 30.1012C57.0344 30.57 57.6703 30.8334 58.3334 30.8334C58.9964 30.8334 59.6323 30.57 60.1011 30.1012C60.57 29.6323 60.8334 28.9965 60.8334 28.3334V24.1667H65C65.6631 24.1667 66.299 23.9034 66.7678 23.4345C67.2367 22.9657 67.5 22.3298 67.5 21.6667C67.5 21.0037 67.2367 20.3678 66.7678 19.899C66.299 19.4301 65.6631 19.1667 65 19.1667H60.8334V15.0001Z"
        fill="white"
      ></path>
      <path
        opacity="0.5"
        d="M73.3333 42.3267C73.3266 47.2267 73.29 51.3867 73.0133 54.8033C72.69 58.77 72.0266 62.0833 70.5466 64.8333C69.9007 66.0391 69.0808 67.1431 68.1133 68.11C65.3366 70.8867 61.8033 72.1433 57.3233 72.7433C52.9466 73.3333 47.3333 73.3333 40.1766 73.3333H39.8233C32.6633 73.3333 27.0566 73.3333 22.6766 72.7433C18.2 72.1433 14.6633 70.8867 11.89 68.11C9.42996 65.65 8.15663 62.59 7.48329 58.7933C6.81663 55.06 6.69663 50.42 6.67329 44.6567C6.66663 43.19 6.66663 41.64 6.66663 40V39.82C6.66663 32.66 6.66663 27.0533 7.25663 22.6733C7.85663 18.1967 9.11329 14.66 11.89 11.8867C14.6633 9.11 18.2 7.85333 22.6766 7.25333C26.57 6.73 31.5766 6.67 37.6733 6.66333C38.2904 6.66333 38.8822 6.90846 39.3185 7.3448C39.7548 7.78113 40 8.37293 40 8.99C40 9.60707 39.7548 10.1989 39.3185 10.6352C38.8822 11.0715 38.2904 11.3167 37.6733 11.3167C31.49 11.3233 26.8933 11.3767 23.2966 11.86C19.3333 12.3933 16.9433 13.4067 15.1766 15.1733C13.41 16.94 12.4 19.3333 11.8666 23.3C11.3233 27.3333 11.3166 32.6267 11.3166 40V42.6133L14.4233 39.9C15.7851 38.7085 17.5487 38.0791 19.3571 38.1391C21.1655 38.1992 22.8835 38.9442 24.1633 40.2233L37.4633 53.5233C38.4952 54.5558 39.8583 55.1911 41.3125 55.3173C42.7668 55.4435 44.219 55.0526 45.4133 54.2133L46.34 53.5633C48.0626 52.3526 50.145 51.7622 52.2468 51.8887C54.3485 52.0153 56.3451 52.8513 57.91 54.26L66.6866 62.16C67.57 60.3033 68.0966 57.8667 68.3766 54.4267C68.64 51.1867 68.6766 47.2533 68.68 42.3267C68.68 41.7096 68.9251 41.1178 69.3614 40.6815C69.7978 40.2451 70.3896 40 71.0066 40C71.6237 40 72.2155 40.2451 72.6518 40.6815C73.0882 41.1178 73.3333 41.7096 73.3333 42.3267Z"
        fill="white"
      ></path>
    </svg>
  );
};

const CreateMission = ({ show, setShowCreate }) => {
  const [media, setMedia] = useState(null);
  const [title, setTitle] = useState("");
  const handleFileChange = (e) => {
    setMedia(e.target.files[0]);
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [logMessage, setLogMessage] = useState("");

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  }, [error]);

  const generateFramesFromVideo = () => {
    try {
      const videoBlob = new Blob([media], { type: "video/webm" });
      return videoBlob;
    } catch {
      console.error("Failed at generating frames from video");
    }
  };

  function base64toBlob(base64Data, contentType) {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  const extractFrames = async (videoBlob) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    video.src = URL.createObjectURL(videoBlob);

    await new Promise((resolve) => {
      video.onloadedmetadata = resolve;
    });

    const { videoWidth, videoHeight } = video;
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    let frames = [];

    for (let i = 0; i < Math.floor(video.duration); i += 1) {
      video.currentTime = i;
      await new Promise((resolve) => {
        video.onseeked = resolve;
      });
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
      frames.push(canvas.toDataURL("image/png"));
    }

    return frames;
  };

  const sendFilesAwait = async (mission_id, frames) => {
    const recordedFrames = frames;
    const BASE_URL = BASE_ENDPOINT;
    const formData = new FormData();
    formData.append("mission_id", mission_id);
    setLogMessage("Uploading to s3, this may take a while...");
    recordedFrames.forEach((frame, index) => {
      const imageData = frame.split(",")[1];
      const blob = base64toBlob(imageData, "image/png");
      formData.append(`file${index}`, blob);
    });
    try {
      const response = await fetch(`${BASE_URL}/inference/create/`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setLoading(false);
        const data = await response.json();
        if (Array.isArray(data) && data.length) {
          setShowCreate(false);
        }
      } else {
        setLoading(false);
        console.error("Error uploading files: ", response.statusText);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error uploading files: ", error);
    }
  };

  const proceedMission = async () => {
    if (loading) return;
    if (!title) {
      setError("Title is required");
      return;
    }
    if (!media) {
      setError("Media is required");
      return;
    }

    setLoading(true);

    const BASE_URL = BASE_ENDPOINT;
    try {
      const res = await fetch(`${BASE_URL}/mission/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, mission_status: "active" }),
      });

      if (res.ok) {
        const data = await res.json();
        const videoBlob = generateFramesFromVideo();
        const frames = await extractFrames(videoBlob);
        if (data.mission_id) {
          sendFilesAwait(data.mission_id, frames);
        }
      } else {
        setLoading(false);
        console.error("Error creating mission: ", res.statusText);
      }
    } catch (err) {
      setLoading(false);
      console.error("Error creating mission: ", err);
    }
  };

  useEffect(() => {
    return () => {
      setMedia(null);
      setTitle("");
      setLoading(false);
      setError("");
      setLogMessage("");
    };
  }, []);

  return (
    <Box
      sx={{
        height: "100vh",
        zIndex: "1000",
        position: "fixed",
        top: "0",
        left: "0",
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(50px)",
        width: "100%",
        display: show ? "flex" : "none",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Close
        sx={{
          position: "absolute",
          top: "0.2rem",
          right: "1rem",
          cursor: "pointer",
          color: "#fff",
          fill: "#fff",
          fontSize: "4rem",
        }}
        onClick={() => setShowCreate(false)}
      />
      <Box
        sx={{
          width: "80%",
          height: "80%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            alignItems: "flex-start",
            gap: "1rem",
            flexDirection: "column",
            height: "100%",
            background: "#1D1D1D",
            padding: "1rem",
            borderRadius: "1rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              color: "#fff",
              fontSize: "1.1rem",
              width: "70%",
              margin: "auto",
            }}
          >
            Title:
            <input
              className="input-field"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Box>

          <div
            className="relative w-[70%] h-96 rounded-2xl m-auto border border-dashed border-[#5D38C2] flex flex-col justify-center items-center"
            style={{ background: "rgba(255, 255, 255, 0.05)" }}
          >
            <div className="flex flex-col">
              <_ico />
              <h3
                className="text-lg "
                style={{
                  color: "#fff",
                  fontSize: "1rem",
                  fontFamily: "Poppins",
                }}
              >
                {media ? media.name : "Upload Video"}
              </h3>
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute "
                style={{
                  top: "0px",
                  left: "0px",
                  opacity: "0",
                  width: "100%",
                  height: "100%",
                  cursor: "pointer",
                }}
              ></input>
            </div>
          </div>
          {logMessage && (
            <Alert severity="info" sx={{ width: "100%", margin: "1rem auto" }}>
              {logMessage}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ width: "100%", margin: "1rem auto" }}>
              {error}
            </Alert>
          )}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Box sx={baseBtn} onClick={proceedMission}>
              {loading ? (
                <CircularProgress
                  sx={{
                    color: "#fff",
                    fill: "#fff",
                  }}
                  size={10}
                />
              ) : (
                "Create"
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const Mission = () => {
  const [missions, setMissions] = useState([]);
  const api = new ApiClient(BASE_ENDPOINT, baseConfig);
  const navigate = useNavigate();
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

  const [showCreate, setShowCreate] = useState(false);

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
          <Box
            sx={{ ...baseBtn, my: "1rem" }}
            onClick={() => setShowCreate(true)}
          >
            Create New
          </Box>
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
                  <TableCell
                    sx={{ ...$trCell, cursor: "pointer" }}
                    onClick={() =>
                      navigate(`/mission/detail/${mission.id}`)
                    }
                  >
                    {mission.title}
                  </TableCell>
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
      <CreateMission show={showCreate} setShowCreate={setShowCreate} />
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
