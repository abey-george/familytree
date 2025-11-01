export interface Person {
  id: string;
  name: string;
  photo?: string;
  generation: number;
  occupation?: string;
  location?: string;
  description?: string;
  birthDate?: string;
  deathDate?: string;
  parentIds?: string[];
  spouseId?: string;
}

export interface FamilyData {
  people: Person[];
  rootPersonId: string;
}
