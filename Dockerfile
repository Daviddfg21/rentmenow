# Etapa 1: Construir frontend
FROM node:18-alpine AS frontend
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Etapa 2: Construir backend
FROM eclipse-temurin:21-jdk AS backend
RUN apt-get update && apt-get install -y maven
WORKDIR /app
COPY pom.xml ./
COPY src/ ./src/
COPY --from=frontend /app/build ./src/main/resources/static/
RUN mvn clean package -DskipTests

# Etapa 3: Ejecutar - COPIA DIRECTA
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=backend /app/target/rentmenow-0.0.1-SNAPSHOT.jar app.jar
ENV SPRING_PROFILES_ACTIVE=prod
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]