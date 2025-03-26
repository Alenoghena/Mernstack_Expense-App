import fs from "fs";
import path from "path";
import { finished } from "stream";

const __dirname = path.resolve();
export default async function Image(req, res, next) {
  const file = await req;
  const buffer = Buffer.from(await file.arrayBuffer());
  console.log(file);
  const stream = fs.createReadStream(buffer);
  const pathName = path.join(__dirname, `/public/images/${file.profilePhoto}`);
  const out = fs.createWriteStream(pathName);
  stream.pipe(out);
  finished(out);
  next();
}
