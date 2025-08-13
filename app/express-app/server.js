const { spawn } = require("child_process");
const path = require("path");

const app = express();

app.get("/deploy", (req, res) => {
  const appPath = path.join(__dirname, "..");

  const build = spawn("npm", ["run", "generate"], { cwd: appPath });

  build.stdout.on("data", (data) => {
    console.log(`Build stdout: ${data}`);
  });

  build.stderr.on("data", (data) => {
    console.error(`Build stderr: ${data}`);
  });

  build.on("close", (code) => {
    if (code !== 0) {
      console.error(`Build process exited with code ${code}`);
      return res.status(500).send("Build failed");
    }

    const deploy = spawn(
      "npx",
      ["netlify", "deploy", "--prod", "--dir=.output/public"],
      {
        cwd: appPath,
      }
    );

    deploy.stdout.on("data", (data) => {
      console.log(`Deploy stdout: ${data}`);
    });

    deploy.stderr.on("data", (data) => {
      console.error(`Deploy stderr: ${data}`);
    });

    deploy.on("close", (code) => {
      if (code !== 0) {
        console.error(`Deploy process exited with code ${code}`);
        return res.status(500).send("Deploy failed");
      }
      res.send("Build & deploy completed successfully");
    });
  });
});
