import { IncomingForm } from "Formidable";
const fs = require("fs");

export const config = {
  api: {
    bodyParser: false
  }
};

const uploadForm = next => (req, res) => {
  console.log('middleware starting');
  return new Promise(async (resolve, reject) => {
    console.log(process.cwd());
    try {
      const form = new IncomingForm({
        multiples: true,
        keepExtensions: true,
        uploadDir: process.cwd() + "/tmp",
      });
      form.once("error", console.error);
      form
        .on("fileBegin", (name, file) => {
          console.log("start uploading: ", file.name);
        })
        .on("aborted", (err) => console.log("Aborted...", err));
      form.once("end", () => {
        console.log("Done!");
      });

      console.log('get ready to parse');
      await form.parse(req, async (err, fields, files) => {
        if (err) {
          throw String(JSON.stringify(err, null, 2));
        }
       
        // fs.renameSync(files.file.path, `./tmp/upload/${files.file.name}`);
        req.form = { fields, files };
        return resolve(next(req, res));
      });
    } catch (error) {
      return resolve(res.status(403).send(error));
    }
  });
};


function handler(req, res) {
  try {
    if (req.method === "POST") {
      res.status(200).send(req.form);
    } else {
      throw res.status(405).json({"error": "Method not allowed"});
    }
  } catch (error) {
    res.status(400).json({ message: JSON.stringify(error, null, 2) });
  }
}

export default uploadForm(handler);

// export default const handler => (request, response) {
//   if (request.method === "POST") {
//     const fileId = request.headers["x-content-id"];
//     const chunkSize = Number(request.headers["content-length"]);
//     const chunkId = request.headers["x-chunk-id"];
//     const chunksQuantity = request.headers["x-chunks-quantity"];
//     const fileName = request.headers["x-content-name"];
//     const fileSize = Number(request.headers["x-content-length"]);
//     const file = fileStorage[fileId] = fileStorage[fileId] || [];
//     // const chunk = [];
//     const data = new Buffer('');

//     console.log(request.headers);

//     request.on("data", (chunk) => {
//       data = Buffer.concat([data, chunk]);
//       console.log('data')
//         // console.log("request data");
//         // chunk.push(part);
//     }).on("end", () => {
//         console.log('test');
//         // const completeChunk = Buffer.concat(chunk);
        
//         // if (completeChunk.length !== chunkSize) {
//         //     sendBadRequest(response);
//         //     return;
//         // }
//         // file[chunkId] = completeChunk;
        
//         // const fileCompleted = file.filter(chunk => !chunk).length === chunksQuantity;
//         // console.log("fileCompleted: " + fileCompleted );
//         // if (fileCompleted) {
//         //     const completeFile = Buffer.concat(file);
            
//         //     if (completeFile.length !== fileSize) {
//         //         sendBadRequest(response);
//         //         return;
//         //     }
//         //     console.log(`Creating file at ${__dirname + '/tmp/' + fileName}`);
//         //     const fileStream = fs.createWriteStream(__dirname + '/tmp/' + fileName);
            
//         //     fileStream.write(completeFile);
//         //     fileStream.end();

//         //     delete fileStorage[fileId];
//         // }

//         // response.setHeader("Content-Type", "application/json");
//         // response.write(JSON.stringify({status: 200}));
//         // response.end();
//         // response.status(200).json({name: "hello"});
//     });

//     response.status(200).json({name: "hello"});
//   } else {
//     response.status(405);
//   }
// }
