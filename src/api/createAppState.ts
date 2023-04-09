import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { Buffer } from 'buffer'

export function createAppState() {
    const platform = `mobile/${Platform.OS}`
    const appVersion = Constants.manifest?.version
    return Buffer.from(`${platform}:${appVersion}`).toString('base64')
}
