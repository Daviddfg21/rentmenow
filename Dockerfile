# Dockerfile con build FORZADO LIMPIO
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

# LIMPIAR CACHE DE MAVEN Y FORZAR REBUILD COMPLETO
RUN rm -rf ~/.m2/repository
RUN mvn dependency:purge-local-repository -DreResolve=false || true
RUN mvn clean package -DskipTests -U -X

# Verificar que PostgreSQL esté en el JAR
RUN echo "=== VERIFICANDO CONTENIDO DEL JAR ===" && \
    jar -tf target/rentmenow-0.0.1-SNAPSHOT.jar | grep -i postgres && \
    echo "✅ PostgreSQL driver encontrado!" || \
    (echo "❌ PostgreSQL driver NO encontrado!" && exit 1)

# Exponer puerto
EXPOSE 8080

# Comando de inicio
CMD ["java", "-Dspring.profiles.active=prod", "-jar", "target/rentmenow-0.0.1-SNAPSHOT.jar"]