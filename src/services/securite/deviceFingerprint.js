/**
 * Service de collecte d'empreinte d'appareil (Device Fingerprinting)
 * Collecte des informations uniques sur l'appareil de l'utilisateur
 */

class DeviceFingerprintService {
  /**
   * Collecte l'empreinte complète de l'appareil
   */
  async collecterEmpreinteAppareil() {
    const empreinte = {
      user_agent: navigator.userAgent,
      platform: navigator.platform,
      langue: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      largeur_ecran: window.screen.width,
      hauteur_ecran: window.screen.height,
      profondeur_couleur: window.screen.colorDepth,
      ratio_dpi: window.devicePixelRatio || 1.0,
      canvas_fingerprint: await this.getCanvasFingerprint(),
      webgl_fingerprint: this.getWebGLFingerprint(),
      audio_fingerprint: await this.getAudioFingerprint(),
      plugins_installes: this.getPlugins(),
      polices_disponibles: await this.getFonts(),
    };

    return empreinte;
  }

  /**
   * Génère une empreinte Canvas
   */
  async getCanvasFingerprint() {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = 200;
      canvas.height = 50;
      
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('Device Fingerprint', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('Security Check', 4, 17);
      
      return canvas.toDataURL();
    } catch (error) {
      console.error('Erreur Canvas fingerprint:', error);
      return 'canvas_error';
    }
  }

  /**
   * Génère une empreinte WebGL
   */
  getWebGLFingerprint() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) return 'webgl_not_supported';
      
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (!debugInfo) return 'webgl_no_debug_info';
      
      const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      
      return `${vendor}~${renderer}`;
    } catch (error) {
      console.error('Erreur WebGL fingerprint:', error);
      return 'webgl_error';
    }
  }

  /**
   * Génère une empreinte Audio
   */
  async getAudioFingerprint() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return 'audio_not_supported';
      
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const analyser = context.createAnalyser();
      const gainNode = context.createGain();
      const scriptProcessor = context.createScriptProcessor(4096, 1, 1);
      
      gainNode.gain.value = 0;
      oscillator.type = 'triangle';
      oscillator.connect(analyser);
      analyser.connect(scriptProcessor);
      scriptProcessor.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.start(0);
      
      return new Promise((resolve) => {
        scriptProcessor.onaudioprocess = function(event) {
          const output = event.outputBuffer.getChannelData(0);
          const hash = Array.from(output.slice(0, 30))
            .map(x => Math.abs(x))
            .reduce((a, b) => a + b, 0);
          
          oscillator.stop();
          scriptProcessor.disconnect();
          gainNode.disconnect();
          analyser.disconnect();
          oscillator.disconnect();
          context.close();
          
          resolve(`audio_${hash.toFixed(10)}`);
        };
      });
    } catch (error) {
      console.error('Erreur Audio fingerprint:', error);
      return 'audio_error';
    }
  }

  /**
   * Liste les plugins installés
   */
  getPlugins() {
    try {
      if (!navigator.plugins || navigator.plugins.length === 0) {
        return [];
      }
      
      return Array.from(navigator.plugins).map(plugin => plugin.name);
    } catch (error) {
      console.error('Erreur plugins:', error);
      return [];
    }
  }

  /**
   * Détecte les polices disponibles
   */
  async getFonts() {
    const baseFonts = ['monospace', 'sans-serif', 'serif'];
    const testFonts = [
      'Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia',
      'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS',
      'Impact', 'Lucida Console', 'Tahoma', 'Helvetica', 'Century Gothic'
    ];
    
    const availableFonts = [];
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    const testString = 'mmmmmmmmmmlli';
    const testSize = '72px';
    
    const baseWidths = {};
    baseFonts.forEach(baseFont => {
      context.font = `${testSize} ${baseFont}`;
      baseWidths[baseFont] = context.measureText(testString).width;
    });
    
    for (const font of testFonts) {
      let detected = false;
      
      for (const baseFont of baseFonts) {
        context.font = `${testSize} '${font}', ${baseFont}`;
        const width = context.measureText(testString).width;
        
        if (width !== baseWidths[baseFont]) {
          detected = true;
          break;
        }
      }
      
      if (detected) {
        availableFonts.push(font);
      }
    }
    
    return availableFonts;
  }

  /**
   * Collecte la localisation IP (via API externe ou backend)
   */
  async collecterLocalisationIP() {
    try {
      // Le backend devrait gérer cela côté serveur pour plus de précision
      // Ici on retourne juste un placeholder
      return {
        country: 'Unknown',
        city: 'Unknown',
        latitude: 0,
        longitude: 0
      };
    } catch (error) {
      console.error('Erreur localisation IP:', error);
      return null;
    }
  }
}

export default new DeviceFingerprintService();
