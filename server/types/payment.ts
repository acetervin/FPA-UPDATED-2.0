export interface PaymentGatewayStatus {
  gateway: string;
  status: 'live' | 'maintenance';
}

export interface PaymentGatewayConfig {
  gateway: string;
  config: Record<string, unknown>;
}

export interface PaymentQuery {
  startDate?: string;
  endDate?: string;
}

export interface PaymentFilter {
  startDate?: Date;
  endDate?: Date;
  status?: string;
  method?: string;
}
