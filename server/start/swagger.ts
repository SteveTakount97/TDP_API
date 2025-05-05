import swaggerJsdoc from 'swagger-jsdoc'
import { HttpContext } from '@adonisjs/http-server'
import { writeFileSync } from 'fs'
import { stringify } from 'yaml'

// Spécification de Swagger
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API TDP',
      version: '1.0.0',
      description: 'Documentation API TDP avec Swagger',
    },
    servers: [
      {
        url: 'http://localhost:3333', 
        description: 'Serveur TDP',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],  
  },
  apis: ['./app/controllers/**/*.ts', './start/routes.ts'], // Chemin vers les contrôleurs
})

export default class SwaggerController {
  /**
   * Route pour afficher Swagger UI
   */
  public async showSwaggerUI({ response }: HttpContext) {
    response.header('Content-Type', 'text/html')
    return response.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Swagger UI</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.1/swagger-ui.min.css" />
        </head>
        <body>
          <div id="swagger-ui"></div>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.1/swagger-ui-bundle.min.js"></script>
          <script>
            const ui = SwaggerUIBundle({
              url: '/swagger-json',
              dom_id: '#swagger-ui',
            });
          </script>
        </body>
      </html>
    `)
  }

  /**
   * Fonction pour récupérer le fichier JSON Swagger
   */
  public async showSwaggerJSON({ response }: HttpContext) {
    return response.json(swaggerSpec)
  }
  /**
   * Générer le fichier swagger.yaml
   */
  public async generateSwaggerYaml() {
    const yamlData = stringify(swaggerSpec) // Convertir en YAML
    writeFileSync('swagger.yaml', yamlData) // Écrire dans un fichier
    console.log('✅ Fichier swagger.yaml généré avec succès !')
  }
  
}