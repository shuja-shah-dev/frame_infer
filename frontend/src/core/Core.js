import React from "react";
import "./core.css";
import RouteProvider from "./Router";
import routes from "src/pages";

function Core() {
  return <RouteProvider routes={routes} />;
}

export default Core;
