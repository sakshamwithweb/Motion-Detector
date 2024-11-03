const getMotion = async () => {
    const threshold = {
      walking: 2,
      running: 5,
      driving: 1
    };

    let lastTimestamp = 0;
    let accelerationData = [];
    const detectionInterval = 1000;

    const requestDeviceMotionPermission = async () => {
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
      let avgAcceleration = accelerationData.reduce((sum, val) => sum + val, 0) / accelerationData.length;
      accelerationData = [];

      let motionType;
      if (avgAcceleration > threshold.running) {
        motionType = "Running";
      } else if (avgAcceleration > threshold.walking) {
        motionType = "Walking";
      } else if (avgAcceleration < threshold.driving) {
        motionType = "Driving or Stationary";
      } else {
        motionType = "Stationary";
      }
      console.log(motionType)
    };

    const handleDeviceMotion = (event) => {
      const currentTimestamp = Date.now();
      if (currentTimestamp - lastTimestamp > 50) {
        const { x, y, z } = event.acceleration;
        const totalAcceleration = Math.sqrt(x * x + y * y + z * z);
        accelerationData.push(totalAcceleration);
        lastTimestamp = currentTimestamp;
      }
    };

    await requestDeviceMotionPermission();
    window.addEventListener('devicemotion', handleDeviceMotion);
    setInterval(analyzeMotion, detectionInterval);
  };


  getMotion()