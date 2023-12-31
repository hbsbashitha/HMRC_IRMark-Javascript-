Mark Calculator ZIP

Folders
--------

MarkCalculator
MarkCalculator\lib
MarkCalculator-src

Files
--------

HMRCMark.bat
IRMark.bat

commons-logging-1.1.1.jar
jce-jdk13-114.jar
markcalc.jar
xalan_enhanced.jar
xmlsec-1.4.1.jar

HMRCMarkCalculator.java
IRMarkCalculator.java
MarkCalculator.java

Instructions
--------------

*Decompress the ZIP file, you should end up with a folder structure that contains the above mentioned folders and files.

*The folder MarkCalculator contains two batch files, HMRCMark.bat (SOAP services like EMCS, ICS) and IRmark.bat (Govtalk Envelope services like EOY, SA, and CT). To run these files open a command prompt and type HMRCMark.bat <pathtoyourxmlfile> or IRmark.bat <pathtoyourxmlfile>, the output will be the IRmark for the XML file you supplied. Make sure the "lib" folder is present as this contains the libraries used by the application.

*The folder MarkCalculator-src contains the JAVA source files for this application you will need to be conversant in JAVA to be able to compile and use these files; you will also need the JAR libraries in the "lib" folder as these code files are dependent on them.

Dependencies
--------------

You will need JAVA 1.4 or later installed.


---DISCLAIMER---

This software is developed free of any license restrictions, however it is UNSUPPORTED. Use of this software is entirely 
at the user's own risk.

This software is not designed or intended to be used for calculating an IRmark on large returns.