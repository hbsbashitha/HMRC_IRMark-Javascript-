const fs = require('fs');
const { SignedXml } = require('xml-crypto');
const xml2js = require('xml2js');

const arguments = process.argv.slice(2);
const filePath = arguments[0]

const getAlgorithm = () => {
    return `
        <?xml version='1.0'?>
        <dsig:Transforms xmlns:dsig='http://www.w3.org/2000/09/xmldsig#' xmlns:gt='http://www.govtalk.gov.uk/CM/envelope'>
            <dsig:Transform Algorithm='http://www.w3.org/TR/1999/REC-xpath-19991116'>
                <dsig:XPath>
                    (count(ancestor-or-self::node()|/gt:GovTalkMessage/gt:Body)=count(ancestor-or-self::node())) 
                    and 
                    (count(ancestor-or-self::node()|/gt:GovTalkMessage/gt:Body/*[name()='IRenvelope']/*[name()='IRheader']/*[name()='IRmark'])!=count(ancestor-or-self::node()))
                </dsig:XPath>
            </dsig:Transform>
            <dsig:Transform Algorithm='http://www.w3.org/TR/2001/REC-xml-c14n-20010315#WithComments'/>
        </dsig:Transforms>
    `;
};

function MyCanonicalization() {
    const algorithm = getAlgorithm();
    /*given a node (from the xmldom module) return its canonical representation (as string)*/
    this.process = function (node) {
        //you should apply your transformation before returning
        return algorithm;
    };
    this.getAlgorithmName = function () {
        return "http://myCanonicalization";
    };
}


const createMark = async () => {
    return toBase64(await getMarkBytes());
}

async function getMarkBytes() {
    var xml = await fs.readFileSync(filePath, { encoding: "utf-8" });

    // Construct a SignedXml object from that document
    const sig = new SignedXml({ privateKey: fs.readFileSync("client.pem") });
    sig.CanonicalizationAlgorithms["http://MyCanonicalization"] = MyCanonicalization;
    sig.addReference({
        xpath: "//*[local-name(.)='Body']",
        digestAlgorithm: "http://www.w3.org/2000/09/xmldsig#sha1",
        transforms: ["http://www.w3.org/TR/2001/REC-xml-c14n-20010315"],
    });
    sig.canonicalizationAlgorithm = "http://www.w3.org/TR/2001/REC-xml-c14n-20010315";
    sig.signatureAlgorithm = "http://www.w3.org/2000/09/xmldsig#rsa-sha1";

    // Now perform the transform on the input to get the results.
    sig.computeSignature(xml);
    const signedXml = sig.getSignedXml()

    // Parse the XML content
    var digestValue = ""
    const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });
    parser.parseString(signedXml, (err, result) => {
        if (err) {
            console.error('Error parsing XML:', err);
        } else {
            try {
                digestValue = result['GovTalkMessage']['Signature']['SignedInfo']['Reference']['DigestValue'];
                console.log('DigestValue:', digestValue);
            } catch (err) {
                console.error('Error extracting DigestValue:', err);
            }
        }
    });
    await fs.writeFileSync("signed.xml", signedXml);
    // Convert the digest value to bytes
    const encoder = new TextEncoder();
    return encoder.encode(digestValue)
}

const toBase64 = (irMarkBytes) => {
    const buffer = Buffer.from(irMarkBytes);
    // Convert buffer to Base64 string using toString
    const base64String = buffer.toString('base64');
    return base64String;
};


const convertFileToInputStream = (filePath) => {
    // that reads the file into a byte array
    const fileStream = fs.readFileSync(filePath);
    return fileStream;

    // const fileStream = fs.createReadStream(filePath);
    // console.log(fs.readFileSync(filePath).toString('hex'));
}

(async () => {
    const marker = await createMark();
    console.log("marker -->", marker);
})();
