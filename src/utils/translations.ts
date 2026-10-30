/**
 * FactoryShield Monitor App - Bilingual Dictionary (English & Hindi)
 */

export const translations = {
  en: {
    // Header & Meta
    appTitle: "FactoryShield Monitor",
    tagline: "Industrial Cybersecurity for SME Manufacturing",
    simulationBadge: "SIMULATED OT ENVIRONMENT — SAFE DEMONSTRATION MODE",
    activeLine: "Line 1 — Stamping & Packaging Cell",
    normalStatus: "Systems Normal",
    warningStatus: "Suspicious Activity",
    criticalStatus: "Critical Intrusion Detected",
    
    // Navigation
    navDashboard: "Security Overview",
    navDevices: "Equipment Inventory",
    navInvestigation: "Threat Investigation Center",
    navIncidents: "Incident History",
    navTraffic: "Live Network Sniffer",
    navWizard: "Factory Setup",
    
    // Quick Metrics
    overallSecurityScore: "OT Cyber Health Score",
    activeThreats: "Active Threats",
    monitoredDevices: "Monitored Devices",
    quarantinedDevices: "Quarantined / Isolated",
    packetsPerSec: "Industrial Packet Rate",
    firewallRules: "Active Firewall Filters",
    
    // Simulator Bar
    simBarTitle: "Threat Simulator (Demonstration Panel)",
    simBarDesc: "Simulate common SME industrial attacks to test detection & automated response workflows:",
    btnBruteForce: "Simulate Failed Logins",
    btnRogueDevice: "Simulate Unknown Device",
    btnTrafficSpike: "Simulate Modbus Storm",
    btnRansomware: "Simulate Ransomware",
    btnRandomThreat: "Simulate Random Intrusion",
    btnBenignTraffic: "Inject Safe Modbus Telemetry",
    btnResetAll: "Reset Safe Baseline",
    simSpeed: "Simulation Speed",
    simPaused: "Paused",
    simNormal: "1x Real-time",
    simFast: "3x Fast-forward",

    // Device cards
    filterAll: "All Devices",
    filterPLC: "PLCs (Logic)",
    filterSCADA: "SCADA & Servers",
    filterHMI: "HMIs (Operator Panels)",
    filterIIoT: "IIoT Sensors",
    purdueLevel01: "Purdue Level 0/1 (Process/Control)",
    purdueLevel2: "Purdue Level 2 (Supervisory)",
    purdueLevel3: "Purdue Level 3 (Operations/DMZ)",
    statusNormal: "Normal (Green)",
    statusWarning: "Warning (Amber)",
    statusCritical: "Critical (Red)",
    btnIsolate: "Isolate Device",
    btnRestore: "Restore to Network",
    btnInspect: "Inspect Device",
    
    // Alert & Response Actions
    activeAlertsTitle: "Real-time Security Alerts & Detection",
    noActiveThreats: "No active cyber threats detected. All industrial controllers and field sensors are operating safely.",
    severityCritical: "CRITICAL SEVERITY",
    severityHigh: "HIGH SEVERITY",
    severityMedium: "MEDIUM WARNING",
    severityLow: "LOW INFO",
    whatHappened: "What Happened (Plain Explanation)",
    riskToFactory: "Potential Factory Impact",
    recommendedAction: "Recommended Response Action",
    btnInvestigate: "Open Investigation Room",
    btnApplyAction: "Execute Response Action",
    btnAcknowledge: "Acknowledge Alert",
    btnDismiss: "Mark as False Positive",
    btnBlockIp: "Block Threat Source IP",
    btnResetCreds: "Force Password & MFA Reset",
    btnRestoreBackup: "Rollback Firmware / Clean Snapshot",
    
    // Voice Alerts
    voiceAlertsOn: "Voice Alerts Active",
    voiceAlertsOff: "Voice Alerts Muted",
    testVoiceBtn: "Test Voice Alert",
    
    // Investigation Center
    investigationTitle: "Threat Investigation & Incident Response Room",
    blastRadius: "Estimated Blast Radius",
    mitreAttack: "MITRE ATT&CK for ICS",
    technicalEvidence: "Packet Forensics & Technical Evidence",
    remediationPlaybook: "Standard Incident Response Playbook",
    playbookStep1: "1. Immediate Containment",
    playbookStep2: "2. Technical Verification",
    playbookStep3: "3. Safe Recovery",
    playbookStep4: "4. Post-Incident Hardening",
    
    // Incident History
    historyTitle: "Factory Security Incident Log & Audit Trail",
    historyDesc: "Historical record of detected OT anomalies, operator responses, and mean time to remediate (MTTR).",
    colAlert: "Incident Name",
    colDevice: "Affected Equipment",
    colSeverity: "Severity",
    colDetected: "Detected At",
    colResolved: "Resolved At",
    colAction: "Remediation Action",
    btnExportReport: "Export Security Audit Log",
    
    // Factory Wizard
    wizardTitle: "Factory Profile Setup Wizard",
    wizardStep1: "1. Plant Profile",
    wizardStep2: "2. OT Network",
    wizardStep3: "3. Equipment List",
    wizardStep4: "4. Defense Policies",
    lblFactoryName: "Factory / Plant Name",
    lblIndustry: "Industry Vertical",
    lblLocation: "Plant Location",
    lblOtSubnet: "OT Subnet Range",
    btnNext: "Next Step",
    btnBack: "Back",
    btnSaveWizard: "Apply & Update Factory",
    
    // Tooltips
    safeModeNotice: "This prototype runs locally with simulated industrial network packets (Modbus, OPC UA, CIP, MQTT). No physical hardware required."
  },

  hi: {
    // Header & Meta
    appTitle: "फैक्ट्री शील्ड मॉनिटर",
    tagline: "छोटे व मध्यम कारखानों के लिए औद्योगिक साइबर सुरक्षा",
    simulationBadge: "सिम्युलेटेड ओटी वातावरण — सुरक्षित डेमो मोड",
    activeLine: "लाइन 1 — स्टैम्पिंग और पैकेजिंग यूनिट",
    normalStatus: "सभी प्रणालियां सुरक्षित हैं",
    warningStatus: "संदिग्ध गतिविधि का पता चला",
    criticalStatus: "गंभीर साइबर हमला दर्ज!",
    
    // Navigation
    navDashboard: "सुरक्षा अवलोकन",
    navDevices: "उपकरण सूची (इन्वेंट्री)",
    navInvestigation: "खतरा जांच व प्रतिक्रिया केंद्र",
    navIncidents: "घटना इतिहास",
    navTraffic: "लाइव नेटवर्क पैकेट",
    navWizard: "फैक्ट्री सेटअप",
    
    // Quick Metrics
    overallSecurityScore: "ओटी साइबर सुरक्षा स्कोर",
    activeThreats: "सक्रिय खतरे",
    monitoredDevices: "निगरानी वाले उपकरण",
    quarantinedDevices: "अलग / क्वारंटाइन उपकरण",
    packetsPerSec: "औद्योगिक पैकेट दर",
    firewallRules: "सक्रिय फ़ायरवॉल नियम",
    
    // Simulator Bar
    simBarTitle: "खतरा सिम्युलेटर (डेमो पैनल)",
    simBarDesc: "जांचने के लिए सामान्य औद्योगिक साइबर हमलों का परीक्षण करें:",
    btnBruteForce: "विफल लॉगिन हमला (पासवर्ड क्रैक)",
    btnRogueDevice: "अज्ञात उपकरण कनेक्शन (रोग डिवाइस)",
    btnTrafficSpike: "मोडबस ट्रैफिक स्पाइक (डीडॉस)",
    btnRansomware: "रैनसमवेयर फाइल गतिविधि",
    btnRandomThreat: "अनियमित खतरा उत्पन्न करें",
    btnBenignTraffic: "सामान्य सुरक्षित डेटा भेजें",
    btnResetAll: "सभी सामान्य करें (रीसेट)",
    simSpeed: "सिम्युलेशन गति",
    simPaused: "रोका गया",
    simNormal: "1x सामान्य",
    simFast: "3x तेज़",

    // Device cards
    filterAll: "सभी उपकरण",
    filterPLC: "पीएलसी (कंट्रोलर)",
    filterSCADA: "स्काडा और सर्वर",
    filterHMI: "एचएमआई (स्क्रीन)",
    filterIIoT: "आईआईओटी सेंसर",
    purdueLevel01: "पर्ड्यू स्तर 0/1 (प्रक्रिया/नियंत्रण)",
    purdueLevel2: "पर्ड्यू स्तर 2 (पर्यवेक्षी स्काडा)",
    purdueLevel3: "पर्ड्यू स्तर 3 (ऑपरेशंस)",
    statusNormal: "सुरक्षित (हरा)",
    statusWarning: "चेतावनी (पीला)",
    statusCritical: "गंभीर खतरा (लाल)",
    btnIsolate: "उपकरण अलग (आइसोलेट) करें",
    btnRestore: "नेटवर्क पर बहाल करें",
    btnInspect: "उपकरण विवरण देखें",
    
    // Alert & Response Actions
    activeAlertsTitle: "रीयल-टाइम सुरक्षा अलर्ट एवं पहचान",
    noActiveThreats: "कोई सक्रिय साइबर खतरा नहीं है। सभी औद्योगिक उपकरण और सेंसर सुरक्षित रूप से चल रहे हैं।",
    severityCritical: "गंभीर स्तर (क्रिटिकल)",
    severityHigh: "उच्च स्तर (हाई)",
    severityMedium: "मध्यम स्तर (वार्निंग)",
    severityLow: "सामान्य सूचना",
    whatHappened: "क्या हुआ (सरल भाषा में)",
    riskToFactory: "कारखाने पर संभावित प्रभाव",
    recommendedAction: "सुझाई गई त्वरित कार्रवाई",
    btnInvestigate: "जांच कक्ष खोलें",
    btnApplyAction: "कार्रवाई तुरंत लागू करें",
    btnAcknowledge: "स्वीकार करें",
    btnDismiss: "गलत पहचान (फॉल्स पॉजिटिव)",
    btnBlockIp: "हमलावर आईपी ब्लॉक करें",
    btnResetCreds: "पासवर्ड व 2FA तुरंत बदलें",
    btnRestoreBackup: "सुरक्षित बैकअप से रीस्टोर करें",
    
    // Voice Alerts
    voiceAlertsOn: "वॉयस अलर्ट सक्रिय",
    voiceAlertsOff: "वॉयस अलर्ट म्यूट",
    testVoiceBtn: "वॉयस टेस्ट करें",
    
    // Investigation Center
    investigationTitle: "खतरा जांच एवं समाधान कक्ष",
    blastRadius: "संभावित प्रभाव सीमा",
    mitreAttack: "एमआईटीआरई एटीटी&सीके (आईसीएस)",
    technicalEvidence: "पैकेट फॉरेंसिक एवं साक्ष्य",
    remediationPlaybook: "मानक सुरक्षा प्रतिक्रिया गाइड",
    playbookStep1: "1. तुरंत खतरा सीमित करें (क्वारंटाइन)",
    playbookStep2: "2. तकनीकी साक्ष्य सत्यापन",
    playbookStep3: "3. सुरक्षित रिकवरी व रीस्टार्ट",
    playbookStep4: "4. भविष्य के लिए सुरक्षा नियम मजबूत करना",
    
    // Incident History
    historyTitle: "फैक्ट्री सुरक्षा घटना इतिहास एवं ऑडिट लॉग",
    historyDesc: "पहचाने गए साइबर खतरों, ऑपरेटर द्वारा की गई कार्रवाई और समाधान समय का विवरण।",
    colAlert: "घटना का नाम",
    colDevice: "प्रभावित उपकरण",
    colSeverity: "गंभीरता",
    colDetected: "पहचान का समय",
    colResolved: "समाधान समय",
    colAction: "की गई कार्रवाई",
    btnExportReport: "सुरक्षा ऑडिट रिपोर्ट डाउनलोड करें",
    
    // Factory Wizard
    wizardTitle: "फैक्ट्री प्रोफाइल सेटअप विज़ार्ड",
    wizardStep1: "1. प्लांट प्रोफाइल",
    wizardStep2: "2. ओटी नेटवर्क",
    wizardStep3: "3. उपकरण सूची",
    wizardStep4: "4. सुरक्षा नीतियां",
    lblFactoryName: "कारखाने / प्लांट का नाम",
    lblIndustry: "उद्योग का प्रकार",
    lblLocation: "प्लांट का स्थान",
    lblOtSubnet: "ओटी सबनेट रेंज",
    btnNext: "अगला चरण",
    btnBack: "पीछे जाएं",
    btnSaveWizard: "सहेजें और फैक्ट्री अपडेट करें",
    
    // Tooltips
    safeModeNotice: "यह प्रोटोटाइप बिना किसी हार्डवेयर के सुरक्षित सिम्युलेटेड औद्योगिक नेटवर्क डेटा (Modbus, OPC UA, MQTT) पर चलता है।"
  }
};
