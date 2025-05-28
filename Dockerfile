# Usar imagen base con Java y Node.js
FROM node:18-alpine AS frontend-build

# Construir el frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Imagen base para Java
FROM openjdk:21-jdk-slim AS backend-build

# Instalar Maven
RUN apt-get update && apt-get install -y maven

# Construir el backend
WORKDIR /app
COPY pom.xml ./
COPY src/ ./src/

# Copiar el frontend construido
COPY --from=frontend-build /app/frontend/build ./src/main/resources/static/

# Construir el JAR
RUN mvn clean package -DskipTests

# Imagen final
FROM openjdk:21-jre-slim

# Crear directorio de trabajo
WORKDIR /app

# Copiar el JAR construido
COPY --from=backend-build /app/target/*.jar app.jar

# Exponer puerto (Railway usa la variable PORT)
EXPOSE $PORT

# Comando para ejecutar (Railway maneja el puerto automáticamente)
CMD ["java", "-Dspring.profiles.active=prod", "-Dserver.port=$PORT", "-jar", "app.jar"]