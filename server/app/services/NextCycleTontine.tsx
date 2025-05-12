import Cycle from '#models/cycle'
import Tontine from '#models/tontine'
import { DateTime } from 'luxon'

export default async function proceedToNextCycle(tontineId: number) {
  // Récupère la tontine et vérifie qu'elle existe
  const tontine = await Tontine.findOrFail(tontineId)

  // Récupère le dernier cycle existant
  const lastCycle = await Cycle.query()
    .where('tontineId', tontineId)
    .orderBy('number', 'desc')
    .first()

  if (!lastCycle) {
    throw new Error('Aucun cycle trouvé pour cette tontine.')
  }

  // Marque le cycle actuel comme terminé s’il ne l’est pas déjà
  if (lastCycle.status !== 'ferme') {
    lastCycle.status = 'ferme'
    await lastCycle.save()
  }

  // Calcule les dates du nouveau cycle à partir de la fin du dernier
  const newStartDate = lastCycle.endDate
  let newEndDate: DateTime

  switch (tontine.frequency) {
    case 'hebdomadaire':
      newEndDate = newStartDate.plus({ weeks: 1 })
      break
    case 'mensuelle':
      newEndDate = newStartDate.plus({ months: 1 })
      break
    case 'trimestrielle':
      newEndDate = newStartDate.plus({ days: 1 })
      break
    default:
      throw new Error('Fréquence non supportée.')
  }

  // Crée le nouveau cycle avec conversion des dates
  await Cycle.create({
    tontineId: tontine.id,
    number: lastCycle.number + 1,
    startDate: newStartDate,
    endDate: newEndDate,     
    status: 'ouvert',
    beneficiaryId: null
  })
}
