# Wecan Comply Middleware

A simplified REST API middleware for Wecan Comply that wraps the `wecan-comply-sdk` to provide a clean HTTP interface.

## Features

- 🔐 **Simplified API**: RESTful endpoints that abstract the complexity of the Wecan Comply SDK
- 📚 **Swagger Documentation**: Interactive API documentation with Swagger UI
- 🚀 **Express.js**: Fast and reliable web framework
- 📝 **Winston Logger**: Structured logging with multiple transports
- ⚙️ **Configuration**: Flexible configuration via JSON files and environment variables
- 🐳 **Docker Ready**: Containerized with Docker and Docker Compose
- 🔒 **Security**: Helmet.js for security headers, CORS support
- 📦 **TypeScript**: Full type safety

## Prerequisites

- Node.js >= 18
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

4. Edit `.env` and fill in your sensitive credentials:
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
- `NODE_ENV`: Environment (development/production)
- `LOG_LEVEL`: Log level (overrides config file)
- `WECAN_WORKSPACE_URL_TEMPLATE`: Workspace URL template (overrides config file)

## API Documentation

Interactive API documentation is available via Swagger UI at:
- **Development**: `http://localhost:3000/api-docs`

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

### Vaults
- `GET /api/workspaces/:workspaceUuid/vaults` - Get all vaults
- `GET /api/workspaces/:workspaceUuid/vaults/:vaultId/placeholders` - Get vault placeholders
- `GET /api/workspaces/:workspaceUuid/vaults/:vaultId/answers` - Get vault answers (decrypted)
- `PUT /api/workspaces/:workspaceUuid/vaults/:vaultId/answers` - Save vault answers
- `GET /api/workspaces/:workspaceUuid/vaults/:vaultId/files/:fileUuid` - Download vault file
  - Query: `mimetype` (required)
- `POST /api/workspaces/:workspaceUuid/vaults/:vaultId/lock` - Lock vault
- `POST /api/workspaces/:workspaceUuid/vaults/:vaultId/unlock` - Unlock vault

## Docker Deployment

### Build and Run with Docker

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
     wecan-comply-middleware
   ```

### Docker Compose

1. Create a `.env` file with your credentials (see `.env.example`)

2. Start the service:
   ```bash
   docker-compose up -d
   ```

3. View logs:
   ```bash
   docker-compose logs -f
   ```

4. Stop the service:
   ```bash
   docker-compose down
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

## Development Tips

- The SDK client is initialized lazily on first use
- All routes are async and handle errors automatically
- Request/response logging is enabled by default
- Health check endpoint verifies SDK client initialization

## License

MIT

