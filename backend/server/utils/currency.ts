import axios from 'axios';

interface ExchangeRateResponse {
  rates: {
    KES: number;
    USD: number;
  };
}

class CurrencyConverter {
  private static instance: CurrencyConverter;
  private rates: { [key: string]: number } = {};
  private lastUpdate: Date | null = null;
  private readonly REFRESH_INTERVAL = 1000 * 60 * 60; // 1 hour

  private constructor() {}

  public static getInstance(): CurrencyConverter {
    if (!CurrencyConverter.instance) {
      CurrencyConverter.instance = new CurrencyConverter();
    }
    return CurrencyConverter.instance;
  }

  private async updateRates() {
    try {
      // Using Exchange Rate API (you'll need to add EXCHANGE_RATE_API_KEY to .env)
      const response = await axios.get<ExchangeRateResponse>(
        `https://api.exchangerate-api.com/v4/latest/USD`
      );

      this.rates = response.data.rates;
      this.lastUpdate = new Date();
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
      // Fallback rates in case API fails (approximate values)
      this.rates = {
        KES: 153.50, // Approximate KES to USD rate
        USD: 1,
      };
    }
  }

  private async ensureRatesAreFresh() {
    if (
      !this.lastUpdate ||
      Date.now() - this.lastUpdate.getTime() > this.REFRESH_INTERVAL
    ) {
      await this.updateRates();
    }
  }

  public async convert(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    await this.ensureRatesAreFresh();

    // Normalize currencies to uppercase
    fromCurrency = fromCurrency.toUpperCase();
    toCurrency = toCurrency.toUpperCase();

    // If same currency, return original amount
    if (fromCurrency === toCurrency) {
      return amount;
    }

    // Convert to USD first if not already in USD
    const amountInUSD = fromCurrency === 'USD' 
      ? amount 
      : amount / this.rates[fromCurrency];

    // Convert from USD to target currency
    const convertedAmount = amountInUSD * this.rates[toCurrency];

    // Round to 2 decimal places for USD, whole numbers for KES
    return toCurrency === 'USD' 
      ? Math.round(convertedAmount * 100) / 100 
      : Math.round(convertedAmount);
  }
}

export const currencyConverter = CurrencyConverter.getInstance();
