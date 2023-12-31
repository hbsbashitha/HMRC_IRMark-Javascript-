const crypto = require('crypto');
const xmldom = require('xmldom');

class MarkCalculator {
    static get DEFAULT_SEC_HASH_ALGORITHM() {
        return 'SHA';
    }

    async createMark(input) {
        const markBytes = await this.getMarkBytes(input);
        return this.toBase64(markBytes);
    }

    async getMarkBytes(input) {
        await this.init();

        const dbf = new xmldom.DOMParser().parseFromString(this.getAlgorithm(), 'text/xml');
        const transforms = new Transforms(dbf.documentElement, null);

        const result = transforms.performTransforms(input);

        const md = crypto.createHash(MarkCalculator.DEFAULT_SEC_HASH_ALGORITHM);
        md.update(result.getBytes());

        return md.digest();
    }

    async init() {
        // Initialization logic here
    }

    toBase64(irMarkBytes) {
        return Buffer.from(irMarkBytes).toString('base64');
    }

    getAlgorithm() {
        // Return the XML algorithm string
    }
}

class IRMarkCalculator extends MarkCalculator {
    getAlgorithm() {
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
    }
}

// Example usage
(async () => {
    const fs = require('fs').promises;

    const args = process.argv.slice(2);

    // Validate arguments
    if (args.length !== 1) {
        console.log('Usage: node IRMarkCalculator.js <file>');
        return;
    }

    const filename = args[0];

    try {
        const fileContent = await fs.readFile(filename, 'utf8');
        const mc = new IRMarkCalculator();

        console.log(`\nIRMark for file ${filename}\n`);
        console.log(`       Base64 --> ${await mc.createMark(fileContent)}\n`);
        console.log('============================================================');
    } catch (error) {
        console.error(`Error reading or processing the file: ${error.message}`);
    }
})();