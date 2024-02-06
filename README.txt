.\IRMark.bat ..\..\SampleXmlFiles\test.xml

node MarkCalculator.js ../Samplexmlfiles/test.xml

javac -cp "lib/*" MarkCalculator.java

javac -cp "lib/*" MarkCalculator.java IRMarkCalculator.java

java -cp "lib/*" IRMarkCalculator ..\..\SampleXmlFiles\test.xml

java -cp ".;./lib/*" IRMarkCalculator ..\..\SampleXmlFiles\test.xml

java IRMarkCalculator ..\..\SampleXmlFiles\test.xml

java markcalculatorsrc.IRMarkCalculator ..\..\SampleXmlFiles\test.xml

javac -cp "lib/*" -d . MarkCalculator.java IRMarkCalculator.java

node IRMarker.js ../Samplexmlfiles/jstest.xml


// use that for compile java code 
javac -cp "lib/*" MarkCalculator.java IRMarkCalculator.java

//use that for run compiled java code
java -cp ".;./lib/*" IRMarkCalculator ..\..\SampleXmlFiles\test.xml

//use that for run javascript code
node IRMarker.js ../Samplexmlfiles/jstest.xml