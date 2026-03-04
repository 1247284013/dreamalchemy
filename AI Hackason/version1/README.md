<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1pLBWrSGi30zSRw9SlKXKE0lIrEVtsDsl

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Phone Sensor (ZigSim) → BREAK (Recommended)

This project supports controlling the in-game **BREAK** action via phone sensor data **without** macOS keyboard injection.

### Architecture (clean path)

- **ZigSim (iPhone)** sends **UDP** packets to your Mac (`UDP 50000`)
- `sensorBridge.mjs` (Node) receives UDP and forwards to browser via **WebSocket** (`WS 5174`)
- Frontend (React) calculates **gyro magnitude** and calls `MainScene.triggerDestroy()` directly

### Start (2 terminals)

1. Start the UDP→WS bridge:

   `npm run sensor`

   You should see:
   - `UDP listening on 0.0.0.0:50000`
   - `WS server on ws://localhost:5174`

2. Start the game:

   `npm run dev`

3. ZigSim settings:
   - **Target IP**: your Mac IP (example: `192.168.x.x`)
   - **Port**: `50000`
   - **Enable Gyroscope** (or rotation rate)

4. In-game debug overlay (top-left in Gameplay):
   - `sensor.ws` should be `open`
   - `gyro xyz` should show numbers
   - shaking the phone triggers **screen flash** + **BREAK**

### Disable sensor (optional)

By default, sensor is enabled in dev. To disable:

- add `VITE_SENSOR_ENABLED=false` to `.env.local`

## Legacy: `sensor.py` (Deprecated)

There is a root-level `sensor.py` that tried to inject a `B` key via AppleScript.
It is **not recommended** and can conflict by occupying `UDP 50000`.
Use `npm run sensor` + WebSocket instead.
