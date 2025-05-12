import Cycle from '#models/cycle'
import Tontine from '#models/tontine'
import { DateTime } from 'luxon'

export default async function createFirstCycle(tontine: Tontine) {
  const startDate = tontine.createdAt
  let endDate: DateTime

  switch (tontine.frequency) {
    case 'hebdomadaire':
      endDate = startDate.plus({ weeks: 1 })
      break
    case 'mensuelle':
      endDate = startDate.plus({ months: 1 })
      break
    case 'trimestrielle':
      endDate = startDate.plus({ months: 3 })
      break
    default:
      throw new Error('Fréquence non supportée.')
  }

 try {
  await Cycle.create({
    tontineId: tontine.id,
    number: 1,
    startDate,
    endDate,
    status: 'ouvert',
    beneficiaryId: null,
  })
 } catch (error) {
  console.error('Erreur lors de la création du premier cycle :', error)
  throw new Error('Échec de la création du premier cycle.')
 }

}
