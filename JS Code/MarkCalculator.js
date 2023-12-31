const fs = require('fs');


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
    return toBase64(getMarkBytes(inputStream));
}

async function getMarkBytes(inputStream) {
    // Parse the transform details to create a document
    const algorithm = getAlgorithm(); // Replace getAlgorithm() with the actual function or value
    const doc = new DOMParser().parseFromString(algorithm, 'text/xml');

    // Construct an Apache security Transforms object from that document
    const transforms = new Transforms(doc.documentElement, null);

    // Now perform the transform on the input to get the results
    const input = await transforms.performTransforms(inputStream);

    // Uncomment this line to see transform output
    // console.log("\noutput = \n" + input.toString());

    // Second part is to run output via SHA1 digest
    // This is done via the Node.js crypto module
    const md = crypto.createHash(DEFAULT_SEC_HASH_ALGORITHM);
    md.update(input.toString());

    return md.digest();
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

toBase64(convertFileToInputStream('../test.xml'))

// console.log( (new ArrayBuffer(convertFileToInputStream('../test.xml'))))
