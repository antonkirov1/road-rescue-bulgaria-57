
import { ServiceType } from '@/components/service/types/serviceRequestState';
import { ServiceRequestState } from './types';

export class QuoteGenerator {
  private static readonly BASE_PRICES = {
    'flat-tyre': 40,
    'out-of-fuel': 30,
    'car-battery': 60,
    'tow-truck': 100,
    'emergency': 80,
    'other-car-problems': 50,
    'support': 50
  };

  static generateQuote(serviceType: ServiceType): number {
    const basePrice = this.BASE_PRICES[serviceType] || 50;
    const randomPrice = basePrice + Math.floor(Math.random() * 20) - 10;
    return Math.max(20, randomPrice);
  }

  static generateRevisedQuote(currentAmount: number): number {
    // Lower the price by 5-15 BGN
    return Math.max(10, currentAmount - Math.floor(Math.random() * 15) - 5);
  }

  static createQuoteObject(amount: number, employeeName: string, isRevised: boolean = false) {
    return {
      amount,
      employeeName,
      isRevised
    };
  }
}
