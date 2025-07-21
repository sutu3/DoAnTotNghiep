# --- BUILD STAGE ---
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

# --- RUNTIME STAGE ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN apk add --no-cache curl

RUN addgroup -S spring && adduser -S spring -G spring

COPY --from=builder /app/target/*.jar app.jar
RUN chown spring:spring app.jar

USER spring:spring

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
