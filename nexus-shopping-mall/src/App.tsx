import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Store, 
  Layers, 
  DollarSign, 
  CreditCard, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff,
  LogOut, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  Code2, 
  GraduationCap, 
  Laptop, 
  ExternalLink,
  Phone,
  Calendar,
  Lock,
  LogIn,
  ArrowRight,
  Receipt,
  RotateCcw,
  HelpCircle
} from 'lucide-react';
import JSZip from 'jszip';
import { PROJECT_FILES, ProjectFile } from './data/projectFiles.ts';
import MallHomepage from './components/MallHomepage.tsx';

// Types matching the Spring Boot Entities
interface TenantRecord {
  id: number;
  username: string;
  fullName: string;
  email: string;
  shopNumber: string;
  businessName: string;
  category: string;
  monthlyRent: number;
  leaseStart: string;
  leaseEnd: string;
  status: 'ACTIVE' | 'INACTIVE' | 'TERMINATED';
}

interface OfficerRecord {
  id: number;
  username: string;
  fullName: string;
  email: string;
  department: string;
  assignedFloor: number;
  phone: string;
}

interface BillRecord {
  id: number;
  tenantId: number;
  businessName: string;
  shopNumber: string;
  billingMonth: string;
  amountDue: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  paymentDate: string | null;
}

