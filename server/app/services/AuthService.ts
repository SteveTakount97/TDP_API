import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import string from '@adonisjs/core/helpers/string'


export default class AuthService {
  static async registerUser(data: any) {
    // Vérification de la présence des champs obligatoires
    if (!data.email || !data.password || !data.first_name || !data.last_name || !data.role) {
      throw new Error('Missing required fields')
    }

   // Vérification si l'email existe déjà
   const existingUserEmail = await User.findBy('email', data.email)
   if (existingUserEmail) {
     throw new Error('Email already exists')
   }

   // Vérification si le first_name existe déjà
   const existingUserName = await User.findBy('first_name', data.first_name)
   if (existingUserName) {
     throw new Error('First name already exists')
   }

   // Hachage du mot de passe avant de le sauvegarder
   const hashedPassword = await hash.make(data.password)

   // Création du nouvel utilisateur avec le mot de passe haché
   const newUser = await User.create({
     ...data,
     password: hashedPassword,  // On sauvegarde le mot de passe haché
     identifier: string.random(10),
     secureKey: string.random(12),
   })

   return newUser
 }

 // Authentifier un utilisateur
 static async authenticateUser(email: string, password: string) {
   const user = await User.findBy('email', email)
   if (!user) {
     throw new Error('User not found')
   }

   // Vérification du mot de passe
   const passwordVerified = await hash.verify(user.password, password)
   if (!passwordVerified) {
     throw new Error('Invalid credentials')
   }

   // Générer un token JWT pour l'utilisateur
   const token = await user.use('api').generate()

   // Si l'utilisateur n'a pas d'identifier, on en génère un
   if (!user.identifier) {
     user.identifier = string.random(10)
     await user.save()
     await this.regenerateSecureKey(user)
   } else {
     await user.save()
   }

   return { user, token }
 }

 // Déconnexion de l'utilisateur
 static async logoutUser(auth: any) {
   const user = await auth.use('api').authenticate()
   if (!user) throw new Error('No authenticated user found')

   await auth.use('api').revoke()
   return 'Logged out successfully'
 }

 // Méthode pour régénérer une clé sécurisée
 private static async regenerateSecureKey(user: any) {
   user.secureKey = string.random(12)
   await user.save()
 }
}