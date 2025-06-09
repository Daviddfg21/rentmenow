# Usar imagen base de OpenJDK 17
FROM openjdk:17-jdk-slim

# Instalar Node.js para construir el frontend
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json del frontend
COPY frontend/package*.json ./frontend/

# Instalar dependencias del frontend
RUN cd frontend && npm ci --only=production

# Copiar el resto del código
COPY . .

# Construir el frontend
RUN cd frontend && npm run build

# Crear directorio para recursos estáticos y copiar build
RUN mkdir -p src/main/resources/static && \
    cp -r frontend/dist/* src/main/resources/static/

# Dar permisos al maven wrapper
RUN chmod +x ./mvnw

# Construir la aplicación Spring Boot
RUN ./mvnw clean package -DskipTests

# Exponer puerto
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["java", "-jar", "-Dspring.profiles.active=prod", "target/rentmenow-0.0.1-SNAPSHOT.jar"]