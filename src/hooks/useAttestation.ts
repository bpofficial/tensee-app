import { canPerformAttestation, performAttestation } from "expo-attestation"

export function useAttestation() {
    async function fetchChallenge(state: string) {
        return ''
    }

    async function fetchDeviceToken(
        challenge: string,
        keyId: string,
        attestation: string
    ) {
        return ''
    }

    return async (state: string) => {
        const canAttest = await canPerformAttestation()
        if (canAttest) {
            const challenge = await fetchChallenge(state)
            const [keyId, attestation] = await performAttestation(challenge)
            const deviceToken = await fetchDeviceToken(challenge, keyId, attestation)
        }
    }
}