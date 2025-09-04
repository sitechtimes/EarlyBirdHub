const express = require("express");
const { exec } = require("child_process");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 3001;
const BUILD_SECRET = process.env.BUILD_SECRET;

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Parse JSON bodies
app.use(express.json());

// Middleware to protect /build
function checkAuth(req, res, next) {
  const token = req.headers["authorization"];
  if (!token || token !== `Bearer ${BUILD_SECRET}`) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}

function runBuild(res) {
  const appPath = path.join(__dirname, "..");
  console.log('updating');
  exec(
    "npm run copy-local-images && npm run generate && npx netlify deploy --prod --dir=.output/public",
    { cwd: appPath },
    (err, stdout, stderr) => {
      if (err) {
        console.error(`Build error: ${stderr}`);
        return res.status(500).send("Build failed");
      }
      console.log(stdout);
      res.send("Build completed successfully");
    }
  );
}

app.post("/build", checkAuth, (req, res) => {
  runBuild(res);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
