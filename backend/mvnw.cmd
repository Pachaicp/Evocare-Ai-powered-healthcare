@REM -----------------------------------------------------------------------
@REM Maven Wrapper startup batch script
@REM -----------------------------------------------------------------------
@IF "%__MVNW_ARG0_NAME__%"=="" (SET "BASE_JAVA_EXE=%JAVA_HOME%\bin\java.exe")
@SET MAVEN_WRAPPER_JAR="%MAVEN_PROJECT_BASEDIR%\.mvn\wrapper\maven-wrapper.jar"
@SET DOWNLOAD_URL="https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar"

@REM Download wrapper if not present
@IF NOT EXIST %MAVEN_WRAPPER_JAR% (
    powershell -Command "Invoke-WebRequest -Uri %DOWNLOAD_URL% -OutFile %MAVEN_WRAPPER_JAR%"
)

@"%JAVA_HOME%\bin\java.exe" -jar %MAVEN_WRAPPER_JAR% %*
