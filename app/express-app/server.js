const express = require("express");
const { exec } = require("child_process");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

app.get("/deploy", (req, res) => {
  const appPath = path.join(__dirname, "..");
  exec("npm run generate", { cwd: appPath }, (err, stdout, stderr) => {
    if (err) {
      console.error(`Build error: ${stderr}`);
      return res.status(500).send("Build failed");
    }
    console.log(stdout);
    exec(
      "netlify deploy --prod --dir=.output/public",
      { cwd: appPath },
      (err2, stdout2, stderr2) => {
        if (err2) {
          console.error(`Deploy error: ${stderr2}`);
          return res.status(500).send("Deploy failed");
        }
        console.log(stdout2);
        res.send("Build & deploy completed successfully");
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
