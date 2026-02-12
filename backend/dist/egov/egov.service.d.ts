export declare class EgovService {
    private readonly baseUrl;
    verifyIin(iin: string): Promise<{
        valid: boolean;
        fullName?: string;
    }>;
}
