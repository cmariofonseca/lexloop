'use client';
import { useState } from 'react';
import { useCardsStore } from '@/app/lib/useCardsStore';
import { v4 as uuidv4 } from 'uuid';

export default function AddCardForm() {
  const [english, setEnglish] = useState('');
  const [spanish, setSpanish] = useState('');
  const { cards, setInitialCards } = useCardsStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!english.trim() || !spanish.trim()) return;

    const newCard = {
      id: uuidv4(),
      english: english.trim(),
      spanish: spanish.trim(),
    };

    setInitialCards([...cards, newCard]);
    setEnglish('');
    setSpanish('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto p-4">
      <input
        type="text"
        placeholder="English word"
        value={english}
        onChange={(e) => setEnglish(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Spanish translation"
        value={spanish}
        onChange={(e) => setSpanish(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Add Card
      </button>
    </form>
  );
}
