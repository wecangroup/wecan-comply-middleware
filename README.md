# Wecan Comply Middleware

A simplified REST API middleware for Wecan Comply that wraps the [`wecan-comply-sdk-js`](https://github.com/wecangroup/wecan-comply-sdk) to provide a clean HTTP interface.

## Features

- 🔐 **Simplified API**: RESTful endpoints that abstract the complexity of the [Wecan Comply API](https://wecan.atlassian.net/wiki/external/ZWYxZWNkZWEwNzk5NDYxMmExMWM2M2EzOTNiNTIwN2U)
- 📚 **Swagger Documentation**: Interactive API documentation with Swagger UI
- 🔒 **HTTPS Support**: Optional HTTPS server with SSL/TLS certificate configuration
- 🚀 **Express.js**: Fast and reliable web framework
- ⚙️ **Configuration**: Flexible configuration via JSON files and environment variables
- 🐳 **Docker Ready**: Containerized with Docker and Docker Compose (dev and prod)
- 📦 **Published to GHCR**: Docker images available on GitHub Container Registry

## Prerequisites

- Node.js >= 20
- npm or yarn
- Docker (optional, for containerized deployment)

## Installation

1. Clone the repository and navigate to the project:
   ```bash
   cd wecan-comply-middleware
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment example file:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` and fill in your sensitive credentials (Wecan Comply External Access Token):
   ```env
   WECAN_ACCESS_TOKEN=your_wecan_token_here
   ```

5. (Optional) Edit `config/default.json` for non-sensitive configuration:
   ```json
   {
     "server": {
       "port": 3000,
       "host": "0.0.0.0"
     },
     "wecanComply": {
       "workspaceUrlTemplate": "https://{workspaceUuid}.int.wecancomply.ch"
     }
   }
   ```

## Development

### Local Development

Run in development mode with hot reload:
```bash
npm run dev
```

Build the project:
```bash
npm run build
```

Run the production build:
```bash
npm start
```

### Docker Development

For development and testing in a Docker container with hot-reload:

```bash
# Start development container
docker-compose up wecan-comply-middleware-dev

# Or in detached mode
docker-compose up -d wecan-comply-middleware-dev

# View logs
docker-compose logs -f wecan-comply-middleware-dev

# Stop container
docker-compose down
```

The development container mounts your source code, so changes are automatically reflected with hot-reload.

## Configuration

### Configuration File (`config/default.json`)

Non-sensitive configuration can be set in `config/default.json`:

- `server.port`: Server port (default: 3000)
- `server.host`: Server host (default: 0.0.0.0)
- `wecanComply.workspaceUrlTemplate`: Template for workspace-specific URLs
- `wecanComply.timeoutMs`: Request timeout in milliseconds (default: 30000)
- `wecanComply.retries`: Number of retry attempts (default: 2)
- `logging.level`: Log level (default: info)
- `logging.format`: Log format - "json" or "console" (default: json)
- `cors.enabled`: Enable CORS (default: true)
- `cors.origin`: CORS origin (default: "*")

### Environment Variables

Sensitive configuration should be set via environment variables:

- `WECAN_ACCESS_TOKEN`: Wecan authentication token (required)
- `PORT`: Server port (overrides config file)
- `HOST`: Server host (overrides config file)
- `NODE_ENV`: Environment (development/production)
- `LOG_LEVEL`: Log level (overrides config file)
- `WECAN_WORKSPACE_URL_TEMPLATE`: Workspace URL template (overrides config file)
- `HTTPS_ENABLED`: Enable HTTPS server (set to `true` to enable)
- `HTTPS_KEY_PATH`: Path to the private key file (required if HTTPS_ENABLED=true)
- `HTTPS_CERT_PATH`: Path to the certificate file (required if HTTPS_ENABLED=true)

## HTTPS Configuration

To enable HTTPS, set the following environment variables:

```env
HTTPS_ENABLED=true
HTTPS_KEY_PATH=/path/to/private-key.pem
HTTPS_CERT_PATH=/path/to/certificate.pem
```

The server will automatically use HTTPS when `HTTPS_ENABLED=true` and both certificate paths are provided. If HTTPS is not enabled, the server will run on HTTP (default behavior).

**Note**: Make sure the certificate files are readable by the application and have the correct permissions.

## API Documentation

Interactive API documentation is available via Swagger UI at:
- **Development (HTTP)**: `http://localhost:3000/api-docs`
- **Development (HTTPS)**: `https://localhost:3000/api-docs`

The Swagger documentation provides:
- Complete API endpoint descriptions
- Request/response schemas
- Example requests and responses
- Interactive testing capabilities

## API Endpoints

### Health Check
- `GET /health` - Health check endpoint

### Workspaces
- `GET /api/workspaces/:workspaceUuid` - Get workspace details
- `GET /api/workspaces/:workspaceUuid/business-types` - Get business types
  - Query: `available_for_business_type` (optional)
- `GET /api/workspaces/:workspaceUuid/relations` - Get workspace relations
- `GET /api/workspaces/:workspaceUuid/network` - Get network entries
  - Query: `business_type` (optional)
- `GET /api/workspaces/:workspaceUuid/push-categories` - Get push categories
  - Query: `template_type` (optional)

### Vaults
- `GET /api/workspaces/:workspaceUuid/vaults` - Get all vaults
- `POST /api/workspaces/:workspaceUuid/vaults` - Create a new vault
  - Body: `{ name, template_type, push_category_uuid, relation_uuids }`
- `GET /api/workspaces/:workspaceUuid/vaults/:vaultId/placeholders` - Get vault placeholders
- `GET /api/workspaces/:workspaceUuid/vaults/:vaultId/answers` - Get vault answers (decrypted)
- `PUT /api/workspaces/:workspaceUuid/vaults/:vaultId/answers` - Save vault answers
- `GET /api/workspaces/:workspaceUuid/vaults/:vaultId/files/:fileUuid` - Download vault file
  - Query: `mimetype` (required)
- `POST /api/workspaces/:workspaceUuid/vaults/:vaultId/lock` - Lock vault
- `POST /api/workspaces/:workspaceUuid/vaults/:vaultId/unlock` - Unlock vault
- `POST /api/workspaces/:workspaceUuid/vaults/:vaultId/share` - Share vault with a relation
  - Body: `{ relation_uuid }`

## Docker Deployment

### Using Pre-built Image from GitHub Container Registry

The Docker image is automatically published to GitHub Container Registry on each release. You can pull and use it directly:

```bash
# Pull the latest image
docker pull ghcr.io/wecangroup/wecan-comply-middleware:latest

# Or pull a specific version
docker pull ghcr.io/wecangroup/wecan-comply-middleware:v0.1.0

# Run the container
docker run -d \
  --name wecan-comply-middleware \
  -p 3000:3000 \
  -e WECAN_ACCESS_TOKEN=your_token \
  -v $(pwd)/logs:/app/logs \
  ghcr.io/wecangroup/wecan-comply-middleware:latest
```

### Development with Docker (Hot-reload)

For development and testing with hot-reload support:

1. Create a `.env` file with your credentials (see `.env.example`)

2. Start the development container:
   ```bash
   docker-compose up wecan-comply-middleware-dev
   ```

   Or run in detached mode:
   ```bash
   docker-compose up -d wecan-comply-middleware-dev
   ```

3. View logs:
   ```bash
   docker-compose logs -f wecan-comply-middleware-dev
   ```

4. The container will automatically reload when you modify files in `src/` or `config/`

5. Stop the service:
   ```bash
   docker-compose down
   ```

### Production with Docker

#### Using Docker Compose

1. Create a `.env` file with your credentials (see `.env.example`)

2. Start the production service:
   ```bash
   docker-compose --profile production up -d wecan-comply-middleware
   ```

3. View logs:
   ```bash
   docker-compose logs -f wecan-comply-middleware
   ```

4. Stop the service:
   ```bash
   docker-compose down
   ```

#### Using Docker directly

1. Build the Docker image:
   ```bash
   docker build -t wecan-comply-middleware .
   ```

2. Run the container:
   ```bash
   docker run -d \
     --name wecan-comply-middleware \
     -p 3000:3000 \
     -e WECAN_ACCESS_TOKEN=your_token \
     -v $(pwd)/logs:/app/logs \
     wecan-comply-middleware
   ```

3. View logs:
   ```bash
   docker logs -f wecan-comply-middleware
   ```

4. Stop the container:
   ```bash
   docker stop wecan-comply-middleware
   docker rm wecan-comply-middleware
   ```

## Logging

Logs are written to:
- **Console**: All log levels (formatted for readability)
- **logs/combined.log**: All logs in JSON format (production only)
- **logs/error.log**: Error logs only in JSON format (production only)

Log levels: `error`, `warn`, `info`, `debug`

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

HTTP status codes:
- `200`: Success
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error
- `503`: Service Unavailable (health check)

## Publishing Docker Images

Docker images are automatically built and published to GitHub Container Registry (GHCR) when:
- A Git tag is created (e.g., `v0.1.0`)
- Manual workflow dispatch is triggered

**Important**: Docker image tags are automatically generated from the `version` field in `package.json`. For example, if `package.json` contains `"version": "0.1.1"`, the following tags will be created:
- `v0.1.1` - Version with 'v' prefix
- `0.1.1` - Exact version
- `latest` - Always points to the latest published version

The published images are available at:
```
ghcr.io/wecangroup/wecan-comply-middleware:latest
ghcr.io/wecangroup/wecan-comply-middleware:v0.1.1
ghcr.io/wecangroup/wecan-comply-middleware:0.1.1
```

### Manual Publishing

To manually publish a Docker image:

1. Build the image:
   ```bash
   docker build -t ghcr.io/wecangroup/wecan-comply-middleware:latest .
   ```

2. Login to GitHub Container Registry:
   ```bash
   echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin
   ```

3. Push the image:
   ```bash
   docker push ghcr.io/wecangroup/wecan-comply-middleware:latest
   ```

## License

MIT

