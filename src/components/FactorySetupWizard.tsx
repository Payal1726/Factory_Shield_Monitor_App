import React, { useState } from 'react';
import { 
  X, 
  Sliders, 
  Building2, 
  Network, 
  Cpu, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  Volume2,
  Lock,
  Sparkles
} from 'lucide-react';
import { FactoryProfile } from '../types';
import { translations } from '../utils/translations';

interface FactorySetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: FactoryProfile;
  lang: 'en' | 'hi';
  onSaveProfile: (profile: Partial<FactoryProfile>) => void;
}

export const FactorySetupWizard: React.FC<FactorySetupWizardProps> = ({
  isOpen,
  onClose,
  currentProfile,
  lang,
  onSaveProfile
}) => {
  if (!isOpen) return null;
  const t = translations[lang];

  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FactoryProfile>({ ...currentProfile });
  const [selectedPreset, setSelectedPreset] = useState<string>('auto');

  const industryPresets = [
    {
      id: 'auto',
      name: 'Automotive Precision Stamping & CNC',
      nameHi: 'ऑटोमोटिव प्रिसिजन स्टैम्पिंग एवं सीएनसी',
      sampleName: 'Apex Precision Auto-Components',
      subnet: '192.168.10.0/24'
    },
    {
      id: 'food',
      name: 'Dairy & Beverage Automated Bottling',
      nameHi: 'डेयरी एवं पेय पदार्थ स्वचालित बॉटलिंग',
      sampleName: 'FreshPure Dairy Bottling Plant',
      subnet: '192.168.20.0/24'
    },
    {
      id: 'textile',
      name: 'Textile Weaving & Dyeing Mills',
      nameHi: 'टेक्सटाइल वीविंग एवं रंगाई मिल्स',
      sampleName: 'Vardhman Modern Spinning Mill',
      subnet: '192.168.30.0/24'
    },
    {
      id: 'pharma',
      name: 'Pharmaceutical Packaging & Cleanroom',
      nameHi: 'फार्मास्युटिकल पैकेजिंग एवं क्लीनरूम',
      sampleName: 'BioHealth Formulations Unit 2',
      subnet: '192.168.40.0/24'
    }
  ];

  const handleApplyPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    const p = industryPresets.find(item => item.id === presetId);
    if (p) {
      setFormData(prev => ({
        ...prev,
        name: p.sampleName,
        industry: p.name,
        otSubnet: p.subnet
      }));
    }
  };

  const handleSave = () => {
    onSaveProfile(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                {t.wizardTitle}
              </h2>
              <p className="text-xs text-slate-400">
                Tailor cybersecurity monitoring parameters for your specific factory operations.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="grid grid-cols-4 border-b border-slate-800 text-xs font-semibold">
          {[
            { id: 1, label: t.wizardStep1, icon: Building2 },
            { id: 2, label: t.wizardStep2, icon: Network },
            { id: 3, label: t.wizardStep3, icon: Cpu },
            { id: 4, label: t.wizardStep4, icon: ShieldCheck }
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStep(st.id)}
              className={`py-3 px-2 flex items-center justify-center space-x-1.5 transition-colors border-b-2 ${
                step === st.id
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                  : step > st.id
                  ? 'border-emerald-500 text-emerald-400 bg-slate-900'
                  : 'border-transparent text-slate-500'
              }`}
            >
              <st.icon className="w-3.5 h-3.5" />
              <span className="truncate hidden sm:inline">{st.label}</span>
            </button>
          ))}
        </div>

        {/* Body based on step */}
        <div className="p-6 space-y-4 min-h-[300px]">
          {step === 1 && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  {t.lblFactoryName}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  {t.lblIndustry}
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    {t.lblLocation}
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Plant Head / Cyber Liaison
                  </label>
                  <input
                    type="text"
                    value={formData.managerName}
                    onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  {t.lblOtSubnet} (Control Network)
                </label>
                <input
                  type="text"
                  value={formData.otSubnet}
                  onChange={(e) => setFormData({ ...formData, otSubnet: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Isolated Purdue Level 1 & 2 VLAN range for industrial automation devices.
                </span>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Operating Shifts
                </label>
                <select
                  value={formData.shiftHours}
                  onChange={(e) => setFormData({ ...formData, shiftHours: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="3 Shifts (24/7 Operations)">3 Shifts (Continuous 24/7 Production)</option>
                  <option value="2 Shifts (16 Hours/Day)">2 Shifts (16 Hours/Day)</option>
                  <option value="Single General Shift (8 Hours)">Single General Shift (8 Hours)</option>
                </select>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg text-slate-400">
                <span className="font-semibold text-cyan-400 block mb-1">Default OT Protocols Monitored:</span>
                <div className="flex flex-wrap gap-1.5 mt-1 font-mono text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">Modbus TCP : 502</span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">OPC UA : 4840</span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">EtherNet/IP : 44818</span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">S7Comm : 102</span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">MQTT : 1883</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3 text-xs">
              <span className="text-slate-300 font-semibold block">
                Select an SME Factory Equipment Preset:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {industryPresets.map(preset => {
                  const isSelected = selectedPreset === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleApplyPreset(preset.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-cyan-950/40 border-cyan-500 text-slate-100 shadow-md'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-200">
                          {lang === 'hi' ? preset.nameHi : preset.name}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {preset.sampleName}
                      </p>
                      <span className="text-[10px] font-mono text-cyan-400 mt-1 block">
                        Subnet: {preset.subnet}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl">
                <div>
                  <span className="text-slate-200 font-bold block">
                    Bilingual Voice Emergency Alerts
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Speaks loud audible warnings when critical threats or unknown devices are detected.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.voiceAlertsEnabled}
                  onChange={(e) => setFormData({ ...formData, voiceAlertsEnabled: e.target.checked })}
                  className="w-4 h-4 accent-cyan-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl">
                <div>
                  <span className="text-slate-200 font-bold block">
                    Voice Alert Language
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Select whether voice warnings speak in English or Hindi.
                  </span>
                </div>
                <select
                  value={formData.voiceLanguage}
                  onChange={(e) => setFormData({ ...formData, voiceLanguage: e.target.value as 'en' | 'hi' })}
                  className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-md text-slate-200 font-medium"
                >
                  <option value="en">English (Voice)</option>
                  <option value="hi">हिन्दी (Hindi Voice)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl">
                <div>
                  <span className="text-slate-200 font-bold block">
                    Automated Defense Isolation
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Automatically isolate rogue devices or ransomware hosts to stop spread.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.autoQuarantineEnabled}
                  onChange={(e) => setFormData({ ...formData, autoQuarantineEnabled: e.target.checked })}
                  className="w-4 h-4 accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.btnBack}</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center space-x-1 cursor-pointer"
            >
              <span>{t.btnNext}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{t.btnSaveWizard}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
