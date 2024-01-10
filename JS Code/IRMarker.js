const crypto = require('crypto');
const fs = require('fs');
const xml2js = require('xml2js');

(async () => {
    // Read the XML file
    const args = process.argv.slice(2);
    const filePath = args[0]
    const xml = await fs.readFileSync(filePath, { encoding: "utf-8" });

    // Parse the XML content
    let body = ""
    const parser = new xml2js.Parser({ explicitArray: false, includeWhiteChars: true });
    parser.parseString(xml, (err, result) => {
        if (err) {
            console.error('Error parsing XML:', err);
        } else {
            try {
                body = result['GovTalkMessage']['Body'];
            } catch (err) {
                console.error('Error extracting body:', err);
            }
        }
    });

    // Add the namespace
    body = {
        Body: {
            $: { "xmlns": "http://www.govtalk.gov.uk/CM/envelope" },
            ...body
        }
    };

    // Convert the JSON to XML
    let builder = new xml2js.Builder({
        allowSurrogateChars: true,
        headless: true, renderOpts: {
            pretty: true,
            indent: '    ',
            allowEmpty: true,
        }
    });

    // Remove the IRmark element and pretty print the XML 
    body = builder.buildObject(body);
    body = body.replace(/<IRmark\s+Type="generic">.*?<\/IRmark>/s, '').replace(/\n(?!$)/g, '\n    ');

    // Compute the SHA1 hash
    const shasum = crypto.createHash("sha1");
    shasum.update(body, "utf-8");

    // Convert the hash to Base64
    const digestValue = shasum.digest("base64");
    console.log("Base64 -->", digestValue);
}
)();