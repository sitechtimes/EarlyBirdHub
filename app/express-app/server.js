const express = require("express");
const { exec } = require("child_process");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Parse JSON bodies
app.use(express.json());

app.get("/build", (req, res) => {
  const appPath = path.join(__dirname, "..");
  exec(
    "npm run generate && netlify deploy --prod --dir=.output/public",
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
});

// Also handle POST requests for the build endpoint
app.post("/build", (req, res) => {
  const appPath = path.join(__dirname, "..");
  exec(
    "npm run generate && netlify deploy --prod --dir=.output/public",
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
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
