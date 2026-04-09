# Microservice Notification

A specialized NestJS Microservice for handling notifications (Email and SMS) via TCP.

## Description

This service is key component of the system architecture, responsible for:
-   Sending Emails via **Resend**
-   Handling SMS notifications (Placeholder)

It operates as a **TCP Microservice** listening on port **3001** (default).

## Installation

```bash
$ npm install
```

## Running the Service

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Configuration

The service accepts the following environment variables (in `.env`):

| Variable         | Description                          | Default |
| ---------------- | ------------------------------------ | ------- |
| `PORT`           | Port for TCP listener                | `3001`  |
| `RESEND_API_KEY` | API Key for Resend email service     | (Req)   |

## Message Patterns

The service listens for the following **Event Patterns** (Fire-and-Forget):

### 1. `send_mail`

Sends an email.

**Payload:**
```typescript
{
  email: string;      // Recipient email
  subject?: string;   // Optional subject
  html?: string;      // Optional HTML content
}
```

### 2. `send_sms`

(Placeholder implementation)

**Payload:**
```typescript
{
  phoneNumber: string;
  message: string;
}
```

## Client usage Example

To communicate with this microservice from another NestJS application:

```typescript
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

const client = ClientProxyFactory.create({
  transport: Transport.TCP,
  options: {
    port: 3001,
  },
});

// Send an email
client.emit('send_mail', {
  email: 'user@example.com',
  subject: 'Welcome!',
  html: '<h1>Hello World</h1>'
});
```

## CI/CD (Jenkins)
This project includes a Jenkinsfile for automated integration. The pipeline ensures code quality and build stability.

- Prerequisites for Jenkins
To ensure the pipeline runs correctly, the following must be configured:

1. NodeJS Plugin: The Jenkins instance must have the NodeJS plugin installed.

2. Global Tool Configuration: A NodeJS installation named NodeJS 25 must be defined.

3. Credentials: A "Secret text" credential with the ID RESEND_API_KEY_SECRET must be created to store the Resend API key securely.

- Pipeline Stages
The automated pipeline executes the following steps:

1. Récupération du code: Retrieves the source from the SCM.

2. Installation des dépendances: Executes npm install.

3. Tests Unitaires & Validation: Runs unit tests using npm run test.

4. Tests E2E: Executes end-to-end tests using npm run test:e2e.

5. Build: Compiles the project using npm run build.
