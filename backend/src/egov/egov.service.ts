import { Injectable } from '@nestjs/common';

@Injectable()
export class EgovService {
  private readonly baseUrl = 'https://data.egov.kz';

  async verifyIin(iin: string): Promise<{ valid: boolean; fullName?: string }> {
    try {
      const apiKey = process.env.EGOV_API_KEY;
      if (!apiKey) {
        return { valid: iin.length === 12 && /^\d+$/.test(iin) };
      }
      const url = `${this.baseUrl}/api/v4/nsad/full?iin=${iin}&apikey=${apiKey}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      const data = await res.json();
      return { valid: !!data, fullName: data?.fullName };
    } catch {
      return { valid: iin.length === 12 && /^\d+$/.test(iin) };
    }
  }
}
