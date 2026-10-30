/**
 * FactoryShield Monitor App - Core Types
 */

export type DeviceType = 'PLC' | 'SCADA' | 'HMI' | 'IIoT' | 'GATEWAY';

export type SecurityStatus = 'normal' | 'warning' | 'critical'; // Green, Amber, Red

export type NetworkStatus = 'online' | 'degraded' | 'quarantined' | 'offline';

export type PurdueZone = 
  | 'Level 0/1 (Process/Control)'
  | 'Level 2 (Supervisory)'
  | 'Level 3 (Operations & DMZ)';

export interface IndustrialDevice {
  id: string;
  name: string;
  type: DeviceType;
  vendor: string;
  model: string;
  ip: string;
  mac: string;
  subnet: string;
  protocol: 'Modbus TCP' | 'OPC UA' | 'EtherNet/IP' | 'PROFINET' | 'MQTT' | 'S7Comm' | 'HTTPS';
  port: number;
  firmware: string;
  zone: PurdueZone;
  location: string;
  securityStatus: SecurityStatus;
  networkStatus: NetworkStatus;
  lastSeen: string;
  cpuUsage: number;
  packetRate: number; // packets/sec
  vulnerabilitiesCount: number;
  description: string;
  isRogue?: boolean;
}

export type ThreatType = 
  | 'FAILED_LOGINS'
  | 'UNKNOWN_DEVICE'
  | 'TRAFFIC_SPIKE'
  | 'RANSOMWARE'
  | 'UNAUTHORIZED_PLC_COMMAND';

export type ThreatSeverity = 'critical' | 'high' | 'medium' | 'low';

export type AlertStatus = 'active' | 'investigating' | 'mitigated' | 'quarantined' | 'false_positive';

export interface ThreatAlert {
  id: string;
  type: ThreatType;
  title: string;
  titleHi: string;
  severity: ThreatSeverity;
  timestamp: string;
  deviceId: string;
  deviceName: string;
  sourceIp: string;
  targetIp: string;
  protocol: string;
  port: number;
  description: string;
  descriptionHi: string;
  simpleExplanation: string;
  simpleExplanationHi: string;
  riskAssessment: string;
  riskAssessmentHi: string;
  recommendedAction: string;
  recommendedActionHi: string;
  status: AlertStatus;
  mitreAttackId: string;
  mitreAttackName: string;
  blastRadius: 'Low' | 'Medium' | 'High' | 'Catastrophic';
  evidenceData: {
    label: string;
    value: string;
  }[];
  mitigationHistory?: string[];
}

export interface NetworkPacket {
  id: string;
  timestamp: string;
  sourceIp: string;
  sourceName?: string;
  destIp: string;
  destName?: string;
  protocol: string;
  port: number;
  sizeBytes: number;
  functionCode?: string;
  payloadSummary: string;
  isSuspicious: boolean;
  threatType?: ThreatType;
}

export interface IncidentHistoryItem {
  id: string;
  alertId: string;
  threatType: ThreatType;
  title: string;
  titleHi: string;
  severity: ThreatSeverity;
  affectedDevice: string;
  timestamp: string;
  resolvedAt: string;
  resolutionTimeMinutes: number;
  actionTaken: string;
  actionTakenHi: string;
  operatorNotes: string;
}

export interface FactoryProfile {
  name: string;
  industry: string;
  location: string;
  shiftHours: string;
  managerName: string;
  otSubnet: string;
  autoQuarantineEnabled: boolean;
  voiceAlertsEnabled: boolean;
  voiceLanguage: 'en' | 'hi';
}

export type ActiveTab = 'dashboard' | 'devices' | 'investigation' | 'incidents' | 'traffic';
