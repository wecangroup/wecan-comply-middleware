import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Wecan Comply Middleware API',
    version: '0.1.0',
    description: 'A simplified REST API middleware for Wecan Comply that wraps the wecan-comply-sdk to provide a clean HTTP interface',
    contact: {
      name: 'Wecan Group',
    },
    license: {
      name: 'MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  tags: [
    {
      name: 'Health',
      description: 'Health check endpoints',
    },
    {
      name: 'Workspaces',
      description: 'Workspace management endpoints',
    },
    {
      name: 'Vaults',
      description: 'Vault management endpoints',
    },
  ],
  components: {
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: 'Error type',
          },
          message: {
            type: 'string',
            description: 'Detailed error message',
          },
        },
        required: ['error', 'message'],
      },
      HealthStatus: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['healthy', 'unhealthy'],
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
          },
          service: {
            type: 'string',
          },
          error: {
            type: 'string',
            description: 'Error message (only present when unhealthy)',
          },
        },
        required: ['status', 'timestamp', 'service'],
      },
      WorkspaceDetails: {
        type: 'object',
        properties: {
          uuid: {
            type: 'string',
          },
          url: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
          business_type: {
            type: 'string',
          },
          public_key: {
            type: 'string',
          },
        },
      },
      BusinessType: {
        type: 'object',
        properties: {
          label: {
            type: 'string',
          },
          value: {
            type: 'string',
          },
        },
      },
      Relation: {
        type: 'object',
        properties: {
          uuid: {
            type: 'string',
          },
          status: {
            type: 'string',
          },
          business_type: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
          is_virtual: {
            type: 'boolean',
          },
          public_key: {
            type: 'string',
          },
        },
      },
      NetworkEntry: {
        type: 'object',
        properties: {
          uuid: {
            type: 'string',
          },
          status: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
          is_virtual: {
            type: 'boolean',
          },
          business_type: {
            type: 'string',
          },
          public_key: {
            type: 'string',
          },
          url: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          street: {
            type: 'string',
          },
          city: {
            type: 'string',
          },
          zip_code: {
            type: 'string',
          },
          country: {
            type: 'string',
          },
          fax: {
            type: 'string',
          },
          phone: {
            type: 'string',
          },
          website: {
            type: 'string',
          },
          contact_name: {
            type: 'string',
          },
          contact_email: {
            type: 'string',
          },
        },
      },
      Vault: {
        type: 'object',
        properties: {
          uuid: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
          status: {
            type: 'string',
          },
          template_type: {
            type: 'string',
          },
          last_updated: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
          },
          message: {
            type: 'string',
          },
        },
        required: ['success', 'message'],
      },
    },
    parameters: {
      WorkspaceUuid: {
        name: 'workspaceUuid',
        in: 'path',
        required: true,
        schema: {
          type: 'string',
        },
        description: 'The UUID of the workspace',
      },
      VaultId: {
        name: 'vaultId',
        in: 'path',
        required: true,
        schema: {
          type: 'string',
        },
        description: 'The UUID of the vault',
      },
      FileUuid: {
        name: 'fileUuid',
        in: 'path',
        required: true,
        schema: {
          type: 'string',
        },
        description: 'The UUID of the file',
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options);

