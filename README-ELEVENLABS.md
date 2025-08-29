# ElevenLabs TTS Integration for PulseFeed

This document provides instructions for setting up and using the ElevenLabs Text-to-Speech (TTS) integration in the PulseFeed application.

## Setup Instructions

1. **Get an ElevenLabs API Key**:
   - Sign up for an account at [ElevenLabs](https://elevenlabs.io/)
   - Navigate to your profile settings to obtain your API key

2. **Configure the API Key**:
   - Open the file `src/config/elevenlabs.ts`
   - Replace the placeholder value for `ELEVENLABS_API_KEY` with your actual API key:
     ```typescript
     export const ELEVENLABS_API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
     ```

3. **Voice Configuration**:
   - The application is configured to use "Sana's voice" by default
   - The voice ID is already set in the configuration file
   - If you want to use a different voice, you can add more voice IDs to the `VOICE_IDS` object in the same file

## Usage

1. **Reading News Articles**:
   - On the main page, click the voice toggle button to start reading all news topics and descriptions
   - The TTS service will read for a maximum of 5 minutes (configurable in the settings)
   - Click the button again to stop the reading

2. **Reading Podcasts**:
   - In the podcast section, click the headphones button to start reading podcast descriptions
   - The same 5-minute limit applies

## Customization

You can customize the TTS behavior by modifying the following settings in `src/config/elevenlabs.ts`:

- `MAX_READING_TIME_MS`: Maximum reading time in milliseconds (default: 5 minutes)
- Add more voice IDs to the `VOICE_IDS` object

In the `ElevenLabsTTS` class, you can also adjust:

- `stability`: Controls the stability of the voice (0.0 to 1.0)
- `similarityBoost`: Controls how closely the output matches the voice (0.0 to 1.0)

## Troubleshooting

- If you encounter issues with the TTS service, check the browser console for error messages
- Ensure your API key is correctly set in the configuration file
- Verify that you have sufficient credits in your ElevenLabs account
- Check your network connection, as the service requires internet access to function