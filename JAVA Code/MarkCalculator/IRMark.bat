@echo off
set CLASSPATH=.
set CLASSPATH=%CLASSPATH%;lib/jce-jdk13-114.jar
set CLASSPATH=%CLASSPATH%;lib/xmlsec-1.4.1.jar
set CLASSPATH=%CLASSPATH%;lib/xalan_enhanced.jar
set CLASSPATH=%CLASSPATH%;lib/commons-logging-1.1.1.jar
set CLASSPATH=%CLASSPATH%;lib/markcalc.jar

java uk.gov.hmrc.mark.IRMarkCalculator %1