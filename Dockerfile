# Dockerfile simplificado para Railway
FROM eclipse-temurin:21-jdk

# Instalar Node.js para construir el frontend
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Instalar Maven
RUN apt-get install -y maven

WORKDIR /app

# Copiar y construir frontend primero
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# Copiar el build del frontend a resources/static
RUN mkdir -p src/main/resources/static && \
    cp -r frontend/build/* src/main/resources/static/

# Copiar archivos del backend
COPY pom.xml ./
COPY src/ ./src/

# Construir el JAR
RUN mvn clean package -DskipTests

# Exponer puerto
EXPOSE 8080

# Comando de inicio
CMD ["java", "-Dserver.port=${PORT:-8080}", "-Dspring.profiles.active=prod", "-jar", "target/rentmenow-0.0.1-SNAPSHOT.jar"]