export type Rarity = 'Común' | 'Rara' | 'Épica' | 'Legendaria';
export type StatKey = 'atk' | 'def' | 'int' | 'cha' | 'hp' | 'spd' | 'rng';

export interface Card {
  id: string;
  name: string;
  title: string;
  avatar: string;
  bio: string;
  rarity: Rarity;
  abilities: string[];
  stats: Record<StatKey, number>;
  links?: { label: string; url: string }[];
}

export interface Enemy {
  id: string;
  name: string;
  style: 'aggro' | 'tank' | 'lucky' | 'smart';
  base: Omit<Card, 'id' | 'rarity'> & { rarity?: Rarity };
}
