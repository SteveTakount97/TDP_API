import React, { useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const mockUsers: User[] = [
  { id: 1, name: "Alice Dupont", email: "alice@example.com", role: "admin" },
  { id: 2, name: "Bob Martin", email: "bob@example.com", role: "membre" },
];

export default function UserDashboard() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "membre" });

  const handleAddUser = () => {
    const newId = users.length + 1;
    setUsers([
      ...users,
      { id: newId, name: newUser.name, email: newUser.email, role: newUser.role },
    ]);
    setNewUser({ name: "", email: "", role: "membre" });
    setShowForm(false);
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Utilisateurs</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        {showForm ? "Annuler" : "Ajouter un utilisateur"}
      </button>

      {showForm && (
        <div className="bg-gray-100 p-4 rounded mb-6 text-black">
          <h2 className="text-xl font-semibold mb-2">Nouvel utilisateur</h2>
          <input
            type="text"
            placeholder="Nom"
            className="w-full border px-3 py-2 mb-2"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border px-3 py-2 mb-2"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <select
            className="w-full border px-3 py-2 mb-2"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="membre">Membre</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={handleAddUser}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Ajouter
          </button>
        </div>
      )}

      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user.id} className="border rounded p-4 shadow-sm bg-white">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500 mb-2">Rôle : {user.role}</p>
            <button
              onClick={() => handleDeleteUser(user.id)}
              className="text-sm bg-red-500 text-white px-3 py-1 rounded"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
