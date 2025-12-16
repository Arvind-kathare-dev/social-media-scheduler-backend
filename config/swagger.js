import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ordina Backend API',
            version: '1.0.0',
            description: 'API documentation for Ordina Agency Management System',
            contact: {
                name: 'API Support',
                email: 'support@ordina.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:8000',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT token'
                }
            },
            schemas: {
                Agency: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'Agency ID'
                        },
                        agency_name: {
                            type: 'string',
                            description: 'Agency name'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Agency email'
                        },
                        contact_no: {
                            type: 'string',
                            description: 'Contact number'
                        },
                        date_of_birth: {
                            type: 'string',
                            format: 'date',
                            description: 'Date of birth'
                        },
                        agency_no: {
                            type: 'string',
                            description: 'Agency number'
                        },
                        license_no: {
                            type: 'string',
                            description: 'License number'
                        },
                        hospital_name: {
                            type: 'string',
                            description: 'Hospital name'
                        },
                        sign_threshold: {
                            type: 'string',
                            description: 'Signature threshold'
                        },
                        is_active: {
                            type: 'boolean',
                            description: 'Active status'
                        },
                        role: {
                            type: 'string',
                            enum: ['Admin', 'Staff'],
                            description: 'Agency role'
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation timestamp'
                        },
                        updated_at: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Last update timestamp'
                        }
                    }
                },
                AgencyInput: {
                    type: 'object',
                    required: ['agency_name', 'email', 'contact_no'],
                    properties: {
                        agency_name: {
                            type: 'string',
                            example: 'William Christiana'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'william.christiana023@gmail.com'
                        },
                        password: {
                            type: 'string',
                            format: 'password',
                            example: 'SecurePass123!'
                        },
                        contact_no: {
                            type: 'string',
                            example: '+1-415-555-1023'
                        },
                        date_of_birth: {
                            type: 'string',
                            format: 'date',
                            example: '1998-03-25'
                        },
                        agency_no: {
                            type: 'string',
                            example: 'AG25MG01'
                        },
                        license_no: {
                            type: 'string',
                            example: 'CA-458921'
                        },
                        hospital_name: {
                            type: 'string',
                            example: 'SAN Francisco General Hospital'
                        },
                        sign_threshold: {
                            type: 'string',
                            example: '2 Days'
                        },
                        is_active: {
                            type: 'boolean',
                            example: true
                        },
                        role: {
                            type: 'string',
                            enum: ['Admin', 'Staff'],
                            example: 'Admin'
                        }
                    }
                },
                LoginInput: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'william.christiana023@gmail.com'
                        },
                        password: {
                            type: 'string',
                            format: 'password',
                            example: 'your_password'
                        }
                    }
                },
                LoginResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'Success'
                        },
                        message: {
                            type: 'string',
                            example: 'Login successful'
                        },
                        data: {
                            type: 'object',
                            properties: {
                                token: {
                                    type: 'string',
                                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                                },
                                agency: {
                                    $ref: '#/components/schemas/Agency'
                                },
                                expiresIn: {
                                    type: 'string',
                                    example: '24h'
                                }
                            }
                        }
                    }
                },
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'Success'
                        },
                        message: {
                            type: 'string',
                            example: 'Operation successful'
                        },
                        data: {
                            type: 'object'
                        }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'Error'
                        },
                        message: {
                            type: 'string',
                            example: 'Error description'
                        },
                        error: {
                            type: 'string',
                            example: 'Detailed error message'
                        }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
