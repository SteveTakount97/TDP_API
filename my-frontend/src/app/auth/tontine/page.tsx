'use client';
import { useState } from 'react';

export default function CreateTontineForm() {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    amountPerCycle: '',
    frequency: '',
    startDate: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation simple
    if (!formData.name || !formData.amountPerCycle || !formData.frequency || !formData.startDate || !formData.type) {
      setError('Tous les champs obligatoires doivent être remplis.');
      return;
    }

    try {
      // Appel à ton backend (à connecter plus tard)
      console.log('Tontine créée :', formData);
      setError('');
      setSuccess('Tontine créée avec succès !');
    } catch (err) {
      setError('Une erreur est survenue.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold">Créer une nouvelle tontine</h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}

      <div>
        <label className="block font-medium">Nom de la tontine *</label>
        <input
          type="text"
          name="name"
          onChange={handleChange}
          value={formData.name}
          className="w-full mt-1 p-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Description</label>
        <textarea
          name="description"
          onChange={handleChange}
          value={formData.description}
          className="w-full mt-1 p-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block font-medium">Montant de chaque tour *</label>
        <input
          type="number"
          name="amount"
          onChange={handleChange}
          value={formData.amountPerCycle}
          className="w-full mt-1 p-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Fréquence (ex: hebdomadaire, mensuelle) *</label>
        <input
          type="text"
          name="frequency"
          onChange={handleChange}
          value={formData.frequency}
          className="w-full mt-1 p-2 border rounded-lg"
          required
        />
      </div>
      <div>
      <label className="block text-sm font-medium mb-1">Type de tontine</label>
           <span
          className="relative group cursor-pointer text-white"
          title="Rotative : chaque membre reçoit à tour de rôle. Solidaire : tous les fonds vont à un bénéficiaire déterminé."
            >
          ⓘ
          </span>
         <select
           name="type"
           className="w-full border rounded-md p-2 mb-4"
           value={formData.type}
           onChange={handleSelectChange}
           required
        >
       <option value="" className='text-black'>-- Sélectionnez --</option>
       <option value="rotative" className='text-black'>Rotative</option>
       <option value="solidaire" className='text-black'>Solidaire</option>
      </select>


      </div>

      <div>
        <label className="block font-medium">Date de début *</label>
        <input
          type="date"
          name="startDate"
          onChange={handleChange}
          value={formData.startDate}
          className="w-full mt-1 p-2 border rounded-lg"
          required
        />
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
        Créer la tontine
      </button>
      <a href="/" className="inline-block mt-4 px-4 py-2 bg-gray-200 hover:bg-blue-100 text-black rounded-lg">
         Retour à l’accueil
      </a>
    </form>
    
  );
}
