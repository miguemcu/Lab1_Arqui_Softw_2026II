# UdeA Bank Portal

UdeA Bank

Contexto

Actúa como un desarrollador frontend senior. Necesito que construyas la interfaz web de un proyecto académico llamado UdeA Bank, hecho para un laboratorio de arquitectura de software. El backend ya existe (Spring Boot, arquitectura por capas: controller -> service -> entity -> repository, con DTOs y mappers) y es intencionalmente sencillo: solo maneja dos entidades, Customer y Transaction, con 5 endpoints en total. Tu tarea es SOLO el frontend; el backend no se debe modificar.

Identidad visual

La interfaz debe transmitir la identidad institucional de la Universidad de Antioquia (ver imagen de referencia adjunta: portal principal udea.edu.co). Tomar como referencia:

Verde institucional oscuro (aprox. #1E3D2F / #153726) para la barra superior y elementos de marca principal.

Verde medio/bosque (aprox. #356B37 / #3E7A3F) para la barra de navegación secundaria y acentos.

Amarillo/dorado (aprox. #F5B301 / #FFC107) como color de acento para botones de acción principal (ej. "Ingresar", CTAs importantes) — usarlo con moderación, como llamado a la acción, no como color base.

Blanco como fondo dominante del contenido, con tipografía oscura para buena legibilidad.

Tipografía sans-serif limpia, bold en títulos y navegación, similar a la usada en el portal (títulos en mayúsculas o semibold para secciones institucionales).

Estructura de layout inspirada en el portal: un header superior con marca/logo, una barra de navegación horizontal debajo, y contenido principal con tarjetas/tablas limpias, mucho espacio en blanco, bordes suaves.

Evitar un diseño genérico de "admin dashboard" gris; debe sentirse como un sistema institucional serio pero moderno.

No es necesario replicar el portal exacto, sino capturar su lenguaje visual (paleta, tipografía, jerarquía) aplicado a una aplicación bancaria simple.

Entidades y DTOs (ya definidos en el backend, no cambiar nombres de campos)

CustomerDTO

Long id;
String firstName;
String lastName;
String accountNumber;
Double balance;

TransactionDTO

Long id;
String senderAccountNumber;
String receiverAccountNumber;
Double amount;
LocalDateTime timestamp;

TransferRequestDTO (body para crear una transacción)

String senderAccountNumber;
String receiverAccountNumber;
Double amount;

Endpoints disponibles

Nota: en este primer prompt no se conocen las rutas exactas ni el puerto/base URL del backend. Deja la capa de llamadas a la API centralizada y fácil de configurar (una sola constante o archivo de configuración con la BASE_URL), para poder actualizarla después con la información real. Los 5 endpoints a integrar son conceptualmente:

GET todos los clientes

GET un cliente por id

POST crear cliente

POST transferir dinero entre cuentas (usa TransferRequestDTO)

GET transacciones por número de cuenta

Vistas requeridas

1. Consultar clientes (vista principal)

Tabla o listado de todos los clientes del banco, mostrando nombre completo, número de cuenta y saldo. Debe permitir ver el detalle de un cliente puntual (usando el endpoint de traer cliente por id) — puede ser un modal, un panel lateral o navegación a una sub-vista de detalle.

2. Transferencia de dinero entre cuentas (vista principal)

Formulario simple con: cuenta origen, cuenta destino, monto. Validaciones básicas de frontend (campos requeridos, monto numérico positivo, cuentas no vacías). Al enviar, debe mostrar claramente el resultado (éxito o error) devuelto por el backend. Pensar en un estado de carga mientras se procesa la transacción.

3. Histórico de transacciones por cliente (vista principal)

Permite ingresar o seleccionar un número de cuenta y consultar el listado de transacciones asociadas (enviadas y/o recibidas), mostrando cuenta origen, cuenta destino, monto y fecha/hora, ordenadas de forma descendente por fecha.

4. Crear cliente (vista secundaria)

Formulario para registrar un nuevo cliente (nombre, apellido, número de cuenta, saldo inicial), usando el endpoint de creación de cliente. Puede vivir como una sub-vista accesible desde la vista de "Consultar clientes" (ej. botón "Nuevo cliente" que abre este formulario), sin necesitar su propio ítem de navegación principal.

Requisitos técnicos generales

Aplicación de una sola página (SPA) con navegación entre las 3 vistas principales (más la vista secundaria de creación de cliente, anidada donde tenga más sentido).

Manejo de estados de carga y error para cada llamada a la API.

Formateo legible de moneda (ej. separador de miles, símbolo $) y de fechas (LocalDateTime del backend en formato ISO).

Responsive básico (debe verse bien en escritorio, que es el uso principal esperado para un laboratorio académico).

Código organizado: separar llamadas a la API (services/hooks), componentes de UI, y vistas/páginas.

No es necesario autenticación ni manejo de sesión — el laboratorio no lo contempla.

Stack sugerido

Usa el stack que consideres más simple y mantenible para un proyecto académico de este tamaño (ej. React, Angular, Vue, etc, con un router simple). Si tienes una recomendación clara, indícala antes de generar el código.

Siguiente paso

En un segundo mensaje (si está todo bien) te compartiré la URL base del backend, las rutas exactas de cada endpoint y sus verbos HTTP definitivos, para que ajustes la capa de conexión con la API.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e1baf3de-805e-47c1-8675-90ff2a3d857a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
