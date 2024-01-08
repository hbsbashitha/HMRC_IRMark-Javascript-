
const crypto = require('crypto');
const fs = require('fs');
const filePath = "../Samplexmlfiles/test2.xml";

(async () => {
    const xml = await fs.readFileSync(filePath, { encoding: "utf-8" });
    // console.log(xml);

    const shasum = crypto.createHash("sha1");
    // const xml ="<library>" + "<book>" + "<name>Harry Potter</name>" + "</book>" + "</library>"
    shasum.update(xml, "utf-8");
    const res = shasum.digest("base64");
    console.log(res);
}
)();