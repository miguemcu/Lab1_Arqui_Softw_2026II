# --- Etapa de build ---
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# --- Etapa de ejecución ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Crea un grupo y un usuario sin privilegios para ejecutar la aplicación.
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
# Copia el JAR asignando su propiedad al usuario de ejecución.
COPY --from=build --chown=appuser:appgroup /app/target/*.jar app.jar
EXPOSE 8088
# Declara el usuario sin privilegios antes de iniciar la aplicación.
USER appuser
ENTRYPOINT ["java", "-jar", "app.jar"]