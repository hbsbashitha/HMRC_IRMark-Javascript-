const fs = require('fs');
const { DOMParser } = require('xmldom')
const { SignedXml, FileKeyInfo, Transforms } = require('xml-crypto');
const crypto = require('crypto');

const arguments = process.argv.slice(2);
const filePath = arguments[0]
const DEFAULT_SEC_HASH_ALGORITHM = 'SHA';
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


const createMark = async (inputStream) => {
    return toBase64(await getMarkBytes(inputStream));
}

async function getMarkBytes(inputStream) {

    var xml = "<library>" + "<book>" + "<name>Harry Potter</name>" + "</book>" + "</library>";

    // Parse the transform details to create a document
    const algorithm = getAlgorithm();
    const xmlDoc = new DOMParser().parseFromString(algorithm, 'application/xml');
    // console.log(xmlDoc)

    // Construct a SignedXml object from that document
    const sig = new SignedXml({ privateKey: fs.readFileSync("client.pem") });
    sig.addReference({
        xpath: "//*[local-name(.)='book']",
        digestAlgorithm: "http://www.w3.org/2000/09/xmldsig#sha1",
        transforms: ["http://www.w3.org/2001/10/xml-exc-c14n#"],
    });
    sig.canonicalizationAlgorithm = "http://www.w3.org/2001/10/xml-exc-c14n#";
    sig.signatureAlgorithm = "http://www.w3.org/2000/09/xmldsig#rsa-sha1";
    // console.log('sig', sig)

    // Now perform the transform on the input to get the results.
    // const resultBuffer = await sig.computeSignature(xml);
    // console.log("dddd", resultBuffer)

    sig.computeSignature(xml);
    console.log("dddd", resultBuffer)
}



const toBase64 = (irMarkBytes) => {
    //we can use the Buffer class to convert the byte array to a base64 string
    // return Buffer.from(irMarkBytes).toString('base64');

    const buffer = Buffer.from(irMarkBytes);
    console.log(buffer)
    // const buffer = Buffer.from([65, 66, 67, 68]);

    // Convert buffer to Base64 string using toString
    const base64String = buffer.toString('base64');
    console.log(base64String);
    return base64String;
};


const convertFileToInputStream = (filePath) => {
    // that reads the file into a byte array
    const fileStream = fs.readFileSync(filePath);
    console.log(fileStream);
    return fileStream;

    // const fileStream = fs.createReadStream(filePath);
    // console.log(fs.readFileSync(filePath).toString('hex'));
}

// toBase64(convertFileToInputStream('../Samplexmlfiles/test.xml'))
console.log("marker -->", createMark(convertFileToInputStream(filePath)))
