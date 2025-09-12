export interface EventSupporter {
  id: number;
  name: string;
  logo?: string;
  website?: string;
  type: 'sponsor' | 'partner' | 'organizer' | 'supporter';
  level: 'platinum' | 'gold' | 'silver' | 'bronze' | 'standard';
}