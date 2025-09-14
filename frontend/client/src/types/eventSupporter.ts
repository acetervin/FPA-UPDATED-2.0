export interface EventSupporter {
  id: number;
  eventId: number;
  name: string;
  logoUrl?: string;
  website?: string;
  type: 'sponsor' | 'partner' | 'organizer' | 'supporter' | 'organization' | 'government';
  level: 'platinum' | 'gold' | 'silver' | 'bronze' | 'standard';
}
