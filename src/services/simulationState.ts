import { 
  IndustrialDevice, 
  ThreatAlert, 
  NetworkPacket, 
  IncidentHistoryItem, 
  FactoryProfile, 
  ThreatType,
  AlertStatus
} from '../types';
import { 
  INITIAL_DEVICES, 
  INITIAL_FACTORY_PROFILE, 
  INITIAL_INCIDENT_HISTORY 
} from './mockData';
import { soundAndVoice } from '../utils/soundAndVoice';
import confetti from 'canvas-confetti';

type Listener = () => void;

class SimulationStore {
  private devices: IndustrialDevice[] = JSON.parse(JSON.stringify(INITIAL_DEVICES));
  private alerts: ThreatAlert[] = [];
  private incidentHistory: IncidentHistoryItem[] = JSON.parse(JSON.stringify(INITIAL_INCIDENT_HISTORY));
  private packets: NetworkPacket[] = [];
  private firewallBlocklist: string[] = ['203.0.113.88', '198.51.100.4'];
  private factoryProfile: FactoryProfile = JSON.parse(JSON.stringify(INITIAL_FACTORY_PROFILE));
  
  private simulationSpeed: number = 1; // 0 = paused, 1 = normal, 3 = fast
  private packetIntervalId: number | null = null;
  private listeners: Set<Listener> = new Set();
  private totalPacketsProcessed: number = 14280;