export default function App() {
  // Navigation & View Modes
  const [activeTab, setActiveTab] = useState<'app' | 'code' | 'docs'>('app');
  const [currentRole, setCurrentRole] = useState<'HOMEPAGE' | 'ROLE_ADMIN' | 'ROLE_OFFICER' | 'ROLE_TENANT' | 'LOGIN' | 'ERROR'>('HOMEPAGE');
  const [selectedTenantUser, setSelectedTenantUser] = useState<'tenant1' | 'tenant2'>('tenant1');
  const [browserUrl, setBrowserUrl] = useState<string>('http://localhost:8080/');

  // Code Explorer State
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

  // Mall Info State
  const mallInfo = {
    name: 'Nexus Grand Galleria Mall',
    city: 'Metropolis City',
    totalFloors: 5,
    totalUnits: 60,
  };

  // State: Tenants
  const [tenants, setTenants] = useState<TenantRecord[]>([
    {
      id: 1,
      username: 'tenant1',
      fullName: 'Elena Rostova',
      email: 'contact@zarafashion.com',
      shopNumber: 'Shop 101',
      businessName: 'Zara Premier Outlet',
      category: 'Fashion & Apparel',
      monthlyRent: 8500.00,
      leaseStart: '2024-01-01',
      leaseEnd: '2027-12-31',
      status: 'ACTIVE',
    },
    {
      id: 2,
      username: 'tenant2',
      fullName: 'David Chen',
      email: 'support@applepremium.com',
      shopNumber: 'Shop 204',
      businessName: 'Apple Authorized Reseller',
      category: 'Electronics',
      monthlyRent: 12500.00,
      leaseStart: '2023-06-01',
      leaseEnd: '2026-05-31',
      status: 'ACTIVE',
    }
  ]);

  // State: Officers
  const [officers, setOfficers] = useState<OfficerRecord[]>([
    {
      id: 1,
      username: 'officer1',
      fullName: 'Marcus Sterling',
      email: 'officer1@nexusmall.com',
      department: 'Operations & Safety',
      assignedFloor: 2,
      phone: '+1 (555) 234-8901',
    }
  ]);

  // State: Bills
  const [bills, setBills] = useState<BillRecord[]>([
    {
      id: 1,
      tenantId: 1,
      businessName: 'Zara Premier Outlet',
      shopNumber: 'Shop 101',
      billingMonth: 'October 2026',
      amountDue: 8500.00,
      status: 'PAID',
      paymentDate: '2026-10-02',
    },
    {
      id: 2,
      tenantId: 1,
      businessName: 'Zara Premier Outlet',
      shopNumber: 'Shop 101',
      billingMonth: 'November 2026',
      amountDue: 8500.00,
      status: 'PENDING',
      paymentDate: null,
    },
    {
      id: 3,
      tenantId: 2,
      businessName: 'Apple Authorized Reseller',
      shopNumber: 'Shop 204',
      billingMonth: 'October 2026',
      amountDue: 12500.00,
      status: 'PAID',
      paymentDate: '2026-10-01',
    },
    {
      id: 4,
      tenantId: 2,
      businessName: 'Apple Authorized Reseller',
      shopNumber: 'Shop 204',
      billingMonth: 'November 2026',
      amountDue: 12500.00,
      status: 'OVERDUE',
      paymentDate: null,
    }
  ]);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Authentication & Login Simulation State
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [logoutNotice, setLogoutNotice] = useState(false);

  // Modals state
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [showEditTenantModal, setShowEditTenantModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState<TenantRecord | null>(null);
  const [showAssignOfficerModal, setShowAssignOfficerModal] = useState(false);
  const [receiptBill, setReceiptBill] = useState<BillRecord | null>(null);
  const [showRunGuideModal, setShowRunGuideModal] = useState(false);

  // Add Tenant Form State
  const [newTenantForm, setNewTenantForm] = useState({
    username: '',
    password: 'tenant123',
    fullName: '',
    email: '',
    shopNumber: '',
    businessName: '',
    category: 'Fashion & Apparel',
    monthlyRent: '',
    leaseStart: '2026-01-01',
    leaseEnd: '2028-12-31'
  });

  // Assign Officer Form State
  const [officerForm, setOfficerForm] = useState({
    username: '',
    fullName: '',
    email: '',
    department: 'Operations & Safety',
    assignedFloor: 1,
    phone: ''
  });

  // Officer inspection checkboxes
  const [checkpoints, setCheckpoints] = useState({
    corridors: true,
    extinguishers: true,
    escalators: true,
    lockdown: false
  });
  const [inspectionLogs, setInspectionLogs] = useState<string[]>([
    '08:30 AM - Morning Fire & Emergency Route Clearance Pass (Floor 2)',
    '11:45 AM - HVAC & Electrical Load Verified Normal (Floor 2)'
  ]);

  // Derived Metrics
  const totalShops = mallInfo.totalUnits;
  const occupiedShops = useMemo(() => tenants.filter(t => t.status === 'ACTIVE').length, [tenants]);
  const vacantUnits = Math.max(0, totalShops - occupiedShops);
  const totalMonthlyRevenue = useMemo(() => 
    tenants.filter(t => t.status === 'ACTIVE').reduce((sum, t) => sum + t.monthlyRent, 0)
  , [tenants]);
  const occupancyRate = ((occupiedShops / totalShops) * 100).toFixed(1);

  // Helper toast notification
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Login authentication handler matching Spring Security credentials
  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const u = loginUsername.trim().toLowerCase();
    const p = loginPassword.trim();

    if (u === 'admin' && (p === 'admin123' || p === 'admin')) {
      setLoginError(null);
      setLogoutNotice(false);
      setCurrentRole('ROLE_ADMIN');
      triggerToast('Authenticated as Administrator!');
      return;
    }

    if (u === 'officer1' && (p === 'officer123' || p === 'officer')) {
      setLoginError(null);
      setLogoutNotice(false);
      setCurrentRole('ROLE_OFFICER');
      triggerToast('Authenticated as Floor Officer Marcus Sterling (Floor 2)!');
      return;
    }

    if (u === 'tenant1' && (p === 'tenant123' || p === 'tenant')) {
      setLoginError(null);
      setLogoutNotice(false);
      setSelectedTenantUser('tenant1');
      setCurrentRole('ROLE_TENANT');
      setBrowserUrl('http://localhost:8080/tenant/dashboard');
      triggerToast('Authenticated as Tenant: Zara Premier Outlet (Shop 101)!');
      return;
    }

    if (u === 'tenant2' && (p === 'tenant123' || p === 'tenant')) {
      setLoginError(null);
      setLogoutNotice(false);
      setSelectedTenantUser('tenant2');
      setCurrentRole('ROLE_TENANT');
      setBrowserUrl('http://localhost:8080/tenant/dashboard');
      triggerToast('Authenticated as Tenant: Apple Authorized Reseller (Shop 204)!');
      return;
    }

    const dynTenant = tenants.find(t => t.username.toLowerCase() === u);
    if (dynTenant && (p === 'tenant123' || p === 'tenant' || p === 'password')) {
      setLoginError(null);
      setLogoutNotice(false);
      setCurrentRole('ROLE_TENANT');
      setBrowserUrl('http://localhost:8080/tenant/dashboard');
      triggerToast(`Authenticated as Tenant: ${dynTenant.businessName}!`);
      return;
    }

    setLoginError('Invalid username or password. Please verify your credentials.');
  };

  const handleBrowserUrlNavigate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = (browserUrl || '').trim().toLowerCase();
    if (clean.includes('/login')) {
      setCurrentRole('LOGIN');
      setBrowserUrl('http://localhost:8080/login');
      triggerToast('Navigated to: http://localhost:8080/login');
    } else if (clean.includes('/admin')) {
      setCurrentRole('ROLE_ADMIN');
      setBrowserUrl('http://localhost:8080/admin/dashboard');
      triggerToast('Navigated to: http://localhost:8080/admin/dashboard');
    } else if (clean.includes('/officer')) {
      setCurrentRole('ROLE_OFFICER');
      setBrowserUrl('http://localhost:8080/officer/dashboard');
      triggerToast('Navigated to: http://localhost:8080/officer/dashboard');
    } else if (clean.includes('/tenant')) {
      setCurrentRole('ROLE_TENANT');
      setBrowserUrl('http://localhost:8080/tenant/dashboard');
      triggerToast('Navigated to: http://localhost:8080/tenant/dashboard');
    } else if (clean.includes('/error')) {
      setCurrentRole('ERROR');
      setBrowserUrl('http://localhost:8080/error');
      triggerToast('Navigated to: http://localhost:8080/error');
    } else {
      // Default: localhost:8080, localhost:8080/, /, /home
      setCurrentRole('HOMEPAGE');
      setBrowserUrl('http://localhost:8080/');
      triggerToast('Navigated to: http://localhost:8080/ (Public Mall Homepage)');
    }
  };

  const handleQuickLogin = (u: string, p: string, role: 'ROLE_ADMIN' | 'ROLE_OFFICER' | 'ROLE_TENANT', tenantUser?: 'tenant1' | 'tenant2') => {
    setLoginUsername(u);
    setLoginPassword(p);
    setLoginError(null);
    setLogoutNotice(false);
    if (tenantUser) setSelectedTenantUser(tenantUser);
    setCurrentRole(role);
    if (role === 'ROLE_ADMIN') setBrowserUrl('http://localhost:8080/admin/dashboard');
    else if (role === 'ROLE_OFFICER') setBrowserUrl('http://localhost:8080/officer/dashboard');
    else if (role === 'ROLE_TENANT') setBrowserUrl('http://localhost:8080/tenant/dashboard');
    triggerToast(`Logged in successfully as ${u}`);
  };

  const handleLogout = () => {
    setLogoutNotice(true);
    setLoginError(null);
    setCurrentRole('HOMEPAGE');
    setBrowserUrl('http://localhost:8080/');
    triggerToast('Logged out. Returned to Public Mall Homepage.');
  };

  // Filtered tenants for Admin
  const filteredTenants = useMemo(() => {
    return tenants.filter(t => {
      const matchesSearch = t.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            t.shopNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            t.fullName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter ? t.category === categoryFilter : true;
      return matchesSearch && matchesCategory;
    });
  }, [tenants, searchTerm, categoryFilter]);

  // Current active tenant in Tenant Portal
  const activeTenant = useMemo(() => {
    return tenants.find(t => t.username === selectedTenantUser) || tenants[0];
  }, [tenants, selectedTenantUser]);

  const activeTenantBills = useMemo(() => {
    return bills.filter(b => b.tenantId === activeTenant?.id);
  }, [bills, activeTenant]);

  // Active officer
  const activeOfficer = officers[0];
  const floorTenants = useMemo(() => {
    return tenants.filter(t => t.status === 'ACTIVE' && t.shopNumber.includes(`Shop ${activeOfficer.assignedFloor}`));
  }, [tenants, activeOfficer]);

  // Action: Add Tenant
  const handleAddTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantForm.username || !newTenantForm.businessName || !newTenantForm.shopNumber || !newTenantForm.monthlyRent) {
      alert('Please fill out all mandatory fields.');
      return;
    }

    const newId = tenants.length ? Math.max(...tenants.map(t => t.id)) + 1 : 1;
    const rent = parseFloat(newTenantForm.monthlyRent);

    const newTenant: TenantRecord = {
      id: newId,
      username: newTenantForm.username,
      fullName: newTenantForm.fullName || 'Store Manager',
      email: newTenantForm.email || `${newTenantForm.username}@malltenant.com`,
      shopNumber: newTenantForm.shopNumber,
      businessName: newTenantForm.businessName,
      category: newTenantForm.category,
      monthlyRent: rent,
      leaseStart: newTenantForm.leaseStart,
      leaseEnd: newTenantForm.leaseEnd,
      status: 'ACTIVE'
    };

    setTenants(prev => [...prev, newTenant]);

    // Add initial bill
    const newBill: BillRecord = {
      id: bills.length ? Math.max(...bills.map(b => b.id)) + 1 : 1,
      tenantId: newId,
      businessName: newTenant.businessName,
      shopNumber: newTenant.shopNumber,
      billingMonth: 'December 2026',
      amountDue: rent,
      status: 'PENDING',
      paymentDate: null
    };
    setBills(prev => [newBill, ...prev]);

    setShowAddTenantModal(false);
    triggerToast(`Tenant '${newTenant.businessName}' successfully registered into Unit ${newTenant.shopNumber}!`);
    setNewTenantForm({
      username: '',
      password: 'tenant123',
      fullName: '',
      email: '',
      shopNumber: '',
      businessName: '',
      category: 'Fashion & Apparel',
      monthlyRent: '',
      leaseStart: '2026-01-01',
      leaseEnd: '2028-12-31'
    });
  };

  // Action: Edit Tenant
  const handleSaveEditTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTenant) return;

    setTenants(prev => prev.map(t => t.id === editingTenant.id ? editingTenant : t));
    setShowEditTenantModal(false);
    triggerToast(`Tenant '${editingTenant.businessName}' updated successfully.`);
  };

  // Action: Delete Tenant
  const handleDeleteTenant = (id: number) => {
    const toDelete = tenants.find(t => t.id === id);
    if (!confirm(`Are you sure you want to terminate & remove lease for ${toDelete?.businessName}?`)) return;
    setTenants(prev => prev.filter(t => t.id !== id));
    setBills(prev => prev.filter(b => b.tenantId !== id));
    triggerToast(`Commercial unit deleted.`);
  };

  // Action: Assign Officer
  const handleAssignOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    const newOfficer: OfficerRecord = {
      id: officers.length ? Math.max(...officers.map(o => o.id)) + 1 : 1,
      username: officerForm.username || `officer${officers.length + 1}`,
      fullName: officerForm.fullName,
      email: officerForm.email,
      department: officerForm.department,
      assignedFloor: Number(officerForm.assignedFloor),
      phone: officerForm.phone
    };

    setOfficers(prev => [...prev, newOfficer]);
    setShowAssignOfficerModal(false);
    triggerToast(`Officer ${newOfficer.fullName} successfully assigned to Floor ${newOfficer.assignedFloor}!`);
  };

  // Action: Pay Rent
  const handlePayRent = (billId: number) => {
    const today = new Date().toISOString().split('T')[0];
    setBills(prev => prev.map(b => {
      if (b.id === billId) {
        return {
          ...b,
          status: 'PAID',
          paymentDate: today
        };
      }
      return b;
    }));
    triggerToast('Payment confirmed! Rental ledger updated to PAID.');
  };

  // Copy code file
  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download complete project ZIP
  const handleDownloadZip = async () => {
    try {
      setDownloadingZip(true);
      const zip = new JSZip();

      // Add all project files into zip structure
      PROJECT_FILES.forEach(file => {
        zip.file(file.path, file.content);
      });

      // Add readme and run script
      zip.file("README.md", `# Shopping Mall Management System (SMMS)
## BCA Final-Year Academic Capstone Project

### Tech Stack
- Java 17+
- Spring Boot 3.2.5
- Spring Data JPA + Hibernate
- Spring Security 6 (BCrypt Password Encoder)
- H2 In-Memory (Zero-Setup Auto Boot) + Optional MySQL 8.x
- Thymeleaf + Bootstrap 5 + Bootstrap Icons

---

### 3 Quick Ways to Run Locally:

#### Way 1: 1-Click Script (Recommended)
- **Windows**: Double-click \`run.bat\` in this folder. It verifies Java, starts Spring Boot, and opens the homepage in your browser!
- **Mac / Linux**: Run \`chmod +x run.sh && ./run.sh\`

#### Way 2: Maven Wrapper / Command Line
\`\`\`bash
# Windows
mvnw.cmd clean spring-boot:run

# Mac / Linux
./mvnw clean spring-boot:run
\`\`\`

#### Way 3: IntelliJ IDEA / Eclipse / VS Code
1. Open your IDE -> **Open Project** -> Select this folder (where \`pom.xml\` is).
2. Navigate to \`src/main/java/com/mall/ShoppingMallApplication.java\`.
3. Click the green **Run / Play** icon.

---

### Access URLs:
- **Public Mall Homepage**: http://localhost:8080/ (Opens directly!)
- **Staff / Tenant Sign In**: http://localhost:8080/login
- **H2 SQL Database Console**: http://localhost:8080/h2-console
  *(JDBC URL: \`jdbc:h2:mem:malldb\` | Username: \`sa\` | Password: empty)*

---

### Pre-Seeded Test Credentials:
- **Admin**: \`admin\` / \`admin123\`
- **Officer**: \`officer1\` / \`officer123\` (Floor 2 Supervisor)
- **Tenant (Zara)**: \`tenant1\` / \`tenant123\` (Shop 101)
- **Tenant (Apple)**: \`tenant2\` / \`tenant123\` (Shop 204)
`);

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'shopping-mall-management-springboot3.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      triggerToast('Complete Spring Boot 3 Maven Project (.zip) downloaded successfully!');
    } catch (err) {
      alert('Error generating zip: ' + err);
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-400 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Application Header */}
      <header className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Project Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-white text-lg">NexusMall</span>
                <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/30 uppercase tracking-wider">
                  Spring Boot 3.x
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Shopping Mall Management System &bull; BCA Final-Year Project</p>
            </div>
          </div>

          {/* Primary View Switcher Tabs */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('app')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'app'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Laptop className="w-4 h-4" />
              <span>Live Application</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'code'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Spring Boot Source</span>
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'docs'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Viva &amp; Architecture</span>
            </button>
          </div>

          {/* Download Maven Zip Action & Run Guide */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRunGuideModal(true)}
              className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold px-3 py-2 rounded-lg transition-all active:scale-95 cursor-pointer"
              title="Fix 'Can't be reached' and step-by-step local running instructions"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Run Locally Guide</span>
            </button>
            <button
              onClick={handleDownloadZip}
              disabled={downloadingZip}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-50"
              title="Download entire Maven project with all Java sources, pom.xml, and resources"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{downloadingZip ? 'Packaging...' : 'Export Maven (.zip)'}</span>
            </button>
          </div>

        </div>

        {/* Secondary Sub-Bar for Live App: Role Navigation */}
        {activeTab === 'app' && (
          <div className="bg-slate-900 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 py-2">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-medium text-slate-300">Simulate Role &amp; Route:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setCurrentRole('HOMEPAGE');
                    setBrowserUrl('http://localhost:8080/');
                  }}
                  className={`px-3 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                    currentRole === 'HOMEPAGE'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'bg-slate-800 text-amber-300 hover:bg-slate-700 border border-amber-500/30'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Public Mall Homepage</span>
                </button>
                <div className="h-4 w-px bg-slate-700 mx-0.5 hidden sm:block"></div>
                <button
                  onClick={() => {
                    setCurrentRole('ROLE_ADMIN');
                    setBrowserUrl('http://localhost:8080/admin/dashboard');
                  }}
                  className={`px-3 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                    currentRole === 'ROLE_ADMIN'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  Admin Dashboard (/admin/dashboard)
                </button>
                <button
                  onClick={() => {
                    setCurrentRole('ROLE_OFFICER');
                    setBrowserUrl('http://localhost:8080/officer/dashboard');
                  }}
                  className={`px-3 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                    currentRole === 'ROLE_OFFICER'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  Officer Floor 2 (/officer/dashboard)
                </button>
                <button
                  onClick={() => {
                    setCurrentRole('ROLE_TENANT');
                    setBrowserUrl('http://localhost:8080/tenant/dashboard');
                  }}
                  className={`px-3 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                    currentRole === 'ROLE_TENANT'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Tenant Portal (/tenant/dashboard)
                </button>
                <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block"></div>
                <button
                  onClick={() => {
                    setCurrentRole('LOGIN');
                    setBrowserUrl('http://localhost:8080/login');
                  }}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    currentRole === 'LOGIN' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  /login
                </button>
                <button
                  onClick={() => {
                    setCurrentRole('ERROR');
                    setBrowserUrl('http://localhost:8080/error');
                  }}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    currentRole === 'ERROR' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  /error
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* ========================================================================= */}
        {/* TAB 1: LIVE INTERACTIVE APP SIMULATION (SPRING BOOT + BOOTSTRAP 5 / THYMELEAF) */}
        {/* ========================================================================= */}
        {activeTab === 'app' && (
          <div className="bg-slate-950 text-slate-100 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden">
            
            {/* Simulated Interactive Browser Chrome / URL Bar */}
            <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                
                {/* Browser Controls */}
                <div className="flex items-center gap-1 ml-2 text-slate-400">
                  <button 
                    type="button"
                    onClick={() => {
                      setCurrentRole('HOMEPAGE');
                      setBrowserUrl('http://localhost:8080/');
                      triggerToast('Navigated to: http://localhost:8080/ (Public Mall Homepage)');
                    }}
                    title="Go to Mall Homepage (http://localhost:8080/)"
                    className="p-1 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      triggerToast('Refreshed ' + browserUrl);
                    }}
                    title="Reload"
                    className="p-1 hover:text-white hover:bg-slate-800 rounded transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Interactive Navigable URL Input Bar */}
                <form 
                  onSubmit={handleBrowserUrlNavigate}
                  className="ml-2 font-mono bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-2 text-slate-200 shadow-inner w-64 sm:w-96 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400/30"
                >
                  <Lock className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={browserUrl}
                    onChange={(e) => setBrowserUrl(e.target.value)}
                    placeholder="http://localhost:8080/"
                    className="bg-transparent text-xs text-slate-100 w-full focus:outline-none font-mono tracking-tight"
                  />
                  <button 
                    type="submit" 
                    className="text-[10px] bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 font-bold px-2 py-0.5 rounded transition-colors"
                  >
                    GO
                  </button>
                </form>
              </div>

              {/* Quick Actions in Browser Header */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentRole('HOMEPAGE');
                    setBrowserUrl('http://localhost:8080/');
                    triggerToast('Navigated to: http://localhost:8080/ (Public Mall Homepage)');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    currentRole === 'HOMEPAGE'
                      ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                      : 'bg-slate-800 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Public Mall Site</span>
                </button>

                {currentRole !== 'LOGIN' && (
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentRole('LOGIN');
                      setBrowserUrl('http://localhost:8080/login');
                      triggerToast('Navigated to /login');
                    }}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-2.5 py-1.5 rounded-lg text-xs transition-colors"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Portal Sign In</span>
                  </button>
                )}

                {currentRole !== 'HOMEPAGE' && currentRole !== 'LOGIN' && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-slate-400 hover:text-red-400 font-medium transition-colors text-xs ml-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                )}
              </div>
            </div>

            {/* Inner Content: Homepage or Role Portal */}
            {currentRole === 'HOMEPAGE' ? (
              <MallHomepage 
                onNavigateToLogin={() => {
                  setCurrentRole('LOGIN');
                  setBrowserUrl('http://localhost:8080/login');
                }} 
                onSelectTenantDemo={(u) => {
                  if (u === 'tenant2') setSelectedTenantUser('tenant2');
                  else setSelectedTenantUser('tenant1');
                  setCurrentRole('ROLE_TENANT');
                  setBrowserUrl('http://localhost:8080/tenant/dashboard');
                }}
              />
            ) : (
              <div className="p-4 sm:p-6 lg:p-8 bg-slate-50/70 text-slate-900 min-h-[640px]">
              
              {/* ---------------------------------------------------- */}
              {/* SCENARIO 1: ADMIN DASHBOARD (/admin/dashboard) */}
              {/* ---------------------------------------------------- */}
              {currentRole === 'ROLE_ADMIN' && (
                <div className="space-y-6">
                  
                  {/* Top Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Administration Portal</h1>
                        <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full border border-red-200">
                          ROLE_ADMIN
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">
                        <strong>{mallInfo.name}</strong> &bull; {mallInfo.city} &bull; 
                        <span className="text-slate-500 ml-1 font-medium">{mallInfo.totalFloors} Floors &bull; {mallInfo.totalUnits} Commercial Spaces</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        onClick={() => setShowAddTenantModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Register Tenant</span>
                      </button>
                      <button
                        onClick={() => setShowAssignOfficerModal(true)}
                        className="bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm px-4 py-2 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Assign Officer</span>
                      </button>
                    </div>
                  </div>

                  {/* 4 Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Metric 1 */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600"></div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Commercial Units</p>
                          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{totalShops}</h3>
                          <span className="inline-block mt-2 text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-200">
                            Total Mall Capacity
                          </span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Building2 className="w-6 h-6" />
                        </div>
                      </div>
                    </div>

                    {/* Metric 2 */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500"></div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Occupied Units</p>
                          <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">{occupiedShops}</h3>
                          <span className="inline-block mt-2 text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200">
                            {occupancyRate}% Occupancy Rate
                          </span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <Store className="w-6 h-6" />
                        </div>
                      </div>
                    </div>

                    {/* Metric 3 */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vacant Units</p>
                          <h3 className="text-2xl font-extrabold text-amber-600 mt-1">{vacantUnits}</h3>
                          <span className="inline-block mt-2 text-[11px] font-semibold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md border border-amber-200">
                            Available for Lease
                          </span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                          <Layers className="w-6 h-6" />
                        </div>
                      </div>
                    </div>

                    {/* Metric 4 */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-600"></div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Monthly Revenue</p>
                          <h3 className="text-2xl font-extrabold text-indigo-700 mt-1">
                            ${totalMonthlyRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </h3>
                          <span className="inline-block mt-2 text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-200">
                            Active Contract Value
                          </span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <DollarSign className="w-6 h-6" />
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Main Grid: Tenants Table + Officers Sidebar */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left: Tenant Management Table (2 cols) */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                        <div>
                          <h3 className="font-bold text-slate-900">Tenant Directory &amp; Leases</h3>
                          <p className="text-xs text-slate-500">Search, filter, and modify allocated shop leases</p>
                        </div>

                        {/* Search & Category Filter */}
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                            <input
                              type="text"
                              placeholder="Search store..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 w-36 sm:w-44"
                            />
                          </div>

                          <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="text-xs rounded-lg border border-slate-300 py-1.5 px-2 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">All Categories</option>
                            <option value="Fashion & Apparel">Fashion & Apparel</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Food & Dining">Food & Dining</option>
                            <option value="Jewelry & Watches">Jewelry & Watches</option>
                            <option value="Entertainment">Entertainment</option>
                          </select>
                        </div>
                      </div>

                      {/* Responsive Table */}
                      <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider">
                              <th className="py-3 px-4">Unit #</th>
                              <th className="py-3 px-4">Business Name</th>
                              <th className="py-3 px-4">Category</th>
                              <th className="py-3 px-4">Monthly Rent</th>
                              <th className="py-3 px-4">Lease Window</th>
                              <th className="py-3 px-4">Status</th>
                              <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {filteredTenants.map((t) => (
                              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                                <td className="py-3 px-4 font-mono font-bold text-blue-700">{t.shopNumber}</td>
                                <td className="py-3 px-4">
                                  <div className="font-semibold text-slate-900">{t.businessName}</div>
                                  <div className="text-[11px] text-slate-500">{t.fullName} &bull; {t.email}</div>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                                    {t.category}
                                  </span>
                                </td>
                                <td className="py-3 px-4 font-bold text-slate-800">
                                  ${t.monthlyRent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="py-3 px-4 text-slate-500 text-[11px]">
                                  {t.leaseStart} <br />to {t.leaseEnd}
                                </td>
                                <td className="py-3 px-4">
                                  {t.status === 'ACTIVE' && (
                                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold px-2 py-0.5 rounded-full text-[10px]">
                                      ACTIVE
                                    </span>
                                  )}
                                  {t.status === 'INACTIVE' && (
                                    <span className="bg-rose-50 text-rose-700 border border-rose-200 font-semibold px-2 py-0.5 rounded-full text-[10px]">
                                      INACTIVE
                                    </span>
                                  )}
                                  {t.status === 'TERMINATED' && (
                                    <span className="bg-slate-100 text-slate-600 border border-slate-300 font-semibold px-2 py-0.5 rounded-full text-[10px]">
                                      TERMINATED
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="inline-flex items-center gap-1.5">
                                    <button
                                      onClick={() => {
                                        setEditingTenant({ ...t });
                                        setShowEditTenantModal(true);
                                      }}
                                      className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                      title="Edit Tenant"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteTenant(t.id)}
                                      className="p-1 rounded text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                                      title="Delete Tenant"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {filteredTenants.length === 0 && (
                              <tr>
                                <td colSpan={7} className="py-8 text-center text-slate-400">
                                  No tenants match the search filter.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Right: Officers & Recent Bills (1 col) */}
                    <div className="space-y-6">
                      
                      {/* Officers Panel */}
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-blue-600" />
                            <span>Floor Supervisory Officers</span>
                          </h4>
                          <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold border border-blue-200">
                            {officers.length} Assigned
                          </span>
                        </div>

                        <div className="space-y-3">
                          {officers.map(o => (
                            <div key={o.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900">{o.fullName}</span>
                                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                  Floor {o.assignedFloor}
                                </span>
                              </div>
                              <p className="text-slate-600 mt-1">{o.department}</p>
                              <div className="flex items-center gap-2 text-slate-500 text-[11px] mt-1">
                                <Phone className="w-3 h-3 text-slate-400" />
                                <span>{o.phone}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recent Bills Ledger */}
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <Receipt className="w-4 h-4 text-emerald-600" />
                            <span>Recent Mall Invoices</span>
                          </h4>
                          <span className="text-[11px] text-slate-500">Live Status</span>
                        </div>

                        <div className="space-y-2 text-xs">
                          {bills.slice(0, 4).map(b => (
                            <div key={b.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200">
                              <div>
                                <span className="font-semibold text-slate-900 block">{b.businessName}</span>
                                <span className="text-[11px] text-slate-500">{b.billingMonth}</span>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-slate-900 block">${b.amountDue.toLocaleString()}</span>
                                {b.status === 'PAID' && (
                                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                    PAID
                                  </span>
                                )}
                                {b.status === 'PENDING' && (
                                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                    PENDING
                                  </span>
                                )}
                                {b.status === 'OVERDUE' && (
                                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                                    OVERDUE
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* SCENARIO 2: OFFICER DASHBOARD (/officer/dashboard) */}
              {/* ---------------------------------------------------- */}
              {currentRole === 'ROLE_OFFICER' && (
                <div className="space-y-6">
                  
                  {/* Officer Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-slate-900">Floor Supervisory Portal</h1>
                        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-300">
                          ROLE_OFFICER
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">
                        Assigned Officer: <strong className="text-slate-900">{activeOfficer.fullName}</strong> &bull; 
                        Department: <span className="text-slate-700 font-medium">{activeOfficer.department}</span> &bull; 
                        Direct Phone: <span className="text-slate-700">{activeOfficer.phone}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow-sm text-center">
                        <span className="text-[10px] uppercase font-bold text-blue-200 block">Current Jurisdiction</span>
                        <span className="text-lg font-black tracking-tight">FLOOR {activeOfficer.assignedFloor}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Active Stores on Floor 2 */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">Active Stores &amp; Outlets on Floor {activeOfficer.assignedFloor}</h3>
                          <p className="text-xs text-slate-500">Commercial spaces subject to mandatory floor safety and fire compliance</p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">
                          {floorTenants.length} Unit Located
                        </span>
                      </div>

                      <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-slate-100 text-slate-600 uppercase font-bold border-b border-slate-200">
                              <th className="py-3 px-4">Unit #</th>
                              <th className="py-3 px-4">Business Name</th>
                              <th className="py-3 px-4">Category</th>
                              <th className="py-3 px-4">Store Manager</th>
                              <th className="py-3 px-4">Fire Compliance</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {floorTenants.map(t => (
                              <tr key={t.id} className="hover:bg-slate-50">
                                <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{t.shopNumber}</td>
                                <td className="py-3.5 px-4">
                                  <span className="font-bold text-slate-900 block">{t.businessName}</span>
                                  <span className="text-[11px] text-slate-500">{t.email}</span>
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">{t.category}</span>
                                </td>
                                <td className="py-3.5 px-4 text-slate-700 font-medium">{t.fullName}</td>
                                <td className="py-3.5 px-4">
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    PASSED
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Floor Safety Protocol Checklist */}
                    <div className="space-y-6">
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                        <h4 className="font-bold text-slate-900 text-sm mb-1">Daily Floor Inspection Checklist</h4>
                        <p className="text-xs text-slate-500 mb-3">Floor {activeOfficer.assignedFloor} standard compliance walk</p>

                        <div className="space-y-3 text-xs">
                          <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={checkpoints.corridors}
                              onChange={(e) => setCheckpoints({ ...checkpoints, corridors: e.target.checked })}
                              className="mt-0.5 rounded text-blue-600"
                            />
                            <div>
                              <span className="font-semibold text-slate-900 block">Emergency Corridor Clearances</span>
                              <span className="text-slate-500 text-[11px]">Stairwell B &amp; C doors unobstructed</span>
                            </div>
                          </label>

                          <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={checkpoints.extinguishers}
                              onChange={(e) => setCheckpoints({ ...checkpoints, extinguishers: e.target.checked })}
                              className="mt-0.5 rounded text-blue-600"
                            />
                            <div>
                              <span className="font-semibold text-slate-900 block">Fire Extinguisher Gauges</span>
                              <span className="text-slate-500 text-[11px]">CO2 pressure in certified green band</span>
                            </div>
                          </label>

                          <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={checkpoints.escalators}
                              onChange={(e) => setCheckpoints({ ...checkpoints, escalators: e.target.checked })}
                              className="mt-0.5 rounded text-blue-600"
                            />
                            <div>
                              <span className="font-semibold text-slate-900 block">Escalator &amp; Lift Diagnostics</span>
                              <span className="text-slate-500 text-[11px]">Sensors and emergency kill switches normal</span>
                            </div>
                          </label>

                          <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={checkpoints.lockdown}
                              onChange={(e) => setCheckpoints({ ...checkpoints, lockdown: e.target.checked })}
                              className="mt-0.5 rounded text-blue-600"
                            />
                            <div>
                              <span className="font-semibold text-slate-900 block">Evening Mall Lock-Down Verified</span>
                              <span className="text-slate-500 text-[11px]">Post-10:00 PM store shutter verification</span>
                            </div>
                          </label>
                        </div>

                        <button
                          onClick={() => {
                            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            setInspectionLogs(prev => [`${time} - Manual Safety Check Logged by Officer ${activeOfficer.fullName}`, ...prev]);
                            triggerToast(`Floor ${activeOfficer.assignedFloor} safety inspection checkpoint registered!`);
                          }}
                          className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-3 rounded-lg text-xs transition-colors"
                        >
                          Log Checkpoint Walk
                        </button>
                      </div>

                      {/* Recent Floor Walk Logs */}
                      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs">
                        <span className="font-bold text-slate-700 block mb-2">Recent Floor Inspection Log</span>
                        <div className="space-y-1.5 text-slate-600 text-[11px]">
                          {inspectionLogs.map((log, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1 flex-shrink-0"></span>
                              <span>{log}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* SCENARIO 3: TENANT PORTAL (/tenant/dashboard) */}
              {/* ---------------------------------------------------- */}
              {currentRole === 'ROLE_TENANT' && (
                <div className="space-y-6">
                  
                  {/* Tenant Switcher & Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-slate-900">{activeTenant?.businessName}</h1>
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                          ROLE_TENANT
                        </span>
                        <span className="font-mono bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-0.5 rounded border border-slate-300">
                          {activeTenant?.shopNumber}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">
                        Store Manager: <strong className="text-slate-900">{activeTenant?.fullName}</strong> &bull; 
                        Email: <span className="text-slate-700">{activeTenant?.email}</span> &bull; 
                        Category: <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">{activeTenant?.category}</span>
                      </p>
                    </div>

                    {/* Switch which tenant we are viewing */}
                    <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-lg border border-slate-200 text-xs">
                      <span className="text-slate-500 font-medium">Switch Tenant:</span>
                      <button
                        onClick={() => setSelectedTenantUser('tenant1')}
                        className={`px-2.5 py-1 rounded font-semibold ${selectedTenantUser === 'tenant1' ? 'bg-white shadow text-blue-700' : 'text-slate-600'}`}
                      >
                        Zara (Shop 101)
                      </button>
                      <button
                        onClick={() => setSelectedTenantUser('tenant2')}
                        className={`px-2.5 py-1 rounded font-semibold ${selectedTenantUser === 'tenant2' ? 'bg-white shadow text-blue-700' : 'text-slate-600'}`}
                      >
                        Apple (Shop 204)
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Commercial Lease Agreement Card */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <span>Commercial Lease</span>
                        </h3>
                        <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                          {activeTenant?.status}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs text-slate-500 font-semibold block uppercase">Contract Monthly Rental</span>
                        <div className="text-3xl font-extrabold text-blue-700 mt-1">
                          ${activeTenant?.monthlyRent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          <span className="text-xs text-slate-500 font-normal ml-1">/ month</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                          <span className="text-slate-500 block text-[11px]">Lease Start</span>
                          <span className="font-bold text-slate-800">{activeTenant?.leaseStart}</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                          <span className="text-slate-500 block text-[11px]">Lease Expiration</span>
                          <span className="font-bold text-slate-800">{activeTenant?.leaseEnd}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200 text-xs text-blue-800">
                        <strong>Lease Policy Notice:</strong> Monthly rent is generated on the 1st day of each month. Late fees apply after the 15th.
                      </div>
                    </div>

                    {/* Billing Ledger & Interactive "Pay Rent" (2 cols) */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">Monthly Invoices &amp; Online Payment</h3>
                          <p className="text-xs text-slate-500">Pay pending invoices directly to update your lease status in real-time</p>
                        </div>
                        <span className="text-xs text-slate-600 font-mono bg-white px-2.5 py-1 rounded border border-slate-200">
                          Ledger ID: #TN-{activeTenant?.id}
                        </span>
                      </div>

                      <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-slate-100 text-slate-600 uppercase font-bold border-b border-slate-200">
                              <th className="py-3 px-4">Invoice #</th>
                              <th className="py-3 px-4">Billing Month</th>
                              <th className="py-3 px-4">Amount Due</th>
                              <th className="py-3 px-4">Status</th>
                              <th className="py-3 px-4">Payment Date</th>
                              <th className="py-3 px-4 text-right">Interactive Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {activeTenantBills.map(bill => (
                              <tr key={bill.id} className="hover:bg-slate-50">
                                <td className="py-3.5 px-4 font-mono text-slate-600">INV-00{bill.id}</td>
                                <td className="py-3.5 px-4 font-bold text-slate-900">{bill.billingMonth}</td>
                                <td className="py-3.5 px-4 font-bold text-slate-800">
                                  ${bill.amountDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="py-3.5 px-4">
                                  {bill.status === 'PAID' && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      PAID
                                    </span>
                                  )}
                                  {bill.status === 'PENDING' && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                      <AlertCircle className="w-3 h-3 text-amber-600" />
                                      PENDING
                                    </span>
                                  )}
                                  {bill.status === 'OVERDUE' && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                      <AlertCircle className="w-3 h-3 text-rose-600" />
                                      OVERDUE
                                    </span>
                                  )}
                                </td>
                                <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                                  {bill.paymentDate || '—'}
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                  {bill.status !== 'PAID' ? (
                                    <button
                                      onClick={() => handlePayRent(bill.id)}
                                      className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm text-xs transition-colors"
                                    >
                                      <CreditCard className="w-3.5 h-3.5" />
                                      <span>Pay Rent</span>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => setReceiptBill(bill)}
                                      className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1 rounded text-xs border border-slate-300 transition-colors"
                                    >
                                      <Receipt className="w-3.5 h-3.5 text-slate-500" />
                                      <span>Receipt</span>
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* SCENARIO 4: LOGIN VIEW (/login) */}
              {/* ---------------------------------------------------- */}
              {currentRole === 'LOGIN' && (
                <div className="max-w-md mx-auto py-8">
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
                    
                    {/* Top Return to Homepage Banner Button */}
                    <div className="mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentRole('HOMEPAGE');
                          setBrowserUrl('http://localhost:8080/');
                          triggerToast('Navigated to: http://localhost:8080/ (Public Mall Homepage)');
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                      >
                        <Building2 className="w-3.5 h-3.5 text-amber-600" />
                        <span>&larr; Public Mall Homepage</span>
                      </button>
                      <span className="text-[11px] font-mono text-slate-400">http://localhost:8080/</span>
                    </div>

                    <div className="text-center mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
                        <Lock className="w-7 h-7" />
                      </div>
                      <h2 className="text-xl font-bold text-slate-900">Mall Portal Login</h2>
                      <p className="text-xs text-slate-500 mt-1">Spring Security 6 Form-Based Authentication</p>
                    </div>

                    {/* Logout Notice Banner */}
                    {logoutNotice && (
                      <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span>You have been safely signed out.</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setLogoutNotice(false)}
                          className="text-emerald-600 hover:text-emerald-900 font-bold ml-2 text-sm leading-none"
                        >
                          &times;
                        </button>
                      </div>
                    )}

                    {/* Invalid Credentials Error Banner */}
                    {loginError && (
                      <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
                        <div className="flex items-center gap-2 mb-1 font-semibold text-rose-900">
                          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                          <span>{loginError}</span>
                        </div>
                        <p className="text-[11px] text-rose-700 pl-6 leading-relaxed">
                          Please verify your credentials or click any quick-fill button below to sign in instantly.
                        </p>
                      </div>
                    )}

                    <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Username</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={loginUsername}
                            onChange={(e) => {
                              setLoginUsername(e.target.value);
                              if (loginError) setLoginError(null);
                            }}
                            placeholder="e.g. admin or officer1 or tenant1"
                            className="w-full px-3 py-2 pl-9 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                            required
                          />
                          <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        </div>
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Password</label>
                        <div className="relative">
                          <input
                            type="password"
                            value={loginPassword}
                            onChange={(e) => {
                              setLoginPassword(e.target.value);
                              if (loginError) setLoginError(null);
                            }}
                            placeholder="Enter password (e.g. admin123)"
                            className="w-full px-3 py-2 pl-9 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-mono"
                            required
                          />
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Sign In to Portal</span>
                      </button>
                    </form>

                    {/* Quick evaluation fills */}
                    <div className="mt-6 pt-5 border-t border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Evaluation Test Logins:</p>
                        <span className="text-[10px] text-blue-600 font-medium">Click to fill &amp; sign in</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => handleQuickLogin('admin', 'admin123', 'ROLE_ADMIN')}
                          className="text-left p-2.5 rounded-lg bg-slate-50 hover:bg-red-50 hover:border-red-300 border border-slate-200 transition-all group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-red-600 group-hover:text-red-700">admin</span>
                            <span className="text-[9px] bg-red-100 text-red-700 font-bold px-1.5 py-0.2 rounded">ADMIN</span>
                          </div>
                          <span className="text-[11px] text-slate-500 block mt-0.5 font-mono">admin123</span>
                          <span className="text-[10px] text-slate-400 block">Full Management</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickLogin('officer1', 'officer123', 'ROLE_OFFICER')}
                          className="text-left p-2.5 rounded-lg bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 transition-all group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-amber-600 group-hover:text-amber-700">officer1</span>
                            <span className="text-[9px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.2 rounded">OFFICER</span>
                          </div>
                          <span className="text-[11px] text-slate-500 block mt-0.5 font-mono">officer123</span>
                          <span className="text-[10px] text-slate-400 block">Floor 2 Inspection</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickLogin('tenant1', 'tenant123', 'ROLE_TENANT', 'tenant1')}
                          className="text-left p-2.5 rounded-lg bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 transition-all group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-emerald-600 group-hover:text-emerald-700">tenant1</span>
                            <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.2 rounded">TENANT</span>
                          </div>
                          <span className="text-[11px] text-slate-500 block mt-0.5 font-mono">tenant123</span>
                          <span className="text-[10px] text-slate-400 block">Shop 101 (Zara)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickLogin('tenant2', 'tenant123', 'ROLE_TENANT', 'tenant2')}
                          className="text-left p-2.5 rounded-lg bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 transition-all group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-emerald-600 group-hover:text-emerald-700">tenant2</span>
                            <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.2 rounded">TENANT</span>
                          </div>
                          <span className="text-[11px] text-slate-500 block mt-0.5 font-mono">tenant123</span>
                          <span className="text-[10px] text-slate-400 block">Shop 204 (Apple)</span>
                        </button>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentRole('HOMEPAGE');
                            setBrowserUrl('http://localhost:8080/');
                            triggerToast('Navigated to: http://localhost:8080/ (Public Mall Homepage)');
                          }}
                          className="text-xs text-amber-700 hover:text-amber-900 font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Building2 className="w-3.5 h-3.5 text-amber-600" />
                          <span>&larr; Return to Public Mall Homepage</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* SCENARIO 5: ERROR VIEW (/error) */}
              {/* ---------------------------------------------------- */}
              {currentRole === 'ERROR' && (
                <div className="max-w-md mx-auto py-12 text-center">
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
                    <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Notice / Operational Exception</h2>
                    <p className="text-xs text-slate-600 mt-2">
                      Handled cleanly via global <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono">@ControllerAdvice</code> and Spring Boot 3 custom error view, completely shielding raw 500 error stack traces.
                    </p>
                    <div className="my-4">
                      <span className="bg-rose-50 text-rose-700 text-xs font-semibold px-3 py-1 rounded-full border border-rose-200">
                        HTTP Status: 500 Handled Safely
                      </span>
                    </div>
                    <button
                      onClick={() => setCurrentRole('ROLE_ADMIN')}
                      className="bg-blue-600 text-white font-semibold text-xs px-4 py-2 rounded-lg"
                    >
                      Return to Admin Dashboard
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      )}

        {/* ========================================================================= */}
        {/* TAB 2: SPRING BOOT SOURCE CODE EXPLORER */}
        {/* ========================================================================= */}
        {activeTab === 'code' && (
          <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col md:flex-row h-[720px]">
            
            {/* Sidebar File Tree */}
            <div className="w-full md:w-80 bg-slate-900 border-r border-slate-800 flex flex-col overflow-hidden">
              <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-blue-400" />
                  <span>Project File Catalog</span>
                </span>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  {PROJECT_FILES.length} Files
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs">
                {PROJECT_FILES.map((file, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-3 py-2 rounded-lg flex flex-col transition-all ${
                      selectedFile.path === file.path
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-medium truncate">{file.name}</span>
                      <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-semibold ${
                        selectedFile.path === file.path ? 'bg-blue-800 text-blue-100' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {file.language}
                      </span>
                    </div>
                    <span className={`text-[10px] truncate mt-0.5 ${
                      selectedFile.path === file.path ? 'text-blue-100' : 'text-slate-500'
                    }`}>
                      {file.path}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Code Viewer Panel */}
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
              
              {/* File Info Header */}
              <div className="p-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-blue-400">{selectedFile.path}</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">{selectedFile.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg font-medium transition-all text-xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
              </div>

              {/* Code Preformatted Block */}
              <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-slate-300">
                <pre className="whitespace-pre">{selectedFile.content}</pre>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ACADEMIC PROJECT REPORT & VIVA GUIDE */}
        {/* ========================================================================= */}
        {activeTab === 'docs' && (
          <div className="space-y-6">
            
            {/* Project Overview Card */}
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Academic Project Documentation (BCA Final-Year Standard)</h2>
                  <p className="text-xs text-slate-400">Shopping Mall Management System &bull; Architecture, Database Normalization &amp; Viva Voce Guide</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-700 text-xs">
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
                  <h4 className="font-bold text-blue-400 mb-1">Architecture Pattern</h4>
                  <p className="text-slate-300">Strict Layered MVC: Controller &rarr; Service &rarr; Repository (Spring Data JPA) &rarr; MySQL/H2 Database.</p>
                </div>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
                  <h4 className="font-bold text-emerald-400 mb-1">Security &amp; Encryption</h4>
                  <p className="text-slate-300">Spring Security 6 with Form-based Auth, BCrypt password hashing (strength 10), and custom Role Success Handlers.</p>
                </div>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
                  <h4 className="font-bold text-amber-400 mb-1">Database Schema</h4>
                  <p className="text-slate-300">Normalized 3NF schema covering Users, Mall Properties, Officers, Commercial Tenants, and Billing Ledgers with ON DELETE CASCADE.</p>
                </div>
              </div>
            </div>

            {/* How to Run Locally */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <Laptop className="w-5 h-5 text-blue-400" />
                <span>How to Run Locally on Your Machine</span>
              </h3>
              <div className="space-y-3 text-xs text-slate-300 font-mono">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500"># Step 1: Click the top-right button "Export Maven (.zip)" and unzip the project</span>
                  <div className="text-blue-400 mt-1">unzip shopping-mall-management-springboot3.zip</div>
                  <div className="text-blue-400">cd shopping-mall-management</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500"># Step 2: Run with Maven (Java 17+ required)</span>
                  <div className="text-emerald-400 mt-1">mvn clean spring-boot:run</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500"># Step 3: Open in browser (H2 In-Memory boots automatically without MySQL setup)</span>
                  <div className="text-amber-400 mt-1">Application URL: http://localhost:8080</div>
                  <div className="text-amber-400">H2 Database Console: http://localhost:8080/h2-console</div>
                </div>
              </div>
            </div>

            {/* Viva Voce Questions & Answers */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-400" />
                <span>Top BCA Final-Year Viva Voce Questions &amp; Answers</span>
              </h3>

              <div className="space-y-4 text-xs">
                
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <div className="font-bold text-blue-400">Q1: Why did you use Spring Boot 3 instead of traditional Spring MVC?</div>
                  <p className="text-slate-300 mt-1">
                    Spring Boot eliminates complex XML configuration through opinionated auto-configuration, provides embedded Tomcat, and bundles starters for JPA, Security, and Thymeleaf with Java 17 baseline support.
                  </p>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <div className="font-bold text-blue-400">Q2: How does the role-based redirection work after login?</div>
                  <p className="text-slate-300 mt-1">
                    We implemented a custom <code className="text-amber-300 font-mono">AuthenticationSuccessHandler</code> in <code className="text-amber-300 font-mono">CustomAuthSuccessHandler.java</code> that inspects the user's granted authorities. If the user has <code className="text-amber-300 font-mono">ROLE_ADMIN</code>, they are redirected to <code className="text-amber-300 font-mono">/admin/dashboard</code>; if <code className="text-amber-300 font-mono">ROLE_OFFICER</code>, to <code className="text-amber-300 font-mono">/officer/dashboard</code>; and if <code className="text-amber-300 font-mono">ROLE_TENANT</code>, to <code className="text-amber-300 font-mono">/tenant/dashboard</code>.
                  </p>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <div className="font-bold text-blue-400">Q3: How does the application handle database portability between H2 and MySQL?</div>
                  <p className="text-slate-300 mt-1">
                    In <code className="text-amber-300 font-mono">application.properties</code>, we configured an in-memory H2 database with <code className="text-amber-300 font-mono">MODE=MySQL</code> as the default fallback so that examiners can run the app without setting up local MySQL. For production, MySQL 8.x connection strings are pre-configured.
                  </p>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <div className="font-bold text-blue-400">Q4: Why is BCrypt used for password encryption?</div>
                  <p className="text-slate-300 mt-1">
                    BCrypt incorporates salt to protect against rainbow table attacks and is computationally adaptive (work factor 10), preventing brute-force dictionary attacks even if the database table is compromised.
                  </p>
                </div>

              </div>
            </div>

          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODAL: REGISTER NEW TENANT */}
      {/* ========================================================================= */}
      {showAddTenantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 text-slate-900 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Store className="w-5 h-5 text-blue-600" />
                <span>Register New Commercial Tenant</span>
              </h3>
              <button onClick={() => setShowAddTenantModal(false)} className="text-slate-400 hover:text-slate-700 text-lg">&times;</button>
            </div>

            <form onSubmit={handleAddTenant} className="space-y-3 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Username (Login ID)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. nike_store"
                    value={newTenantForm.username}
                    onChange={(e) => setNewTenantForm({ ...newTenantForm, username: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={newTenantForm.password}
                    onChange={(e) => setNewTenantForm({ ...newTenantForm, password: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Store Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Connor"
                    value={newTenantForm.fullName}
                    onChange={(e) => setNewTenantForm({ ...newTenantForm, fullName: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Contact Email</label>
                  <input
                    type="email"
                    placeholder="contact@brand.com"
                    value={newTenantForm.email}
                    onChange={(e) => setNewTenantForm({ ...newTenantForm, email: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Shop / Unit Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shop 301"
                    value={newTenantForm.shopNumber}
                    onChange={(e) => setNewTenantForm({ ...newTenantForm, shopNumber: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Business Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nike Flagship"
                    value={newTenantForm.businessName}
                    onChange={(e) => setNewTenantForm({ ...newTenantForm, businessName: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newTenantForm.category}
                    onChange={(e) => setNewTenantForm({ ...newTenantForm, category: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="Fashion & Apparel">Fashion & Apparel</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Jewelry & Watches">Jewelry & Watches</option>
                    <option value="Entertainment">Entertainment</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Monthly Rent ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 9500"
                    value={newTenantForm.monthlyRent}
                    onChange={(e) => setNewTenantForm({ ...newTenantForm, monthlyRent: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Lease Start</label>
                  <input
                    type="date"
                    required
                    value={newTenantForm.leaseStart}
                    onChange={(e) => setNewTenantForm({ ...newTenantForm, leaseStart: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Lease End</label>
                  <input
                    type="date"
                    required
                    value={newTenantForm.leaseEnd}
                    onChange={(e) => setNewTenantForm({ ...newTenantForm, leaseEnd: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddTenantModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Save Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT TENANT */}
      {/* ========================================================================= */}
      {showEditTenantModal && editingTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-slate-900 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">Edit Tenant: {editingTenant.shopNumber}</h3>
              <button onClick={() => setShowEditTenantModal(false)} className="text-slate-400 hover:text-slate-700">&times;</button>
            </div>

            <form onSubmit={handleSaveEditTenant} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Business Name</label>
                <input
                  type="text"
                  required
                  value={editingTenant.businessName}
                  onChange={(e) => setEditingTenant({ ...editingTenant, businessName: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={editingTenant.category}
                  onChange={(e) => setEditingTenant({ ...editingTenant, category: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="Fashion & Apparel">Fashion & Apparel</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Jewelry & Watches">Jewelry & Watches</option>
                  <option value="Entertainment">Entertainment</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Monthly Rent ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editingTenant.monthlyRent}
                  onChange={(e) => setEditingTenant({ ...editingTenant, monthlyRent: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Lease Status</label>
                <select
                  value={editingTenant.status}
                  onChange={(e) => setEditingTenant({ ...editingTenant, status: e.target.value as any })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="TERMINATED">TERMINATED</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowEditTenantModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Update Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ASSIGN OFFICER */}
      {/* ========================================================================= */}
      {showAssignOfficerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-slate-900 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">Assign Supervisory Officer</h3>
              <button onClick={() => setShowAssignOfficerModal(false)} className="text-slate-400 hover:text-slate-700">&times;</button>
            </div>

            <form onSubmit={handleAssignOfficer} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Officer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={officerForm.fullName}
                  onChange={(e) => setOfficerForm({ ...officerForm, fullName: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="officer@nexusmall.com"
                  value={officerForm.email}
                  onChange={(e) => setOfficerForm({ ...officerForm, email: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={officerForm.department}
                    onChange={(e) => setOfficerForm({ ...officerForm, department: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Assigned Floor</label>
                  <select
                    value={officerForm.assignedFloor}
                    onChange={(e) => setOfficerForm({ ...officerForm, assignedFloor: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="1">Floor 1 (Ground)</option>
                    <option value="2">Floor 2 (Tech & Apparel)</option>
                    <option value="3">Floor 3 (Food Court)</option>
                    <option value="4">Floor 4 (Entertainment)</option>
                    <option value="5">Floor 5 (Executive)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Emergency Phone</label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={officerForm.phone}
                  onChange={(e) => setOfficerForm({ ...officerForm, phone: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAssignOfficerModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold"
                >
                  Assign Officer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: VIEW PAYMENT RECEIPT */}
      {/* ========================================================================= */}
      {receiptBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-slate-900 shadow-2xl border border-slate-200">
            <div className="text-center pb-4 border-b border-dashed border-slate-300">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-slate-900">Official Payment Receipt</h4>
              <p className="text-[11px] text-slate-500">Nexus Grand Galleria Mall Financial Administration</p>
            </div>

            <div className="py-4 space-y-2 text-xs border-b border-dashed border-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice Number:</span>
                <span className="font-mono font-bold text-slate-900">INV-00{receiptBill.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Commercial Tenant:</span>
                <span className="font-semibold text-slate-900">{receiptBill.businessName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Shop Allocation:</span>
                <span className="font-mono text-slate-800">{receiptBill.shopNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Billing Period:</span>
                <span className="text-slate-800">{receiptBill.billingMonth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Settled:</span>
                <span className="text-slate-800 font-mono">{receiptBill.paymentDate || 'Settled'}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100 text-sm font-bold">
                <span className="text-slate-900">Amount Paid:</span>
                <span className="text-emerald-600">${receiptBill.amountDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setReceiptBill(null)}
                className="w-full bg-slate-900 text-white font-bold py-2 rounded-lg text-xs"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: RUN LOCALLY & TROUBLESHOOTING GUIDE */}
      {/* ---------------------------------------------------- */}
      {showRunGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-900/60 to-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">How to Run Locally &amp; Fix "Can't be Reached"</h3>
                  <p className="text-xs text-amber-200/80">Everything you need to run Spring Boot 3 on your local PC</p>
                </div>
              </div>
              <button
                onClick={() => setShowRunGuideModal(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5 text-xs text-slate-300">
              
              {/* Question: Why does "Can't be reached" appear? */}
              <div className="bg-amber-950/40 border border-amber-800/60 p-4 rounded-xl">
                <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  Why does browser show "This site can’t be reached" / Connection Refused?
                </h4>
                <p className="leading-relaxed text-amber-100/90">
                  This happens when your browser looks for a web server on <strong>localhost:8080</strong>, but the Spring Boot Java process is <strong>not currently running in a terminal on your computer</strong> (or it stopped because Java/Maven wasn't found).
                </p>
              </div>

              {/* 3 Steps to Run */}
              <div>
                <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  3 Easy Ways to Run It:
                </h4>

                <div className="space-y-3">
                  {/* Way 1: run.bat */}
                  <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-xl">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px]">1</span>
                        Windows 1-Click: run.bat (Easiest)
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">Recommended</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-1 text-slate-300">
                      <li>Click the green <strong>"Export Maven (.zip)"</strong> button in the top bar.</li>
                      <li>Extract the zip to a folder on your PC (e.g. <code className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-300 font-mono">C:\SMMS</code>).</li>
                      <li>Double-click <strong>run.bat</strong>. It automatically checks Java, downloads portable Maven if needed, boots Spring Boot, and launches the Public Mall Homepage!</li>
                    </ol>
                  </div>

                  {/* Way 2: IntelliJ IDEA */}
                  <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-xl">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-blue-400 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[10px]">2</span>
                        IntelliJ IDEA / Eclipse (Best for Project Presentation)
                      </span>
                      <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono">IDE</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-1 text-slate-300">
                      <li>Open IntelliJ IDEA &rarr; <strong>File</strong> &rarr; <strong>Open...</strong> &rarr; Select extracted folder.</li>
                      <li>Open <code className="bg-slate-900 px-1.5 py-0.5 rounded text-blue-300 font-mono">src/main/java/com/mall/ShoppingMallApplication.java</code>.</li>
                      <li>Click the green <strong>Run / Play</strong> button. Once console says "Started ShoppingMallApplication", open <a href="http://localhost:8080" target="_blank" rel="noreferrer" className="text-amber-400 underline font-mono">http://localhost:8080</a>.</li>
                    </ol>
                  </div>

                  {/* Way 3: Terminal */}
                  <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-xl">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-purple-400 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px]">3</span>
                        Command Line (Terminal / CMD)
                      </span>
                      <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono">CLI</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-200">
                      mvn clean spring-boot:run
                    </div>
                  </div>
                </div>
              </div>

              {/* Troubleshooting Checklist */}
              <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl space-y-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">
                  Quick Troubleshooting Checklist:
                </h4>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span><strong>Do you have Java JDK 17+?</strong> Open Command Prompt and type <code className="text-amber-300 font-mono">java -version</code>. If not recognized, install free JDK 17 from <a href="https://adoptium.net/" target="_blank" rel="noreferrer" className="text-blue-400 underline">adoptium.net</a>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span><strong>Do not close the command window:</strong> The black terminal window must stay open in the background while browsing the website!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span><strong>Port 8080 busy?</strong> If another program is using port 8080, open <code className="text-amber-300 font-mono">application.properties</code> and change to <code className="text-amber-300 font-mono">server.port=8081</code>, then open <code className="text-amber-300 font-mono">http://localhost:8081</code>.</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Footer Buttons */}
            <div className="bg-slate-950 px-6 py-3.5 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  setShowRunGuideModal(false);
                  handleDownloadZip();
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Fresh ZIP Package</span>
              </button>
              <button
                onClick={() => setShowRunGuideModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Got It, Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* App Footer */}
      <footer className="mt-auto border-t border-slate-800 py-6 bg-slate-950 text-slate-500 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="mb-1 text-slate-400">
            &copy; 2026 <strong>Nexus Grand Galleria Mall</strong> Management System &bull; BCA Final-Year Project
          </p>
          <p className="text-[11px] text-slate-500">
            Engineered with Spring Boot 3.2.5, Spring Security 6, Spring Data JPA, Hibernate, MySQL 8 / H2 &amp; Thymeleaf
          </p>
        </div>
      </footer>

    </div>
  );
}
