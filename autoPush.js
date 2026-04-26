const { exec } = require("child_process");

const message = `Auto commit: ${new Date().toLocaleString()}`;

exec(`git add . && git diff --cached --quiet || git commit -m "${message}" && git push`,
(err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout || "No changes to commit");
});