  constructor() {
    this.startPacketGenerator();
    // Pre-populate initial benign packets
    for (let i = 0; i < 20; i++) {
      this.generateBenignPacket();
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  // --- GETTERS ---
  public getDevices(): IndustrialDevice[] {
    return this.devices;
  }

  public getAlerts(): ThreatAlert[] {
    return this.alerts;
  }

  public getActiveAlerts(): ThreatAlert[] {
    return this.alerts.filter(a => a.status === 'active' || a.status === 'investigating');
  }

  public getIncidentHistory(): IncidentHistoryItem[] {
    return this.incidentHistory;
  }

  public getPackets(): NetworkPacket[] {
    return this.packets;
  }

  public getFirewallBlocklist(): string[] {
    return this.firewallBlocklist;
  }

  public getFactoryProfile(): FactoryProfile {
    return this.factoryProfile;
  }

  public getSimulationSpeed(): number {
    return this.simulationSpeed;
  }

  public getTotalPacketsProcessed(): number {
    return this.totalPacketsProcessed;
  }

  public getSecurityScore(): number {
    let score = 98;
    const active = this.getActiveAlerts();
    for (const alert of active) {
      if (alert.severity === 'critical') score -= 32;
      else if (alert.severity === 'high') score -= 20;
      else if (alert.severity === 'medium') score -= 12;
      else score -= 5;
    }
    const quarantined = this.devices.filter(d => d.networkStatus === 'quarantined').length;
    score -= quarantined * 4;
    return Math.max(12, Math.min(100, score));
  }

  // --- SIMULATION CONTROL ---
  public setSimulationSpeed(speed: number) {
    this.simulationSpeed = speed;
    this.startPacketGenerator();
    this.notify();
  }

  private startPacketGenerator() {
    if (this.packetIntervalId !== null) {
      clearInterval(this.packetIntervalId);
      this.packetIntervalId = null;
    }

    if (this.simulationSpeed <= 0) return;

    const intervalMs = Math.max(250, Math.floor(1200 / this.simulationSpeed));
    this.packetIntervalId = window.setInterval(() => {
      this.generateBenignPacket();
      this.updateDeviceFluctuations();
      this.notify();
    }, intervalMs);
  }

  private updateDeviceFluctuations() {
    this.devices = this.devices.map(device => {
      if (device.networkStatus === 'quarantined') {
        return {
          ...device,
          packetRate: 0,
          cpuUsage: Math.max(2, device.cpuUsage - 4),
          lastSeen: 'Quarantined (Isolated)'
        };
      }

      // If under attack, keep high rate
      const deviceAlert = this.alerts.find(a => a.deviceId === device.id && (a.status === 'active' || a.status === 'investigating'));
      if (deviceAlert && deviceAlert.type === 'TRAFFIC_SPIKE') {
        return {
          ...device,
          packetRate: 920 + Math.floor(Math.random() * 80),
          cpuUsage: 94 + Math.floor(Math.random() * 5),
          lastSeen: 'Just now'
        };
      }

      // Normal benign fluctuations
      const deltaCpu = (Math.random() - 0.5) * 4;
      const deltaRate = (Math.random() - 0.5) * 6;
      return {
        ...device,
        cpuUsage: Math.round(Math.max(5, Math.min(85, device.cpuUsage + deltaCpu))),
        packetRate: Math.round(Math.max(8, Math.min(250, device.packetRate + deltaRate))),
        lastSeen: 'Just now'
      };
    });
  }

  private generateBenignPacket(): NetworkPacket {
    this.totalPacketsProcessed++;
    const sampleEndpoints = [
      { src: '192.168.10.5', srcName: 'SCADA Master', dst: '192.168.10.12', dstName: 'Stamping PLC', proto: 'Modbus TCP', port: 502, fn: 'FC03 Read Holding Registers', payload: 'Addr: 40001-40010 (Hydraulic Pressure: 142 bar)' },
      { src: '192.168.10.12', srcName: 'Stamping PLC', dst: '192.168.10.5', dstName: 'SCADA Master', proto: 'Modbus TCP', port: 502, fn: 'FC03 Response', payload: 'Data: [0x008E, 0x011A, 0x0001, 0x03FF] OK' },
      { src: '192.168.10.15', srcName: 'GuardLogix PLC', dst: '192.168.10.5', dstName: 'SCADA Master', proto: 'EtherNet/IP', port: 44818, fn: 'CIP Read Tag', payload: 'Tag: ThermalProfile_Zone1.PV = 845.2 C' },
      { src: '192.168.10.88', srcName: 'Vibration IIoT', dst: '192.168.10.6', dstName: 'OT Historian', proto: 'MQTT', port: 1883, fn: 'PUBLISH', payload: 'topic: /bay1/motor/rms_vibe = 2.41 mm/s' },
      { src: '192.168.10.92', srcName: 'Energy Meter', dst: '192.168.10.6', dstName: 'OT Historian', proto: 'Modbus TCP', port: 502, fn: 'FC04 Read Input Regs', payload: 'Voltage: 416.8V, Current: 312A, PF: 0.96' },
      { src: '192.168.10.22', srcName: 'PanelView HMI', dst: '192.168.10.12', dstName: 'Stamping PLC', proto: 'EtherNet/IP', port: 44818, fn: 'CIP Write Tag', payload: 'Tag: Batch_Count_Req = 1200 parts' }
    ];

    const pick = sampleEndpoints[Math.floor(Math.random() * sampleEndpoints.length)];
    const packet: NetworkPacket = {
      id: `pkt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString(),
      sourceIp: pick.src,
      sourceName: pick.srcName,
      destIp: pick.dst,
      destName: pick.dstName,
      protocol: pick.proto,
      port: pick.port,
      sizeBytes: 64 + Math.floor(Math.random() * 256),
      functionCode: pick.fn,
      payloadSummary: pick.payload,
      isSuspicious: false
    };

    this.packets = [packet, ...this.packets.slice(0, 99)];
    return packet;
  }

  // --- ATTACK TRIGGER 1: REPEATED FAILED LOGINS ---
  public triggerFailedLogins() {
    const targetDevice = this.devices.find(d => d.id === 'dev-hmi-01') || this.devices[0];
    const attackerIp = '192.168.1.189';

    // Inject suspicious login attempt packets
    for (let i = 0; i < 5; i++) {
      const pkt: NetworkPacket = {
        id: `pkt-attack-auth-${Date.now()}-${i}`,
        timestamp: new Date().toLocaleTimeString(),
        sourceIp: attackerIp,
        sourceName: 'External Subnet (192.168.1.x)',
        destIp: targetDevice.ip,
        destName: targetDevice.name,
        protocol: 'HTTPS',
        port: 443,
        sizeBytes: 512,
        functionCode: 'POST /api/v1/auth/session',
        payloadSummary: `AUTH FAIL: User 'admin' / 'supervisor' [Attempt ${i + 1}/5] HTTP 401 Unauthorized`,
        isSuspicious: true,
        threatType: 'FAILED_LOGINS'
      };
      this.packets.unshift(pkt);
    }
    this.packets = this.packets.slice(0, 100);

    // Update target device indicator to Amber warning
    this.updateDeviceStatus(targetDevice.id, 'warning');

    const alertId = `alt-auth-${Date.now()}`;
    const newAlert: ThreatAlert = {
      id: alertId,
      type: 'FAILED_LOGINS',
      title: 'Repeated Failed Logins Detected (Brute Force)',
      titleHi: 'लगातार विफल लॉगिन प्रयास (ब्रूट-फोर्स हमला)',
      severity: 'high',
      timestamp: new Date().toLocaleString(),
      deviceId: targetDevice.id,
      deviceName: targetDevice.name,
      sourceIp: attackerIp,
      targetIp: targetDevice.ip,
      protocol: 'HTTPS / Web HMI Console',
      port: 443,
      description: 'Multiple consecutive failed authentication attempts from unapproved IP 192.168.1.189 targeting HMI operator credentials.',
      descriptionHi: 'एचएमआई ऑपरेटर क्रेडेंशियल्स को निशाना बनाकर गैर-स्वीकृत आईपी 192.168.1.189 से लगातार 5 विफल लॉगिन प्रयास दर्ज किए गए।',
      simpleExplanation: 'Someone or an automated bot on your office/external network is guessing passwords to break into the factory floor touch panel.',
      simpleExplanationHi: 'कारखाने के ऑपरेटर टच पैनल में घुसने के लिए कोई या कोई स्वचालित बॉट लगातार गलत पासवर्ड दर्ज करके हैक करने का प्रयास कर रहा है।',
      riskAssessment: 'If breached, unauthorized operators could alter press cycle times or disable safety perimeter guards.',
      riskAssessmentHi: 'सफल होने पर, हमलावर प्रेस के चक्र समय बदल सकता है या सुरक्षा सेंसर को बंद कर सकता है।',
      recommendedAction: 'Block source IP at Moxa OT firewall and enforce immediate credential reset with lockout policy.',
      recommendedActionHi: 'मोक्सा ओटी फ़ायरवॉल पर इस आईपी को तुरंत ब्लॉक करें और ऑपरेटर क्रेडेंशियल्स रीसेट करें।',
      status: 'active',
      mitreAttackId: 'T0859',
      mitreAttackName: 'Brute Force (ICS / OT)',
      blastRadius: 'Medium',
      evidenceData: [
        { label: 'Failed Attempts', value: '8 attempts within 12 seconds' },
        { label: 'Targeted Usernames', value: 'admin, operator1, maintenance, root' },
        { label: 'Client User-Agent', value: 'Python-requests/2.28 (Automated Script)' },
        { label: 'Ingress Port', value: 'Port 443 / SSL Handshake OK' }
      ]
    };

    this.alerts = [newAlert, ...this.alerts.filter(a => a.type !== 'FAILED_LOGINS')];
    soundAndVoice.speakAlert(
      `Security Alert: Repeated failed logins detected on ${targetDevice.name}. Possible brute force attack.`,
      `सुरक्षा चेतावनी: ${targetDevice.name} पर लगातार विफल लॉगिन दर्ज किए गए हैं। पासवर्ड क्रैकिंग का संदेह।`,
      false
    );
    this.notify();
  }

  // --- ATTACK TRIGGER 2: UNKNOWN DEVICE CONNECTION ---
  public triggerUnknownDevice() {
    const rogueId = 'dev-rogue-01';
    const rogueIp = '192.168.10.244';
    const rogueMac = 'DC:A6:32:B1:99:8A';

    // Check if already in devices
    const existing = this.devices.find(d => d.id === rogueId);
    if (!existing) {
      const rogueDevice: IndustrialDevice = {
        id: rogueId,
        name: 'UNAUTHORIZED ROGUE DEVICE (Raspberry Pi)',
        type: 'IIoT',
        vendor: 'Raspberry Pi Foundation',
        model: 'Raspberry Pi 4 Model B (Unauthorized Tap)',
        ip: rogueIp,
        mac: rogueMac,
        subnet: '192.168.10.0/24',
        protocol: 'EtherNet/IP',
        port: 44818,
        firmware: 'Linux Kali-ARM (Sniffing Tool)',
        zone: 'Level 0/1 (Process/Control)',
        location: 'Bay 1 Stamping Network Wall Box (Port Fa0/14)',
        securityStatus: 'critical',
        networkStatus: 'online',
        lastSeen: 'Just now',
        cpuUsage: 78,
        packetRate: 185,
        vulnerabilitiesCount: 3,
        description: 'Unregistered MAC address detected transmitting ARP scanning and Modbus probes on industrial control VLAN.',
        isRogue: true
      };
      this.devices.push(rogueDevice);
    } else {
      this.updateDeviceStatus(rogueId, 'critical');
    }

    // Inject ARP scan & rogue packets
    for (let i = 0; i < 4; i++) {
      const pkt: NetworkPacket = {
        id: `pkt-rogue-${Date.now()}-${i}`,
        timestamp: new Date().toLocaleTimeString(),
        sourceIp: rogueIp,
        sourceName: 'Rogue Device (Raspberry Pi)',
        destIp: '192.168.10.255',
        destName: 'OT Broadcast',
        protocol: 'EtherNet/IP',
        port: 44818,
        sizeBytes: 128,
        functionCode: 'ARP WHO-HAS / Port Sweep',
        payloadSummary: `UNAUTHORIZED SCAN: Probing 192.168.10.${10 + i} for open Modbus/CIP ports`,
        isSuspicious: true,
        threatType: 'UNKNOWN_DEVICE'
      };
      this.packets.unshift(pkt);
    }
    this.packets = this.packets.slice(0, 100);

    const alertId = `alt-rogue-${Date.now()}`;
    const newAlert: ThreatAlert = {
      id: alertId,
      type: 'UNKNOWN_DEVICE',
      title: 'Unknown Hardware Connected to OT Subnet',
      titleHi: 'ओटी सबनेट पर अनधिकृत डिवाइस जुड़ा (रोग डिवाइस)',
      severity: 'critical',
      timestamp: new Date().toLocaleString(),
      deviceId: rogueId,
      deviceName: 'Unauthorized Device (IP: 192.168.10.244)',
      sourceIp: rogueIp,
      targetIp: '192.168.10.0/24 Subnet',
      protocol: 'ARP / TCP Port Sweep',
      port: 44818,
      description: 'An unauthorized Raspberry Pi with unregistered MAC DC:A6:32:B1:99:8A was connected to the production line switch and started scanning PLCs.',
      descriptionHi: 'उत्पादन लाइन के नेटवर्क स्विच से बिना अनुमति एक रास्पबेरी पाई जोड़ा गया है जो पीएलसी उपकरणों को स्कैन कर रहा है।',
      simpleExplanation: 'An unknown computer or hardware device was plugged into your factory network without permission and is probing your machines.',
      simpleExplanationHi: 'कारखाने के सुरक्षित नेटवर्क में किसी ने बिना अनुमति एक अज्ञात डिवाइस लगा दिया है जो मशीनों को स्कैन कर रहा है।',
      riskAssessment: 'Severe risk of industrial espionage, lateral movement, or unauthorized command injection to PLCs.',
      riskAssessmentHi: 'मशीनों में अनधिकृत कमांड भेजने या डेटा चोरी होने का गंभीर खतरा।',
      recommendedAction: 'Quarantine device immediately and disable switch port Fa0/14.',
      recommendedActionHi: 'उपकरण को तुरंत नेटवर्क से अलग (क्वारंटाइन) करें और स्विच पोर्ट बंद करें।',
      status: 'active',
      mitreAttackId: 'T0886',
      mitreAttackName: 'Remote System Discovery / Rogue Device',
      blastRadius: 'Catastrophic',
      evidenceData: [
        { label: 'Device MAC', value: 'DC:A6:32:B1:99:8A (OUI: Raspberry Pi Trading)' },
        { label: 'Assigned IP', value: '192.168.10.244 (Static Rogue Assignment)' },
        { label: 'Switch Port', value: 'Moxa EDS-408A Port 7 (Bay 1 Line Kiosk)' },
        { label: 'Activity Detected', value: 'SYN scan targeting ports 502, 102, 44818' }
      ]
    };

    this.alerts = [newAlert, ...this.alerts.filter(a => a.type !== 'UNKNOWN_DEVICE')];
    soundAndVoice.speakAlert(
      "Critical Security Alert: Unknown rogue device detected on the factory OT network. Immediate isolation recommended.",
      "गंभीर सुरक्षा चेतावनी: कारखाने के नेटवर्क पर अज्ञात अनधिकृत उपकरण का पता चला है। तुरंत अलग करें।",
      true
    );
    this.notify();
  }

  // --- ATTACK TRIGGER 3: ABNORMAL TRAFFIC SPIKE (MODBUS STORM) ---
  public triggerTrafficSpike() {
    const targetDevice = this.devices.find(d => d.id === 'dev-plc-01') || this.devices[0];
    const sourceIp = '192.168.10.184';

    // Spike device metrics
    this.devices = this.devices.map(d => {
      if (d.id === targetDevice.id) {
        return {
          ...d,
          packetRate: 980,
          cpuUsage: 96,
          securityStatus: 'critical' as const
        };
      }
      return d;
    });

    // Inject rapid packet flood
    for (let i = 0; i < 6; i++) {
      const pkt: NetworkPacket = {
        id: `pkt-spike-${Date.now()}-${i}`,
        timestamp: new Date().toLocaleTimeString(),
        sourceIp: sourceIp,
        sourceName: 'Compromised Workstation (192.168.10.184)',
        destIp: targetDevice.ip,
        destName: targetDevice.name,
        protocol: 'Modbus TCP',
        port: 502,
        sizeBytes: 1024,
        functionCode: 'FC16 Write Multiple Registers [FLOOD]',
        payloadSummary: `MODBUS FLOOD: 980 pkts/s burst targeting Coil & Holding Registers`,
        isSuspicious: true,
        threatType: 'TRAFFIC_SPIKE'
      };
      this.packets.unshift(pkt);
    }
    this.packets = this.packets.slice(0, 100);

    const alertId = `alt-spike-${Date.now()}`;
    const newAlert: ThreatAlert = {
      id: alertId,
      type: 'TRAFFIC_SPIKE',
      title: 'Abnormal Modbus Traffic Storm & DoS Attack',
      titleHi: 'असामान्य मोडबस नेटवर्क ट्रैफिक स्पाइक (डीडॉस हमला)',
      severity: 'critical',
      timestamp: new Date().toLocaleString(),
      deviceId: targetDevice.id,
      deviceName: targetDevice.name,
      sourceIp: sourceIp,
      targetIp: targetDevice.ip,
      protocol: 'Modbus TCP',
      port: 502,
      description: 'Sudden 1400% surge in Modbus TCP packets directed at Line 1 Stamping PLC. PLC CPU utilization spiked to 96%.',
      descriptionHi: 'लाइन 1 स्टैम्पिंग पीएलसी पर मोडबस टीसीपी पैकेट में 1400% की भारी वृद्धि। पीएलसी सीपीयू उपयोग 96% तक पहुंच गया।',
      simpleExplanation: 'A machine or infected computer is spamming your main stamping press with millions of commands per minute, threatening to freeze or crash the machine.',
      simpleExplanationHi: 'कोई कंप्यूटर मुख्य स्टैम्पिंग मशीन को प्रति मिनट लाखों फर्जी कमांड भेजकर ओवरलोड कर रहा है, जिससे मशीन रुक सकती है।',
      riskAssessment: 'PLC safety task cycle overruns, potential emergency trip, hydraulic valve timing desynchronization.',
      riskAssessmentHi: 'मशीन के सुरक्षा सेंसर में देरी, अचानक इमरजेंसी शटडाउन और उत्पादन ठप होने का खतरा।',
      recommendedAction: 'Engage firewall Modbus deep packet inspection (DPI) rate limiter and isolate source IP 192.168.10.184.',
      recommendedActionHi: 'मोक्सा फ़ायरवॉल पर पैकेट दर सीमित करें और स्रोत आईपी 192.168.10.184 को ब्लॉक करें।',
      status: 'active',
      mitreAttackId: 'T0814',
      mitreAttackName: 'Denial of Service (Industrial Network Exhaustion)',
      blastRadius: 'High',
      evidenceData: [
        { label: 'Baseline Packet Rate', value: '48 packets/second' },
        { label: 'Current Surged Rate', value: '980 packets/second (+1940%)' },
        { label: 'PLC CPU Load', value: '96% (Critical Threshold: >85%)' },
        { label: 'Cycle Drift', value: '+142ms latency jitter' }
      ]
    };

    this.alerts = [newAlert, ...this.alerts.filter(a => a.type !== 'TRAFFIC_SPIKE')];
    soundAndVoice.speakAlert(
      "Warning: Abnormal Modbus traffic spike detected on Line 1 Stamping Controller. Production latency at risk.",
      "चेतावनी: लाइन 1 स्टैम्पिंग कंट्रोलर पर भारी नेटवर्क ट्रैफिक स्पाइक का पता चला है।",
      true
    );
    this.notify();
  }

  // --- ATTACK TRIGGER 4: RANSOMWARE-LIKE FILE ACTIVITY ---
  public triggerRansomware() {
    const targetDevice = this.devices.find(d => d.id === 'dev-scada-02') || this.devices[2];
    const sourceIp = '192.168.10.6';

    this.updateDeviceStatus(targetDevice.id, 'critical');

    for (let i = 0; i < 5; i++) {
      const pkt: NetworkPacket = {
        id: `pkt-ransom-${Date.now()}-${i}`,
        timestamp: new Date().toLocaleTimeString(),
        sourceIp: sourceIp,
        sourceName: targetDevice.name,
        destIp: '192.168.10.5',
        destName: 'SCADA Master',
        protocol: 'SMB / OPC UA',
        port: 445,
        sizeBytes: 4096,
        functionCode: 'SMB2 FILE_RENAME / ENCRYPT',
        payloadSummary: `RANSOMWARE SIGNATURE: rapid rename: 'batch_log_2026.dat' -> 'batch_log_2026.dat.locked_ot'`,
        isSuspicious: true,
        threatType: 'RANSOMWARE'
      };
      this.packets.unshift(pkt);
    }
    this.packets = this.packets.slice(0, 100);

    const alertId = `alt-ransom-${Date.now()}`;
    const newAlert: ThreatAlert = {
      id: alertId,
      type: 'RANSOMWARE',
      title: 'Ransomware Encryption Activity Detected in OT Historian',
      titleHi: 'ओटी हिस्टोरियन सर्वर पर रैनसमवेयर एन्क्रिप्शन का पता चला',
      severity: 'critical',
      timestamp: new Date().toLocaleString(),
      deviceId: targetDevice.id,
      deviceName: targetDevice.name,
      sourceIp: '192.168.10.6 (Host Process: svchost_ot.exe)',
      targetIp: 'Local OT Disk Volumes (D:\\SCADA_Data\\)',
      protocol: 'SMB / Host File I/O',
      port: 445,
      description: 'Rapid mass file renames with .locked_ot extension detected. Canary files tampered with and volume shadow copies attempted deletion.',
      descriptionHi: 'ओटी डिस्क पर फ़ाइलों का नाम बदलकर .locked_ot किया जा रहा है। कैनरी फाइलों में छेड़छाड़ और शैडो कॉपी हटाने का प्रयास।',
      simpleExplanation: 'Ransomware is trying to lock down and encrypt your plant production recipes, quality records, and historical machine logs.',
      simpleExplanationHi: 'एक खतरनाक रैनसमवेयर वायरस कारखाने के उत्पादन डेटा, रेसिपी और मशीन रिकॉर्ड्स को लॉक (एन्क्रिप्ट) करने की कोशिश कर रहा है।',
      riskAssessment: 'Catastrophic data loss; plant shutdown if SCADA recipes and safety certificates become unreadable.',
      riskAssessmentHi: 'उत्पादन रिकॉर्ड्स का पूर्ण विनाश; यदि रेसिपी फाइलें लॉक हो गईं तो पूरा प्लांट बंद हो सकता है।',
      recommendedAction: 'Instantly isolate OT Historian from network, terminate rogue process, and revert to safe offline air-gapped backup snapshot.',
      recommendedActionHi: 'सर्वर को तुरंत नेटवर्क से अलग करें, संदिग्ध प्रक्रिया बंद करें और सुरक्षित ऑफलाइन बैकअप से रीस्टोर करें।',
      status: 'active',
      mitreAttackId: 'T0879',
      mitreAttackName: 'Data Encrypted for Impact (Industrial Ransomware)',
      blastRadius: 'Catastrophic',
      evidenceData: [
        { label: 'Encryption Velocity', value: '420 files renamed in 3.2 seconds' },
        { label: 'Target Extensions', value: '.mdf, .ldf, .csv, .recipe, .gcode' },
        { label: 'Canary File Breached', value: 'D:\\SCADA_Data\\.canary_integrity.bin' },
        { label: 'Ransom Note Dropped', value: 'README_RECOVER_FACTORY_FILES.txt' }
      ]
    };

    this.alerts = [newAlert, ...this.alerts.filter(a => a.type !== 'RANSOMWARE')];
    soundAndVoice.speakAlert(
      "Emergency Cyber Alert: Ransomware file encryption activity detected on SCADA Historian Server. Isolate immediately.",
      "आपातकालीन साइबर चेतावनी: स्काडा हिस्टोरियन सर्वर पर रैनसमवेयर एन्क्रिप्शन का पता चला है। तुरंत अलग करें।",
      true
    );
    this.notify();
  }

  // --- ATTACK TRIGGER 5: RANDOM THREAT ---
  public triggerRandomThreat() {
    const threats: (() => void)[] = [
      () => this.triggerFailedLogins(),
      () => this.triggerUnknownDevice(),
      () => this.triggerTrafficSpike(),
      () => this.triggerRansomware()
    ];
    const pick = threats[Math.floor(Math.random() * threats.length)];
    pick();
  }

  // --- HELPER TO UPDATE DEVICE STATUS ---
  public updateDeviceStatus(deviceId: string, status: 'normal' | 'warning' | 'critical') {
    this.devices = this.devices.map(d => {
      if (d.id === deviceId) {
        return {
          ...d,
          securityStatus: status
        };
      }
      return d;
    });
  }

  // --- RESPONSE ACTION 1: ISOLATE / QUARANTINE DEVICE ---
  public isolateDevice(deviceId: string) {
    const device = this.devices.find(d => d.id === deviceId);
    if (!device) return;

    this.devices = this.devices.map(d => {
      if (d.id === deviceId) {
        return {
          ...d,
          networkStatus: 'quarantined' as const,
          securityStatus: 'normal' as const,
          packetRate: 0
        };
      }
      return d;
    });

    // Update associated active alert
    const affectedAlert = this.alerts.find(a => a.deviceId === deviceId && (a.status === 'active' || a.status === 'investigating'));
    if (affectedAlert) {
      affectedAlert.status = 'quarantined';
      this.recordResolution(
        affectedAlert,
        `Device ${device.name} isolated from OT network. Switch port disabled. Threat contained.`,
        `उपकरण ${device.name} को ओटी नेटवर्क से अलग कर दिया गया। स्विच पोर्ट बंद किया गया। खतरा नियंत्रित।`
      );
    }

    soundAndVoice.playSuccessChime();
    this.celebrateSuccess();
    this.notify();
  }

  // --- RESPONSE ACTION 2: UNQUARANTINE / RESTORE DEVICE ---
  public unquarantineDevice(deviceId: string) {
    this.devices = this.devices.map(d => {
      if (d.id === deviceId) {
        return {
          ...d,
          networkStatus: 'online' as const,
          securityStatus: 'normal' as const,
          packetRate: 35
        };
      }
      return d;
    });
    soundAndVoice.playSuccessChime();
    this.notify();
  }

  // --- RESPONSE ACTION 3: BLOCK IP ADDRESS ---
  public blockIpAddress(ipAddress: string) {
    if (!this.firewallBlocklist.includes(ipAddress)) {
      this.firewallBlocklist.push(ipAddress);
    }

    // Mitigate any alert caused by this source IP
    const affectedAlerts = this.alerts.filter(a => a.sourceIp.includes(ipAddress) && (a.status === 'active' || a.status === 'investigating'));
    for (const alert of affectedAlerts) {
      alert.status = 'mitigated';
      this.updateDeviceStatus(alert.deviceId, 'normal');
      this.recordResolution(
        alert,
        `Moxa OT Firewall rule deployed: Blocked traffic from ${ipAddress}. Attack ceased.`,
        `मोक्सा फ़ायरवॉल नियम लागू: ${ipAddress} से आने वाला ट्रैफिक ब्लॉक किया गया। हमला समाप्त।`
      );
    }

    soundAndVoice.playSuccessChime();
    this.celebrateSuccess();
    this.notify();
  }

  // --- RESPONSE ACTION 4: RESET AUTH & ENFORCE MFA ---
  public resetCredentials(deviceId: string) {
    const affectedAlert = this.alerts.find(a => a.deviceId === deviceId && a.type === 'FAILED_LOGINS');
    if (affectedAlert) {
      affectedAlert.status = 'mitigated';
      this.updateDeviceStatus(deviceId, 'normal');
      this.recordResolution(
        affectedAlert,
        `Reset administrative passwords, revoked active sessions, and enabled hardware MFA token validation.`,
        `प्रशासनिक पासवर्ड रीसेट किए गए, पुराने सत्र समाप्त किए और 2FA अनिवार्य किया।`
      );
    }
    soundAndVoice.playSuccessChime();
    this.celebrateSuccess();
    this.notify();
  }

  // --- RESPONSE ACTION 5: RESTORE SAFE BACKUP / FIRMWARE SNAPSHOT ---
  public restoreSafeBackup(deviceId: string) {
    const targetDevice = this.devices.find(d => d.id === deviceId);
    if (!targetDevice) return;

    this.updateDeviceStatus(deviceId, 'normal');
    this.devices = this.devices.map(d => {
      if (d.id === deviceId) {
        return {
          ...d,
          networkStatus: 'online' as const,
          securityStatus: 'normal' as const,
          cpuUsage: 25,
          packetRate: 50
        };
      }
      return d;
    });

    const affectedAlert = this.alerts.find(a => a.deviceId === deviceId && (a.type === 'RANSOMWARE' || a.type === 'TRAFFIC_SPIKE'));
    if (affectedAlert) {
      affectedAlert.status = 'mitigated';
      this.recordResolution(
        affectedAlert,
        `Restored clean system state from air-gapped golden image snapshot. Verified SHA-256 integrity hash.`,
        `सुरक्षित एयर-गैप्ड गोल्डन इमेज बैकअप से सिस्टम पुनर्स्थापित किया गया। अखंडता सत्यापित।`
      );
    }

    soundAndVoice.playSuccessChime();
    this.celebrateSuccess();
    this.notify();
  }

  // --- RESPONSE ACTION 6: MARK FALSE POSITIVE ---
  public markFalsePositive(alertId: string) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = 'false_positive';
      this.updateDeviceStatus(alert.deviceId, 'normal');
      this.recordResolution(
        alert,
        `Operator acknowledged as authorized maintenance operation / scheduled test activity.`,
        `ऑपरेटर द्वारा अधिकृत रखरखाव कार्य या निर्धारित परीक्षण के रूप में सत्यापित किया गया।`
      );
    }
    this.notify();
  }

  // --- RESET ALL TO BASELINE ---
  public resetAllBaseline() {
    this.devices = JSON.parse(JSON.stringify(INITIAL_DEVICES));
    this.alerts = [];
    this.firewallBlocklist = ['203.0.113.88', '198.51.100.4'];
    soundAndVoice.playSuccessChime();
    this.notify();
  }

  // --- RECORD TO AUDIT LOG ---
  private recordResolution(alert: ThreatAlert, actionTakenEn: string, actionTakenHi: string) {
    const historyItem: IncidentHistoryItem = {
      id: `inc-${Date.now()}`,
      alertId: alert.id,
      threatType: alert.type,
      title: alert.title,
      titleHi: alert.titleHi,
      severity: alert.severity,
      affectedDevice: `${alert.deviceName} (${alert.targetIp})`,
      timestamp: alert.timestamp,
      resolvedAt: new Date().toLocaleString(),
      resolutionTimeMinutes: 2.4,
      actionTaken: actionTakenEn,
      actionTakenHi: actionTakenHi,
      operatorNotes: `Resolved via FactoryShield Rapid Response Panel by ${this.factoryProfile.managerName}`
    };
    this.incidentHistory = [historyItem, ...this.incidentHistory];
  }

  // --- UPDATE FACTORY PROFILE (FROM WIZARD) ---
  public updateFactoryProfile(profile: Partial<FactoryProfile>) {
    this.factoryProfile = {
      ...this.factoryProfile,
      ...profile
    };
    soundAndVoice.setVoiceEnabled(this.factoryProfile.voiceAlertsEnabled);
    soundAndVoice.setLanguage(this.factoryProfile.voiceLanguage);
    this.celebrateSuccess();
    this.notify();
  }

  private celebrateSuccess() {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10b981', '#06b6d4', '#3b82f6']
      });
    } catch {
      // safe fallback
    }
  }
}

export const simulationStore = new SimulationStore();
