let IS_PROD = true;  

const server = IS_PROD
  ? "https://zoom-clone-1-emvg.onrender.com" 
  : "http://localhost:8000";

export default server;
