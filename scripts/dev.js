import { spawn } from "node:child_process";

const frontendPort = Number(process.env.FRONTEND_PORT || 3000);
const backendPort = Number(process.env.API_PORT || 3001);
if (![frontendPort, backendPort].every((port) => Number.isInteger(port) && port > 0 && port <= 65535) || frontendPort === backendPort) {
  throw new Error("FRONTEND_PORT and API_PORT must be different valid TCP ports.");
}

const processes = [
  spawn(process.execPath, ["backend/server.js"], {
    stdio: "inherit",
    env: { ...process.env, HOST: "127.0.0.1", PORT: String(backendPort) },
  }),
  spawn(process.execPath, ["node_modules/vite/bin/vite.js", "--host", "127.0.0.1", "--port", String(frontendPort), "--strictPort"], {
    stdio: "inherit",
    env: process.env,
  }),
];

let stopping = false;
const stopAll = (signal = "SIGTERM") => {
  if (stopping) return;
  stopping = true;
  processes.forEach((child) => {
    if (child.exitCode === null && !child.killed) child.kill(signal);
  });
};

process.once("SIGINT", () => stopAll("SIGINT"));
process.once("SIGTERM", () => stopAll("SIGTERM"));

processes.forEach((child) => {
  child.once("error", (error) => {
    console.error("Unable to start the local development services.", error);
    process.exitCode = 1;
    stopAll();
  });
  child.once("exit", (code, signal) => {
    if (!stopping) {
      console.error(`Development service exited${signal ? ` on ${signal}` : ` with code ${code}`}.`);
      process.exitCode = code || 1;
      stopAll();
    }
  });
});
