// backend/config/config.js
module.exports = {
    mongoURI: process.env.MONGO_URI || "mongodb+srv://appchocu:Gcd191140@appchodocu.qbquqzj.mongodb.net/?retryWrites=true&w=majority&appName=appchodocu",
    port: process.env.PORT || 3000,
    apiBaseURL: process.env.API_BASE_URL || "http://appchodocu.ddns.net:3000",
    socketServerURL: process.env.SOCKET_SERVER_URL || "http://appchodocu.ddns.net:3000"
  };
  