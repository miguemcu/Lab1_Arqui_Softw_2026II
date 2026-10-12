[![CI/CD Pipeline](https://github.com/miguemcu/Lab1_Arqui_Softw_2026II/actions/workflows/build.yml/badge.svg)](https://github.com/miguemcu/Lab1_Arqui_Softw_2026II/actions/workflows/build.yml)
[![Quality gate status](https://sonarcloud.io/api/project_badges/measure?project=miguemcu_Lab1_Arqui_Softw_2026II&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=miguemcu_Lab1_Arqui_Softw_2026II)
[![Coverage Status](https://coveralls.io/repos/github/miguemcu/Lab1_Arqui_Softw_2026II/badge.svg?branch=main)](https://coveralls.io/github/miguemcu/Lab1_Arqui_Softw_2026II?branch=main)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=miguemcu_Lab1_Arqui_Softw_2026II&metric=coverage)](https://sonarcloud.io/summary/new_code?id=miguemcu_Lab1_Arqui_Softw_2026II)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=miguemcu_Lab1_Arqui_Softw_2026II&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=miguemcu_Lab1_Arqui_Softw_2026II)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=miguemcu_Lab1_Arqui_Softw_2026II&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=miguemcu_Lab1_Arqui_Softw_2026II)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=miguemcu_Lab1_Arqui_Softw_2026II&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=miguemcu_Lab1_Arqui_Softw_2026II)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=miguemcu_Lab1_Arqui_Softw_2026II&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=miguemcu_Lab1_Arqui_Softw_2026II)
[![Maintainability issues](https://sonarcloud.io/api/project_badges/measure?project=miguemcu_Lab1_Arqui_Softw_2026II&metric=software_quality_maintainability_issues)](https://sonarcloud.io/summary/new_code?id=miguemcu_Lab1_Arqui_Softw_2026II)
[![Reliability issues](https://sonarcloud.io/api/project_badges/measure?project=miguemcu_Lab1_Arqui_Softw_2026II&metric=software_quality_reliability_issues)](https://sonarcloud.io/summary/new_code?id=miguemcu_Lab1_Arqui_Softw_2026II)
[![Security issues](https://sonarcloud.io/api/project_badges/measure?project=miguemcu_Lab1_Arqui_Softw_2026II&metric=software_quality_security_issues)](https://sonarcloud.io/summary/new_code?id=miguemcu_Lab1_Arqui_Softw_2026II)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=miguemcu_Lab1_Arqui_Softw_2026II&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=miguemcu_Lab1_Arqui_Softw_2026II)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=miguemcu_Lab1_Arqui_Softw_2026II&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=miguemcu_Lab1_Arqui_Softw_2026II)

# UdeA Bank - Laboratorio de Arquitectura de Software

Aplicación bancaria simple desarrollada como laboratorio de la materia Arquitectura de Software (UdeA). Permite consultar clientes, transferir dinero entre cuentas y ver el histórico de transacciones.

|Información de Laboratorios|
|---|
|[Ir al Laboratorio #1](#1-laboratorio-1---base-del-repositorio)|
|[Ir al Laboratorio #2](#2-laboratorio-2---calidad-y-automatización)|

## 1. Laboratorio #1 - Base del repositorio
### 1.1 Cómo ejecutarlo

#### Requisitos previos
- Motor compatible con Docker (como [Docker Desktop](https://www.docker.com/products/docker-desktop/), Podman o Docker Engine en WSL2/Linux) instalado y corriendo.
- No se necesita instalar Java, Node, Maven ni MySQL localmente. Todo corre dentro de los contenedores.

#### Pasos

```bash
git clone <url-del-repo>
cd <carpeta-del-repo>
docker compose up --build
```

La primera vez suele tardar varios minutos (descarga imágenes base y compila backend y frontend). Las siguientes veces es más rápido.

Cuando termine, quedará disponible:

| Servicio | URL | Descripción |
|---|---|---|
| Frontend | http://localhost:3000 | Interfaz web de la aplicación |
| Backend (API) | http://localhost:8088 | API REST del backend |
| MySQL (opcional, acceso externo) | localhost:3307 | Solo si se quiere inspeccionar la base con un cliente gráfico (DBeaver, MySQL Workbench, etc.) |

> **Nota:** el proyecto arranca con la base de datos vacía. Se tendrá que crear al menos un cliente desde la vista "Crear cliente" del frontend antes de poder probar transferencias.

Para detener todo:
```bash
docker compose down
```

Para detener y borrar también los datos guardados (reiniciar desde cero):
```bash
docker compose down -v
```

### 1.2. Funcionamiento de la app

UdeA Bank maneja dos entidades: **Customer** (cliente) y **Transaction** (transacción), con 5 endpoints en total en el backend.

#### Vistas principales

1. **Consultar clientes**: listado de todos los clientes (nombre, número de cuenta, saldo), con opción de ver el detalle de un cliente puntual. Desde aquí también se accede al formulario de "Crear cliente" (nombre, apellido, número de cuenta, saldo inicial).
2. **Transferencia de dinero**: formulario con cuenta origen, cuenta destino y monto. Valida campos requeridos y monto positivo antes de enviar, y muestra el resultado (éxito o el mensaje de error que devuelva el backend) con un estado de carga mientras procesa.
3. **Histórico de transacciones**: consulta las transacciones asociadas a un número de cuenta (enviadas y recibidas), ordenadas por fecha descendente.

#### Reglas de negocio relevantes

- Una transferencia falla (400 Bad Request) si: faltan cuentas, el remitente no existe, el receptor no existe, o el remitente no tiene saldo suficiente. El mensaje de error viene listo para mostrar tal cual desde el backend.
- Crear un cliente requiere que el campo `balance` no sea nulo.

#### Identidad visual

El frontend sigue la paleta institucional de la Universidad de Antioquia: verde institucional oscuro para el header, verde medio para navegación secundaria, y dorado como color de acento para botones de acción principal (ej. "Ingresar").

### 1.3. Stack tecnológico

#### Backend
- Java 21
- Spring Boot 4.0.8
- Spring Data JPA + Hibernate (MySQL dialect, `ddl-auto=update`)
- MapStruct (mapeo entre entidades y DTOs)
- Lombok
- Arquitectura por capas: `controller → service → entity → repository`, con DTOs y mappers
- Maven (con wrapper `mvnw`)

#### Frontend
- React 19
- TanStack Start / TanStack Router (vía `@lovable.dev/vite-tanstack-config`, con Vite y build por Nitro)
- TailwindCSS 4
- pnpm como gestor de paquetes

#### Base de datos
- MySQL 8.4 (imagen oficial de Docker)

#### Infraestructura
- Docker + Docker Compose (backend, frontend y MySQL como servicios independientes, con red interna y volumen persistente para los datos de MySQL)

## 2. Laboratorio #2 - Calidad y Automatización

En este laboratorio se incorporaron prácticas de calidad y automatización para el backend:

- **Infraestructura de pruebas:** H2 en memoria y JaCoCo para ejecutar pruebas sin depender de MySQL y medir cobertura.
- **Pruebas automatizadas:** pruebas unitarias para services, controllers, mappers y DTOs.
- **Integración continua:** workflow de CI/CD que ejecuta compilación, pruebas y publica los reportes de cobertura.
- **Análisis estático:** integración con SonarQube Cloud para revisar calidad, seguridad, mantenibilidad y cobertura.

[![SonarQube Cloud](https://sonarcloud.io/images/project_badges/sonarcloud-highlight.svg)](https://sonarcloud.io/summary/new_code?id=miguemcu_Lab1_Arqui_Softw_2026II)
[![Quality gate](https://sonarcloud.io/api/project_badges/quality_gate?project=miguemcu_Lab1_Arqui_Softw_2026II)](https://sonarcloud.io/summary/new_code?id=miguemcu_Lab1_Arqui_Softw_2026II)
