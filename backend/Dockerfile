# Build the Spring Boot application with the Java version declared in pom.xml.
FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /workspace
COPY pom.xml .
RUN mvn -B dependency:go-offline
COPY src ./src
RUN mvn -B clean package -DskipTests

# Keep the production image small: it only needs a Java runtime and the JAR.
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app
COPY --from=build /workspace/target/siadpl-api-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
