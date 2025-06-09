#!/bin/bash

set -e  # Salir si algún comando falla

echo "🚀 Iniciando build de RentMeNow..."

echo "📁 Navegando al directorio frontend..."
cd frontend

echo "🔧 Instalando dependencias del frontend..."
npm install

echo "🏗️ Construyendo el frontend..."
npm run build

echo "📁 Volviendo al directorio raíz..."
cd ..

echo "📁 Copiando archivos del frontend a recursos estáticos..."
mkdir -p src/main/resources/static
cp -r frontend/dist/* src/main/resources/static/

echo "🔧 Dando permisos de ejecución a Maven Wrapper..."
chmod +x ./mvnw

echo "📦 Construyendo la aplicación Spring Boot..."
./mvnw clean package -DskipTests -Dspring.profiles.active=prod

echo "✅ Build completado exitosamente!"
echo "📋 Archivos generados:"
echo "   - Frontend: src/main/resources/static/"
echo "   - Backend JAR: target/rentmenow-0.0.1-SNAPSHOT.jar"
