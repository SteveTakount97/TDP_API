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
import AuthMiddleware from '#middleware/auth_middleware'
import AdminMiddleware from '#middleware/admin_middleware'


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

  //Authentification
router.post('api/register', authController.register)
router.post('api/login', authController.login)
router.post('api/logout', authController.logout)

router.group(() => {

  //gestion des utilisateurs
  router.get('/users', userController.CallUsers)
  router.post('/users/image/', userController.uploadProfileImage)
  router.get('/user/', userController.index) 
  router.get('/user/:id', userController.show) 
  router.put('/user/:id', userController.update) 
  router.put('/user/:id/desactive', userController.deactivate) 


  //gestion Tontine
  router.post('/tontines', tontineController.store)
  router.get('/tontine', tontineController.index)
  router.get('/tontine/:id', tontineController.show)
  router.put('/tontine/:id', tontineController.update).middleware([new AdminMiddleware().handle])
  router.delete('/tontine/:id', tontineController.destroy).middleware([new AdminMiddleware().handle])
  

  //membreship
  router.post('/tontine-memberships/:memberId/tontine/:tontineId', membershipController.store).middleware([new AdminMiddleware().handle])
  router.get('/tontine-memberships/:id', membershipController.index)
  router.get('/membership/:id/users/seach', membershipController.searchUsers)
  router.put('/tontine-memberships/:tontineMembershipId/tontine/:tontineId', membershipController.update).middleware([new AdminMiddleware().handle])
  router.delete('/tontine-memberships/:memberId/tontine/:tontineId', membershipController.destroy).middleware([new AdminMiddleware().handle])

  //paiement
  router.post('/payments/:cycleId', paiementController.store)
  router.get('/payments/cycle/:cycleId', paiementController.show)
  router.patch('/payment/:id/valider', paiementController.valider)
  router.get('/payments', paiementController.index)
  router.put('payments/:id', paiementController.update)
  router.delete('payments/:id', paiementController.destroy)
  
  //gestion des cycles
  router.post('/Cycle-tontine/', cycleController.store)
  router.get('/Cycle-tontine/:id', cycleController.show)
  router.get('/Cycle-tontine', cycleController.index)

  // Logs de transactions
  router.get('/transaction/user/:id', transactionController.index)
  router.get('/transaction/:id', transactionController.show)

  

}).prefix('/api').middleware([new AuthMiddleware().handle])
