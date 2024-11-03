const getMotion = async () => {
    const threshold = {
        walking: 2,
        running: 5,
        driving: 1
    };

    let lastTimestamp = 0;
    let accelerationData = [];
    const detectionInterval = 1000;

    const feedbackElement = document.getElementById('feedback');

    const requestDeviceMotionPermission = async () => {
        if (typeof DeviceMotionEvent === 'undefined') {
            console.error("DeviceMotion is not supported on this device or browser.");
            return;
        }

        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            try {
                const permissionState = await DeviceMotionEvent.requestPermission();
                if (permissionState !== 'granted') {
                    throw new Error("Permission not granted for DeviceMotion");
                }
                console.log("DeviceMotion permission granted.");
            } catch (error) {
                console.error("DeviceMotion permission request failed:", error);
            }
        }
    };

    const analyzeMotion = () => {
        if (accelerationData.length > 0) {
            let avgAcceleration = accelerationData.reduce((sum, val) => sum + val, 0) / accelerationData.length;
            accelerationData = [];

            let motionType, motionClass;
            if (avgAcceleration > threshold.running) {
                motionType = "Running";
                motionClass = "motion-running";
            } else if (avgAcceleration > threshold.walking) {
                motionType = "Walking";
                motionClass = "motion-walking";
            } else if (avgAcceleration < threshold.driving) {
                motionType = "Driving or Stationary";
                motionClass = "motion-driving";
            } else {
                motionType = "Stationary";
                motionClass = "motion-driving";
            }

            // Update feedback with the detected motion type
            feedbackElement.textContent = motionType;

            // Remove any previous motion class and add the current one
            feedbackElement.className = '';
            feedbackElement.classList.add(motionClass);
        }
    };

    const handleDeviceMotion = (event) => {
        const currentTimestamp = Date.now();
        if (currentTimestamp - lastTimestamp > 50) {
            const { x = 0, y = 0, z = 0 } = event.acceleration || {};
            const totalAcceleration = Math.sqrt(x * x + y * y + z * z);
            accelerationData.push(totalAcceleration);
            lastTimestamp = currentTimestamp;
        }
    };

    await requestDeviceMotionPermission();
    window.addEventListener('devicemotion', handleDeviceMotion);
    setInterval(analyzeMotion, detectionInterval);
};

getMotion();
