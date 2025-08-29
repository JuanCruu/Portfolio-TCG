import { Card } from '@portfolio-tcg/core';

const demo: Card = {
  id: 'demo',
  name: 'Flecha',
  title: 'Fullstack & Derecho',
  avatar: '🏹',
  bio: 'Ejemplo de carta inicial',
  rarity: 'Común',
  abilities: ['Refactor rápido'],
  stats: { atk: 5, def: 4, int: 7, cha: 6, hp: 5, spd: 5, rng: 5 }
};

export default function App() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Portfolio TCG</h1>
      <pre>{JSON.stringify(demo, null, 2)}</pre>
    </div>
  );
}
