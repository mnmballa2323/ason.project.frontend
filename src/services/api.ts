import { useSovereignty } from '../components/PermittedJurisdictionGuard';

// Simple fetch wrapper that handles 451 errors
// specific to the Ason Sovereignty enforcement.

export const useApi = () => {
    const { setJurisdictionError } = useSovereignty();

    const request = async (url: string, options: RequestInit = {}) => {
        try {
            const response = await fetch(url, options);

            if (response.status === 451) {
                const data = await response.json();
                setJurisdictionError(data);
                throw new Error("Data Sovereignty Violation");
            }

            return response;
        } catch (error) {
            // Rethrow other errors
            throw error;
        }
    };

    const get = (url: string, headers: Record<string, string> = {}) =>
        request(url, { method: 'GET', headers });

    const post = (url: string, body: any, headers: Record<string, string> = {}) =>
        request(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...headers },
            body: JSON.stringify(body)
        });

    return { get, post, request };
};
