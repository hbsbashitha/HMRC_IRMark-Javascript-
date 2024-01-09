// package uk.gov.hmrc.mark;
// package markcalculatorsrc;
import java.io.ByteArrayInputStream;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.io.InputStream;
import java.security.MessageDigest;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.apache.xml.security.Init;
import org.apache.xml.security.signature.XMLSignatureInput;
import org.apache.xml.security.transforms.Transforms;
import org.bouncycastle.util.encoders.Base64;
import org.w3c.dom.Document;


/**
 * This code generates/checks an mark value for an input document.
 * The value is a base64 encoded SHA1 digest of a signature
 * transform over a certain style of document.
 *
 * The code has a number of jar dependencies:-
 * 	xmlsec-1.4.1.jar - The Apache XML Security Library
 *  bc-jce-jdk13-114.jar - Bouncy Castle JCE library
 *  xalan_enhanced.jar - Apache XSLT/XPath processor
 *  commons-logging-1.1.1.jar - Commons logging
 */
public abstract class MarkCalculator
{
    /**
     * Name of the default algorithm to use for hashing the mark String. 
     */
	public static final String DEFAULT_SEC_HASH_ALGORITHM = "SHA";

	/**
     * Create a Base64 encoded representation of a mark, created from
     * the given <tt>InputStream</tt>.
     *  
     * @param in
     *      Stream to the data for which to generate a mark.
     * @return
     *      A Base64 encoded mark.
     * 
     * @throws Exception
	 */
	public String createMark(InputStream in) throws Exception
	{
	    //create a Base64 of the digest with the BouncyCastle JCE library
        return toBase64(getMarkBytes(in));
    }
    
    /**
     * Retrieve the raw bytes of a mark, created from the given
     * <tt>InputStream</tt>.
     * 
     * @param in
     *      Stream to the data for which to generate a mark.
     * @param namespace
     * 
     * @return
     *      Raw bytes of the mark.
     *
     * @throws Exception
     */
    protected byte[] getMarkBytes(InputStream in) throws Exception
    {
		Init.init();

		// Parse the transform details to create a document
		DocumentBuilderFactory dbf=DocumentBuilderFactory.newInstance();
		dbf.setNamespaceAware(true);
		DocumentBuilder db=dbf.newDocumentBuilder();
		Document doc=db.parse(new ByteArrayInputStream(getAlgorithm().getBytes()));

		// Construct a Apache security Transforms object from that document
		Transforms transforms = new Transforms(doc.getDocumentElement(), null);

		// Now perform the transform on the input to get the results.
      	XMLSignatureInput input = new XMLSignatureInput(in);
        // System.out.println("input = \n" + new String(input.getBytes()));
      	XMLSignatureInput result = transforms.performTransforms(input);
        // System.out.println("result = \n" + new String(result.getBytes()));

        // Uncomment this section to see the transform output and save it to a file
        // String filePath = "..\\..\\SampleXmlFiles\\javaout.xml";
        // OutputStream outputStream = new FileOutputStream(filePath);
        // outputStream.write(result.getBytes());

      	// Uncomment this line to see transform output
      	// System.out.println("\noutput = \n" + new String(result.getBytes()));

      	// Second part is to run output via SHA1 digest
      	// This is done via the standard java.security API
		MessageDigest md = MessageDigest.getInstance(DEFAULT_SEC_HASH_ALGORITHM);
		md.update(result.getBytes());

		return md.digest();
	}

	protected abstract String getAlgorithm();
	
	
    /**
     * Utility method to Base64 encode the given byte array.
     * 
     * @param irMarkBytes
     *      This should be an IR Mark in its raw byte format.
     * @return
     *      The given byte array encoded into a Base64 String.
     */
    public static String toBase64(byte[] irMarkBytes)
    {
        return new String(Base64.encode(irMarkBytes));
    }
    
}
