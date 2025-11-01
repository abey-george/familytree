import { useState, useEffect } from 'react';
import type { FamilyData } from '../types/family';

export const useFamilyData = () => {
  const [familyData, setFamilyData] = useState<FamilyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/family-data.json');
        if (!response.ok) {
          throw new Error('Failed to load family data');
        }
        const data: FamilyData = await response.json();
        setFamilyData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { familyData, loading, error };
};
