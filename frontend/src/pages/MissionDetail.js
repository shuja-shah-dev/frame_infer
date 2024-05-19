import { Box, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ApiClient from "src/bin/ApiClient";
import { BASE_ENDPOINT, baseConfig } from "src/config/baseConfig";
import { baseBtn } from "src/core/BaseLayout";

const MissionDetail = () => {
  const { mission_id } = useParams();
  const [data, setData] = useState({
    target: null,
    result: [],
  });
  const api = new ApiClient(BASE_ENDPOINT, baseConfig);

  function convertPathToUrl(filePath) {
    filePath = filePath.replace(/\\/g, "/");
    const relativePath = filePath.split("Frame_Tester")[1];
    const url = BASE_ENDPOINT + relativePath;
    return url;
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.callApi("_missions");
        const $target = res.find(
          (ele) => Number(ele.id) === Number(mission_id)
        );

        if ($target) {
          const response = await fetch(
            `${BASE_ENDPOINT}/mission/${mission_id}/inference/list/`
          );
          const results = await response.json();

          setData({
            target: $target,
            result: results.map(($entity) => ({
              ...$entity,
              image: convertPathToUrl($entity.image_path),
            })),
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [mission_id]);

  return Array.isArray(data.result) && data.result.length ? (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflowY: "scroll",
        width: "100%",
        p: "1rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          my: "1rem",
        }}
      >
        <Box
          sx={baseBtn}
          onClick={async () => {
            window.open(
              `${BASE_ENDPOINT}/mission/${Number(
                mission_id
              )}/inference/result/download/`
            );
          }}
        >
          Download Report
        </Box>
      </Box>

      <div className="flex gap-3 flex-wrap justify-center mt-8">
        {data.result.map(($frame) => (
          <img src={$frame.image} alt="frame" className="w-[500px]" />
        ))}
      </div>
    </Box>
  ) : (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <CircularProgress
        sx={{
          color: "#fff",
          fill: "#fff",
        }}
      />
    </Box>
  );
};

export const DetailConfig = {
  path: "/mission/detail/:mission_id",
  component: <MissionDetail />,
  title: "Mission Detail",
  isPrivate: false,
  isProtected: false,
  exact: true,
};
