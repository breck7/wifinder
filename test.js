class WiFinder {
  async getLocation() {
    if (!navigator.geolocation) {
      throw new Error("Geolocation is not supported by this browser.");
    }
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

  getUrl = "https://pldb.io/pldb.json?r=" + Math.random()
  postUrl = "https://pldb.io/pldb.json"

  async runSpeedTest() {
    try {
      // Test download speed
      const startTimeDownload = performance.now();
      await fetch(this.getUrl);
      const durationDownload = (performance.now() - startTimeDownload) / 1000;
      const downloadSpeed = (100 / durationDownload).toFixed(2); // file size in MB

      // Test upload speed
      const startTimeUpload = performance.now();
      const data = new Blob(["Test Data"], { type: "text/plain" });
      await fetch(this.postUrl, { method: "POST", body: data });
      const durationUpload = (performance.now() - startTimeUpload) / 1000;
      const uploadSpeed = (0.0001 / durationUpload).toFixed(2); // approx upload size in MB

      return { downloadSpeed, uploadSpeed};
    } catch (error) {

      return { error };
    }
  }

  async runTests() {
    try {
      const position = await this.getLocation();
      const { latitude, longitude } = position.coords;
     // const speedResults = await this.runSpeedTest();
      const speedResults = {}
      return { latitude, longitude, ...speedResults };
    } catch (error) {
      return { error: error.message };
    }
  }

  async particles() {
    const {latitude, longitude, downloadSpeed, uploadSpeed} = await this.runTests()
    return `name 
lat ${latitude || ""}
long ${longitude || ""}
download ${downloadSpeed || ""}
upload ${uploadSpeed || ""}
tester `
  }
}

// Usage example
document.addEventListener("DOMContentLoaded", async function() {
  const wiFinder = new WiFinder();
  const results = await wiFinder.particles();
  codeMirrorInstance.setValue(results)

});
