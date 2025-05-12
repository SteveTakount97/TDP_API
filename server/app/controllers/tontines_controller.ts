import type { HttpContext } from '@adonisjs/core/http'
import Tontine from '#models/tontine'
import TontineMemberShip from '#models/tontine_member_ship'
import { schema, rules } from '@adonisjs/validator'
import createFirstCycle from '#services/createFirstCycle'
import { DateTime } from 'luxon'

export default class TontinesController {
  /**
   * @swagger
   * /api/tontine:
   *   get:
   *     tags:
   *       - Tontines
   *     summary: Liste des tontines
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Liste récupérée avec succès
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *              
   *       401:
   *         description: Non autorisé
   */
  public async index({ response }: HttpContext) {
    try {
      const tontines = await Tontine.all()
      return response.ok(tontines)
    } catch (error) {
      return response.internalServerError({ message: error.message })
    }
  }

  /**
   * @swagger
   * /api/tontine:
   *   post:
   *     tags:
   *       - Tontines
   *     summary: Créer une tontine
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - startDate
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type: string
   *               startDate:
   *                 type: string
   *                 format: date
   *     responses:
   *       201:
   *         description: Tontine créée avec succès
   *         content:
   *           application/json:
   *             schema:
   *             
   *       400:
   *         description: Erreur de validation
   *       401:
   *         description: Non autorisé
   */
 public async store({ request, response, auth }: HttpContext) {
  const tontineSchema = schema.create({
    name: schema.string({}, [rules.maxLength(100)]),
    description: schema.string.optional(),
    amountPerCycle: schema.number([rules.unsigned()]),
    type: schema.enum(['rotative', 'solidaire'] as const),
    frequency: schema.enum(['hebdomadaire', 'mensuelle', 'trimestrielle'] as const),
    startDate: schema.date({}, [
    ]),
  });
 const user = await auth.authenticate()

  try {
    const data = await request.validate({ schema: tontineSchema });

    // Création de la tontine
    const tontine = await Tontine.create({
      name: data.name,
      description: data.description ?? undefined,
      amount_per_cycle: data.amountPerCycle,
      type: data.type,
      frequency: data.frequency,
      start_date: data.startDate,
      created_by: user!.id, 
    });

    
      await createFirstCycle(tontine)
  

    if (!tontine || !tontine.id) {
      console.error('Tontine non créée correctement');
      return response.status(500).send({ message: 'Erreur lors de la création de la tontine' });
    }

    console.log('Tontine créée avec succès:', tontine.id);

    // Création du membership avec rôle admin
    try {
      await TontineMemberShip.create({
        tontine_id: tontine.id,
        user_id: user!.id,
        role: 'admin',
        isActive: true,
        joinedAt: DateTime.local(), 
         position: 1, 
      });

      console.log(`Utilisateur ${user!.id} ajouté comme admin à la tontine ${tontine.id}`);
    } catch (membershipError) {
      console.error('Erreur lors de la création du membre admin:', membershipError);
      return response.status(500).send({ message: 'Tontine créée mais ajout du membre échoué' });
    }

    return response.created(tontine);

  } catch (error) {
    // Gestion des erreurs de validation
    if (error.messages) {
      const formattedErrors = error.messages.errors.reduce((acc: Record<string, string[]>, curr: any) => {
        acc[curr.field] = [curr.message];
        return acc;
      }, {});
      return response.status(422).send({ errors: formattedErrors });
    }

    console.error('Erreur serveur:', error);
    return response.status(500).send({ message: 'Erreur serveur' });
  }
}
  /**
   * @swagger
   * /api/tontine/{id}:
   *   get:
   *     tags:
   *       - Tontines
   *     summary: Détails d'une tontine
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Tontine trouvée
   *         content:
   *           application/json:
   *             schema:
   *              
   *       404:
   *         description: Tontine non trouvée
   *       401:
   *         description: Non autorisé
   */
 // GET /tontines/:id
public async show({ params, auth, response }: HttpContext) {
  const user = await auth.authenticate()
  if (!user){
    return ("Vous n'êtes pas Connecté ou autorisé à éffectuer cette opération!")
  }

  try {
    const tontine = await Tontine.query()
      .where('id', params.id)
      .whereHas('memberships', (query) => {
        query.where('user_id', user.id)
      })
      .firstOrFail()

    return response.ok(tontine)
  } catch (error) {
    return response.notFound({ message: 'Tontine introuvable ou accès interdit' })
  }
}

  /**
   * @swagger
   * /api/tontine/{id}:
   *   put:
   *     tags:
   *       - Tontines
   *     summary: Mettre à jour une tontine
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type: string
   *     responses:
   *       200:
   *         description: Tontine mise à jour
   *         content:
   *           application/json:
   *             schema:
   *               
   *       404:
   *         description: Tontine non trouvée
   *       400:
   *         description: Erreur de validation
   *       401:
   *         description: Non autorisé
   */
  public async update({ request, params, response }: HttpContext) {
    try {
      const tontine = await Tontine.findOrFail(params.id)
      tontine.merge(request.only(['name', 'description']))
      await tontine.save()
      return response.ok(tontine)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * @swagger
   * /api/tontine/{id}:
   *   delete:
   *     tags:
   *       - Tontines
   *     summary: Supprimer une tontine
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Tontine supprimée
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *       404:
   *         description: Tontine non trouvée
   *       401:
   *         description: Non autorisé
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const tontine = await Tontine.findOrFail(params.id)
      await tontine.delete()
      return response.ok({ message: 'Tontine supprimée' })
    } catch (error) {
      return response.notFound({ message: 'Tontine non trouvée' })
    }
  }
}


