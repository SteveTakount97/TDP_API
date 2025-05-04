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
import RolesController from '#controllers/roles_controller'
import UserRolesController from '#controllers/user_roles_controller'
import TransactionLogsController from '#controllers/transaction_logs_controller'
import PaymentsController from '#controllers/payments_controller'
import TontineMembershipsController from '#controllers/memberships_controller'
import CyclesController from '#controllers/cycles_controller'


const userController = new UsersController()
const authController = new AuthController()
const tontineController = new TontinesController()
const userRoleController = new UserRolesController()
const roleController = new RolesController()
const transactionController = new TransactionLogsController()
const paiementController = new PaymentsController()
const membershipController = new TontineMembershipsController()
const cycleController = new CyclesController()

router.get('/', async () => {
  return {
    hello: 'world',
  }
})
router.group(() => {

  //Authentification
  router.post('/auth/register', authController.register)
  router.post('/auth/login', authController.login)
  router.post('/auth/logout', authController.logout)

  //gestion des utilisateurs
  router.get('/user/', userController.index) 
  router.get('/user/:id', userController.show) 
  router.put('/user/:id', userController.update) 
  router.put('/user/:id', userController.deactivate) 
  router.get('/user/role/:id', roleController.show)
  router.get('/user/admin-role/', roleController.index)

  //gestion Tontine
  router.post('/admin/create', tontineController.store)
  router.get('/admin/tontine', tontineController.index)
  router.get('/admin/tontine/:id', tontineController.show)
  router.put('/admin/tontine/!id', tontineController.update)
  router.delete('/admin/tontine/:id', tontineController.destroy)
  

  // User roles (optionnel si tu veux gérer des rôles globaux)
  router.post('/admin/user-role/', userRoleController.index)
  router.post('/admin/user-role/:id', userRoleController.show)
  router.post('/admin/user-role/:id', userRoleController.store)
  router.put('/admin/user-role/:id', userRoleController.update)
  router.delete('/admin/user-role/:id', userRoleController.destroy)

  //membreship
  router.post('mermbership/:id', membershipController.store)
  router.get('mermbership/:id', membershipController.index)
  router.put('mermbership/:id', membershipController.update)
  router.delete('mermbership/:id', membershipController.destroy)

  //paiement
  router.get('Payment/:id', paiementController.show)
  router.post('Payment/:id', paiementController.store)
  router.get('Payment/:id', paiementController.index)
  
  //gestion des cycles
  router.post('/Cycle-tontine/', cycleController.store)
  router.get('/Cycle-tontine/:id', cycleController.show)
  router.get('/Cycle-tontine/', cycleController.index)

  // Logs de transactions
  router.get('/transaction/', transactionController.index)
  router.get('/transaction/:id', transactionController.show)

  

}).prefix('/users')
