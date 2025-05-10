import React, { useState } from "react";

type Payment = {
  id: number;
  tontineName: string;
  amount: number;
  date: string;
  memberName: string;
};

const mockPayments: Payment[] = [
  { id: 1, tontineName: "Tontine Famille", amount: 100, date: "2024-05-01", memberName: "Alice" },
  { id: 2, tontineName: "Tontine Entre Amis", amount: 75, date: "2024-05-03", memberName: "Bob" },
];

export default function PaymentDashboard() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [showForm, setShowForm] = useState(false);
  const [newPayment, setNewPayment] = useState({
    tontineName: "",
    amount: "",
    date: "",
    memberName: "",
  });

  const handleCreatePayment = () => {
    const newId = payments.length + 1;
    setPayments([
      ...payments,
      {
        id: newId,
        tontineName: newPayment.tontineName,
        amount: parseFloat(newPayment.amount),
        date: newPayment.date,
        memberName: newPayment.memberName,
      },
    ]);
    setNewPayment({ tontineName: "", amount: "", date: "", memberName: "" });
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    setPayments(payments.filter((p) => p.id !== id));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Paiements</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        {showForm ? "Annuler" : "Ajouter un paiement"}
      </button>

      {showForm && (
        <div className="bg-gray-100 p-4 rounded mb-6 text-black">
          <h2 className="text-xl font-semibold mb-2">Nouveau Paiement</h2>
          <input
            type="text"
            placeholder="Tontine"
            className="w-full border px-3 py-2 mb-2"
            value={newPayment.tontineName}
            onChange={(e) => setNewPayment({ ...newPayment, tontineName: e.target.value })}
          />
          <input
            type="number"
            placeholder="Montant"
            className="w-full border px-3 py-2 mb-2"
            value={newPayment.amount}
            onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
          />
          <input
            type="date"
            className="w-full border px-3 py-2 mb-2"
            value={newPayment.date}
            onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
          />
          <input
            type="text"
            placeholder="Membre"
            className="w-full border px-3 py-2 mb-2"
            value={newPayment.memberName}
            onChange={(e) => setNewPayment({ ...newPayment, memberName: e.target.value })}
          />
          <button
            onClick={handleCreatePayment}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Ajouter
          </button>
        </div>
      )}

      <div className="grid gap-4">
        {payments.map((payment) => (
          <div key={payment.id} className="border rounded p-4 shadow-sm bg-white">
            <p className="font-semibold">
              {payment.memberName} a payé {payment.amount} € dans "{payment.tontineName}"
            </p>
            <p className="text-sm text-gray-500 mb-2">Le {payment.date}</p>
            <button
              onClick={() => handleDelete(payment.id)}
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
