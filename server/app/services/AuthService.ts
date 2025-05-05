import User from '#models/user' 
import string from '@adonisjs/core/helpers/string'
import { error } from 'console'

export default class AuthService {
  
  static async registerUser(data: any) {
    if (!data.username || !data.email || !data.password || !data.fullName || !data.phone_number || !data.role) {
      throw new Error('Missing required fields')
    }

    const existingUserEmail = await User.findBy('email', data.email)
    if (existingUserEmail) {
      throw new Error('Email already exists')
    }

    const existingUserName = await User.findBy('full_name', data.full_name)
    if (existingUserName) {
      throw new Error('First name already exists')
    }
    

    // Crée l'utilisateur sans inclure secureKey
    const newUser = await User.create({
      fullName: data.fullName,
      email: data.email,
      role: data.role,
      phone_number: data.phone_number,
      password: data.password
    })

    return newUser
  }

  static async authenticateUser(data: any) {
     // Validation de base
    if (!data.email || !data.password) {
      throw  error('Email and password are required', 400)
    }

    const user = await User.verifyCredentials(data.email, data.password)
    if (!user) {
      throw new Error('User not found')
    }

    // Générer un token JWT pour l'utilisateur
    const token = await User.accessTokens.create(user)
    
    if (!user) {
      await this.regenerateSecureKey(user)
    } else {
      await user.save()
    }

    return {
      user,
      token,
      type: 'bearer',
      value: token.value!.release(),
    }
  }

  static async logoutUser(auth: any) {
    try {
      // Authentification automatique (lève une exception si échoue)
      await auth.use('api').authenticate()

      return { message: 'Logged out successfully' }
    } catch (error) {
      throw new Error(error.message || 'Failed to log out')
    }
  }
  static async getUser(auth: any) {
    await auth.use('api').authenticate()
    const user = auth.user

    if (!user) {
      throw new Error('Utilisateur non trouvé')
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    }
  }
  private static async regenerateSecureKey(user: any) {
    user.secureKey = string.random(12)
  }
}