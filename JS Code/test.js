
const crypto = require('crypto');
const fs = require('fs');
const filePath = "test.xml";

(async () => {
    const xml = await fs.readFileSync(filePath, { encoding: "utf-8" });

    const shasum = crypto.createHash("sha1");
    shasum.update(xml, "utf8");
    const res = shasum.digest("base64");
    console.log(res);
}
)();