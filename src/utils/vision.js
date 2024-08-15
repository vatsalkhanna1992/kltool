// const cron = require("node-cron");
// const path = require("path");
//const credentials = require("../credentials/credentials_vision_api.json");
// const app_credentials = require("../credentials/credentials.json");
// const http = require("http");
// const kltoolAI = require("./kltool_ai");

const vision_credentials = process.env.VISION_CREDENTIALS;
const credentials = JSON.parse(Buffer.from(vision_credentials, 'base64').toString('utf8'));

//cron.schedule('* * * * * *', () => {
  // login()
  // getTextFromImage()
//});

/* const login = () => {
  const data = JSON.stringify({
    username: app_credentials.username,
    app_name: app_credentials.app_name,
    app_secret: app_credentials.app_secret,
  });

  const options = {
    hostname: "localhost",
    port: 3001,
    path: "/user/login",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
      Accept: "application/json",
      "Cache-Control": "no-cache",
    },
  };

  const req = http.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`);

    res.on("data", (d) => {
      console.log(d);
    });

    req.on("error", (error) => {
      console.error(error);
    });
  });

  //req.write(data)
  req.end();
}; */

const getTextFromImage = async (file) => {
  // Imports the Google Cloud client library
  const vision = require("@google-cloud/vision");

  // Creates a client
  const client = new vision.ImageAnnotatorClient({
    credentials,
  });

  try {
    // Performs label detection on the image file
    const [result] = await client.textDetection(
      //path.join(__dirname, "../../public/resources/code20.png")
      file
    );
    const detections = result.textAnnotations;
    return detections[0].description;
  }
  catch (error) {
    console.error(error);
  }

  return "Sorry, something went wrong. Couldn't fetch data. Please try again later or contact support.";
  //const response = await kltoolAI(detections[0].description);
  //console.log(response);
};

module.exports = {
  getTextFromImage
}
