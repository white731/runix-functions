const functions = require("firebase-functions");
const cors = require("cors")({
  origin: true,
});
exports.test = functions.https.onRequest((req: any, resp: any) => {
  cors(req, resp, () => {
    resp.send("Test Worked");
  });
});
