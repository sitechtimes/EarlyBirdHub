const express = require("express");
const { exec } = require("child_process");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

app.get("/build", (req, res) => {
  const appPath = path.join(__dirname, "..");
  exec(
    "netlify deploy --prod --dir=.output/public",
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
