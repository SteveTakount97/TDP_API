/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import UsersController from '#controllers/users_controller'
import AuthController from '#controllers/auth_controller'
import TontinesController from '#controllers/tontines_controller'
import TransactionLogsController from '#controllers/transaction_logs_controller'
import PaymentsController from '#controllers/payments_controller'
import TontineMembershipsController from '#controllers/memberships_controller'
import CyclesController from '#controllers/cycles_controller'
import SwaggerController from './swagger.js'


const userController = new UsersController()
const authController = new AuthController()
const tontineController = new TontinesController()
const transactionController = new TransactionLogsController()
const paiementController = new PaymentsController()
const membershipController = new TontineMembershipsController()
const cycleController = new CyclesController()
const swaggerController = new SwaggerController()

router.get('/', async () => {
  return 'Bienvenue sur l\'API TDP Tontine Digital PlateForm'
})
// Route pour afficher Swagger UI
router.get('/swagger-ui', swaggerController.showSwaggerUI.bind(swaggerController))

// Route pour récupérer le fichier JSON Swagger
router.get('/swagger-json', swaggerController.showSwaggerJSON.bind(swaggerController))
router.get('/swagger-yaml', swaggerController.generateSwaggerYaml.bind(swaggerController))


router.group(() => {

  //Authentification
  router.post('api/register', authController.register)
  router.post('api/login', authController.login)
  router.post('api/logout', authController.logout)

  //gestion des utilisateurs
  router.post('/user/image/', userController.uploadProfileImage)
  router.get('/user/', userController.index) 
  router.get('/user/:id', userController.show) 
  router.put('/user/:id', userController.update) 
  router.put('/user/:id/desactive', userController.deactivate) 


  //gestion Tontine
  router.post('/admin/create', tontineController.store)
  router.get('/admin/tontine', tontineController.index)
  router.get('/admin/tontine/:id', tontineController.show)
  router.put('/admin/tontine/!id', tontineController.update)
  router.delete('/admin/tontine/:id', tontineController.destroy)
  

  //membreship
  router.post('mermbership/:id', membershipController.store)
  router.get('mermbership/:id', membershipController.index)
  router.get('/membership/:id/users/seach', membershipController.searchUsers)
  router.put('mermbership/:id', membershipController.update)
  router.delete('mermbership/:id', membershipController.destroy)

  //paiement
  router.get('Payment/:id', paiementController.show)
  router.post('Payment/:id', paiementController.store)
  router.get('Payment/user/', paiementController.index)
  
  //gestion des cycles
  router.post('/Cycle-tontine/', cycleController.store)
  router.get('/Cycle-tontine/:id', cycleController.show)
  router.get('/Cycle-tontine/', cycleController.index)

  // Logs de transactions
  router.get('/transaction/user/:id', transactionController.index)
  router.get('/transaction/:id', transactionController.show)

  

})
