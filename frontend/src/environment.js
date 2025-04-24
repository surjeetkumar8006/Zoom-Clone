let IS_PROD = false;  // change to false when testing locally

const server = IS_PROD
  ? "https://apnacollegebackend.onrender.com"
  : "http://localhost:8000";

export default server;
