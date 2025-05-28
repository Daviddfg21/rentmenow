# Etapa 1: Construir frontend
FROM node:18-alpine AS frontend
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Etapa 2: Construir backend
FROM eclipse-temurin:21-jdk AS backend

# Instalar Maven
RUN apt-get update && apt-get install -y maven

WORKDIR /app
COPY pom.xml ./
COPY src/ ./src/

# Copiar frontend construido
COPY --from=frontend /app/build ./src/main/resources/static/

# Construir JAR
RUN mvn clean package -DskipTests

# Etapa 3: Ejecutar
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copiar JAR construido
COPY --from=backend /app/target/*.jar app.jar

# Variables de entorno
ENV SPRING_PROFILES_ACTIVE=prod

# Exponer puerto
EXPOSE 8080

# Ejecutar aplicación
CMD ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar app.jar"]