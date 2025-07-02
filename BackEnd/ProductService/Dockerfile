# =================================================================
# Stage 1: Build aplication
# SỬA Ở ĐÂY: Dùng image Maven với Java 21 LTS (bản này tồn tại)
# =================================================================
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder

WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# =================================================================
# Stage 2: Create final runnable image
# SỬA Ở ĐÂY: Image cuối cùng cũng dùng Java 21 JRE để đồng bộ
# =================================================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]