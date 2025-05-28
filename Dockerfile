# Etapa 1: Construir frontend
FROM node:18-alpine AS frontend
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci --only=production
COPY frontend/ ./
RUN npm run build

# Etapa 2: Construir backend
FROM maven:3.9-openjdk-21 AS backend
WORKDIR /app
COPY pom.xml ./
COPY src/ ./src/
# Copiar frontend construido
COPY --from=frontend /app/build ./src/main/resources/static/
RUN mvn clean package -DskipTests

# Etapa 3: Ejecutar
FROM openjdk:21-jre-slim
WORKDIR /app
COPY --from=backend /app/target/*.jar app.jar

# Variables de entorno
ENV SPRING_PROFILES_ACTIVE=prod

# Exponer puerto
EXPOSE $PORT

# Ejecutar aplicación
CMD ["sh", "-c", "java -Dserver.port=$PORT -jar app.jar"]