import multiparty from "multiparty";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import mime from "mime-types";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";

const bucketName = "nks-drp-ecommerce";
export default async function handlerUploadImage(req, res) {
  await mongooseConnect();
  await isAdminRequest(req,res)
  const form = new multiparty.Form();
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
//   console.log("length:", files.file.length);
  const client = new S3Client({
    region: "ap-southeast-2",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });
  const links = [];
  for (const file of files.file) {
    const filenameParts = file.originalFilename.split(".");
    const ext = filenameParts.pop();
    const fileName = filenameParts.join(".");
    const newFilename = `${Date.now() + fileName}.${ext}`;
    // console.log({ ext, file, newFilename });
    await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: newFilename,
        Body: fs.readFileSync(file.path),
        ACL: "public-read",
        ContentType: mime.lookup(file.path),
      })
    );
    const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;

    links.push(link);
  }

  return res.json({ links });
}

export const config = {
  api: { bodyParser: false },
};

// ////////////////////////////////////////////////////////////////

// export default async function handlerUploadImage(req, res) {  // Changed order of arguments
//     const form = new multiparty.Form();

//     try {
//         const { fields, files } = await new Promise((resolve, reject) => {
//             form.parse(req, (err, fields, files) => {
//                 if (err) reject(err);
//                 resolve({ fields, files });
//             });
//         });

//         console.log('length:', files.file.length);
//         res.json({ message: "File parsed successfully!" });  // Send a success response
//     } catch (error) {
//         res.status(500).json({ error: "Error parsing the file." });
//     }
// }

// export const config = {
//     api: { bodyParser: false },
// }
