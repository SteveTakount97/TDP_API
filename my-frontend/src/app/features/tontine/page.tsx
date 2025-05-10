import React, { useState } from "react";

type Tontine = {
  id: number;
  name: string;
  description: string;
  membersCount: number;
};

const mockTontines: Tontine[] = [
  { id: 1, name: "Tontine Famille", description: "Épargne mensuelle familiale", membersCount: 5 },
  { id: 2, name: "Tontine Entre Amis", description: "Investissements entre amis", membersCount: 7 },
];

export default function TontineDashboard() {
  const [tontines, setTontines] = useState<Tontine[]>(mockTontines);
  const [showForm, setShowForm] = useState(false);
  const [newTontine, setNewTontine] = useState({ name: "", description: "" });

  const handleCreateTontine = () => {
    const newId = tontines.length + 1;
    setTontines([
      ...tontines,
      {
        id: newId,
        name: newTontine.name,
        description: newTontine.description,
        membersCount: 0,
      },
    ]);
    setNewTontine({ name: "", description: "" });
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    setTontines(tontines.filter((t) => t.id !== id));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Gestion des Tontines</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        {showForm ? "Annuler" : "Créer une nouvelle tontine"}
      </button>

      {showForm && (
        <div className="bg-gray-100 p-4 rounded mb-6">
          <h2 className="text-xl font-semibold mb-2">Nouvelle Tontine</h2>
          <input
            type="text"
            placeholder="Nom"
            className="w-full border px-3 py-2 mb-2"
            value={newTontine.name}
            onChange={(e) => setNewTontine({ ...newTontine, name: e.target.value })}
          />
          <textarea
            placeholder="Description"
            className="w-full border px-3 py-2 mb-2"
            value={newTontine.description}
            onChange={(e) => setNewTontine({ ...newTontine, description: e.target.value })}
          />
          <button
            onClick={handleCreateTontine}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Créer
          </button>
        </div>
      )}

      <div className="grid gap-4">
        {tontines.map((tontine) => (
          <div key={tontine.id} className="border rounded p-4 shadow-sm bg-white">
            <h3 className="text-xl font-semibold">{tontine.name}</h3>
            <p className="text-gray-600 mb-2">{tontine.description}</p>
            <p className="text-sm text-gray-500 mb-4">
              Membres : {tontine.membersCount}
            </p>
            <div className="flex gap-2">
              <button className="text-sm bg-blue-500 text-white px-3 py-1 rounded">
                Détails
              </button>
              <button className="text-sm bg-yellow-500 text-white px-3 py-1 rounded">
                Modifier
              </button>
              <button
                onClick={() => handleDelete(tontine.id)}
                className="text-sm bg-red-500 text-white px-3 py-1 rounded"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
