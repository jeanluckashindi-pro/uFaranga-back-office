import { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import {
  TrendingUp, DollarSign, Activity,
  Users, ArrowUpRight, ArrowDownRight,
  ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight, CreditCard,
  Clock, CheckCircle, XCircle, RefreshCw, Wallet, Briefcase,
  BarChart3, Target, Calendar, TrendingDown, ChevronLeft, ChevronRight,
  Receipt, PieChart as PieChartIcon, AlertCircle
} from 'lucide-react';

function AgentDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const transactionsPerPage = 3;

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Simuler le chargement des données
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLoading(false);
    };
    loadData();
  }, []);

  // KPIs - Données temps réel simulées
  const [kpis] = useState({
    floatBalance: 2500000,
    floatMax: 5000000,
    floatMin: 1000000,
    cashBalance: 1800000,
    depositsToday: 856000,
    withdrawalsToday: 623000,
    transfersToday: 295000,
    paymentsToday: 187000,
    commissionsToday: 45600,
    commissionsYesterday: 42200,
    commissionsMonth: 1234500,
    transactionsToday: 47,
    transactionsSuccess: 45,
    transactionsFailed: 2,
    avgTransactionTime: 45,
    peakHour: '14:00',
    clientsServed: 38
  });

  // Données pour graphique activité par heure (aujourd'hui)
  const activityByHour = [
    { heure: '08h', transactions: 2, volume: 85000 },
    { heure: '09h', transactions: 5, volume: 210000 },
    { heure: '10h', transactions: 8, volume: 340000 },
    { heure: '11h', transactions: 6, volume: 280000 },
    { heure: '12h', transactions: 4, volume: 150000 },
    { heure: '13h', transactions: 7, volume: 320000 },
    { heure: '14h', transactions: 9, volume: 450000 },
    { heure: '15h', transactions: 6, volume: 290000 },
    { heure: 'Maintenant', transactions: 0, volume: 0 }
  ];

  // Données pour graphique en barres - Transactions par type (semaine)
  const transactionsByType = [
    { name: 'Lun', depots: 450000, retraits: 320000, transferts: 180000 },
    { name: 'Mar', depots: 520000, retraits: 380000, transferts: 210000 },
    { name: 'Mer', depots: 480000, retraits: 350000, transferts: 190000 },
    { name: 'Jeu', depots: 610000, retraits: 420000, transferts: 240000 },
    { name: 'Ven', depots: 720000, retraits: 510000, transferts: 280000 },
    { name: 'Sam', depots: 890000, retraits: 640000, transferts: 320000 },
    { name: 'Dim', depots: 856000, retraits: 623000, transferts: 295000 }
  ];

  // Données pour graphique en ligne - Évolution des commissions
  const commissionsData = [
    { jour: 'J-6', commissions: 38000 },
    { jour: 'J-5', commissions: 42000 },
    { jour: 'J-4', commissions: 39500 },
    { jour: 'J-3', commissions: 47000 },
    { jour: 'J-2', commissions: 51000 },
    { jour: 'J-1', commissions: 58000 },
    { jour: "Auj", commissions: 45600 }
  ];

  // Données pour graphique en camembert - Répartition des transactions
  const transactionDistribution = [
    { name: 'Dépôts', value: 856000, color: '#F58424' },
    { name: 'Retraits', value: 623000, color: '#007BFF' },
    { name: 'Transferts', value: 295000, color: '#6b7280' },
    { name: 'Paiements', value: 187000, color: '#9ca3af' }
  ];

  // Données pour graphique volume par jour
  const volumeByDay = [
    { jour: 'Lun', volume: 950000 },
    { jour: 'Mar', volume: 1110000 },
    { jour: 'Mer', volume: 1020000 },
    { jour: 'Jeu', volume: 1270000 },
    { jour: 'Ven', volume: 1510000 },
    { jour: 'Sam', volume: 1850000 },
    { jour: 'Dim', volume: 1774000 }
  ];

  // Transactions récentes (15 pour la pagination)
  const recentTransactions = [
    { id: 'TXN001', type: 'depot', client: 'Jean Ndayisenga', phone: '+257 79 123 456', amount: 50000, commission: 500, time: '14:35', status: 'success' },
    { id: 'TXN002', type: 'retrait', client: 'Marie Niyonkuru', phone: '+257 79 234 567', amount: 30000, commission: 450, time: '14:28', status: 'success' },
    { id: 'TXN003', type: 'transfert', client: 'Pierre Habimana', phone: '+257 79 345 678', amount: 25000, commission: 250, time: '14:15', status: 'success' },
    { id: 'TXN004', type: 'depot', client: 'Alice Uwimana', phone: '+257 79 456 789', amount: 100000, commission: 1000, time: '13:52', status: 'success' },
    { id: 'TXN005', type: 'paiement', client: 'Bob Nshimirimana', phone: '+257 79 567 890', amount: 15000, commission: 200, time: '13:45', status: 'success' },
    { id: 'TXN006', type: 'retrait', client: 'Claire Bizimana', phone: '+257 79 678 901', amount: 75000, commission: 750, time: '13:30', status: 'success' },
    { id: 'TXN007', type: 'depot', client: 'David Nkurunziza', phone: '+257 79 789 012', amount: 45000, commission: 450, time: '13:12', status: 'success' },
    { id: 'TXN008', type: 'transfert', client: 'Emma Irakoze', phone: '+257 79 890 123', amount: 60000, commission: 600, time: '12:58', status: 'failed' },
    { id: 'TXN009', type: 'paiement', client: 'Frank Mugisha', phone: '+257 79 901 234', amount: 22000, commission: 280, time: '12:45', status: 'success' },
    { id: 'TXN010', type: 'depot', client: 'Grace Uwase', phone: '+257 79 012 345', amount: 85000, commission: 850, time: '12:30', status: 'success' },
    { id: 'TXN011', type: 'retrait', client: 'Henri Niyongabo', phone: '+257 79 111 222', amount: 40000, commission: 400, time: '12:15', status: 'success' },
    { id: 'TXN012', type: 'transfert', client: 'Isabelle Ndikumana', phone: '+257 79 222 333', amount: 35000, commission: 350, time: '12:00', status: 'success' }
  ];

  // Pagination logic
  const totalPages = Math.ceil(recentTransactions.length / transactionsPerPage);
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = recentTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const floatPercentage = ((kpis.floatBalance / kpis.floatMax) * 100).toFixed(0);
  const isFloatLow = kpis.floatBalance < kpis.floatMin * 1.5;
  const isFloatCritical = kpis.floatBalance < kpis.floatMin;
  const successRate = ((kpis.transactionsSuccess / kpis.transactionsToday) * 100).toFixed(1);
  const commissionsGrowth = (((kpis.commissionsToday - kpis.commissionsYesterday) / kpis.commissionsYesterday) * 100).toFixed(1);
  const totalVolume = kpis.depositsToday + kpis.withdrawalsToday + kpis.transfersToday + kpis.paymentsToday;

  const getTypeIcon = (type) => {
    const icons = {
      depot: ArrowDownToLine,
      retrait: ArrowUpFromLine,
      transfert: ArrowLeftRight,
      paiement: CreditCard
    };
    return icons[type] || Activity;
  };

  const getStatusBadge = (status) => {
    if (status === 'success') return (
      <div className="flex items-center gap-1">
        <CheckCircle className="w-4 h-4 text-secondary" />
        <span className="px-2 py-1 bg-secondary/20 text-secondary text-xs rounded-full font-semibold">Succès</span>
      </div>
    );
    if (status === 'pending') return (
      <div className="flex items-center gap-1">
        <Clock className="w-4 h-4 text-yellow-500" />
        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs rounded-full font-semibold">En cours</span>
      </div>
    );
    return (
      <div className="flex items-center gap-1">
        <XCircle className="w-4 h-4 text-red-500" />
        <span className="px-2 py-1 bg-red-500/20 text-red-500 text-xs rounded-full font-semibold">Échec</span>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
      {/* Header simple */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-anton uppercase text-text">Dashboard Agent</h1>
          <p className="text-gray-400 mt-1">
            {currentTime.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} • {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <button className="p-2 hover:bg-card rounded-lg transition-colors" title="Rafraîchir">
          <RefreshCw className="w-5 h-5 text-gray-400 hover:text-text" />
        </button>
      </div>

      {/* KPIs Grid - 6 cartes principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Float Balance */}
        <div className={`border rounded-lg p-6 bg-card ${isFloatCritical ? 'border-red-500' : isFloatLow ? 'border-yellow-500' : 'border-darkGray'}`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm font-semibold flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Float Balance
            </p>
            <DollarSign className={`w-5 h-5 ${isFloatCritical ? 'text-red-500' : isFloatLow ? 'text-yellow-500' : 'text-secondary'}`} />
          </div>
          <p className="text-3xl font-bold text-text mb-2">{(kpis.floatBalance / 1000000).toFixed(2)}M BIF</p>
          <div className="h-2 bg-darkGray rounded-full overflow-hidden mb-2">
            <div 
              className={`h-full transition-all ${isFloatCritical ? 'bg-red-500' : isFloatLow ? 'bg-yellow-500' : 'bg-secondary'}`}
              style={{ width: `${floatPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">{floatPercentage}% du maximum</span>
            <span className={`font-semibold flex items-center gap-1 ${isFloatCritical ? 'text-red-500' : isFloatLow ? 'text-yellow-500' : 'text-secondary'}`}>
              {isFloatCritical ? (
                <><XCircle className="w-3 h-3" /> Critique</>
              ) : isFloatLow ? (
                <><AlertCircle className="w-3 h-3" /> Faible</>
              ) : (
                <><CheckCircle className="w-3 h-3" /> Normal</>
              )}
            </span>
          </div>
        </div>

        {/* Cash Balance */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm font-semibold flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Cash Physique
            </p>
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-text mb-2">{(kpis.cashBalance / 1000000).toFixed(2)}M BIF</p>
          <div className="flex items-center gap-1 text-primary text-sm">
            <ArrowUpRight className="w-4 h-4" />
            <span>Différence: {((kpis.floatBalance - kpis.cashBalance) / 1000).toFixed(0)}K BIF</span>
          </div>
        </div>

        {/* Commissions Today */}
        <div className="border border-darkGray hover:border-secondary bg-card rounded-lg p-6 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm font-semibold flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Commissions Jour
            </p>
            <TrendingUp className="w-5 h-5 text-secondary" />
          </div>
          <p className="text-3xl font-bold text-text mb-2">{(kpis.commissionsToday / 1000).toFixed(1)}K BIF</p>
          <div className="flex items-center gap-1 text-secondary text-sm">
            {commissionsGrowth >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span>{commissionsGrowth >= 0 ? '+' : ''}{commissionsGrowth}% vs hier</span>
          </div>
        </div>

        {/* Transactions Today */}
        <div className="border border-darkGray hover:border-primary bg-card rounded-lg p-6 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Transactions
            </p>
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-text mb-2">{kpis.transactionsToday}</p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-secondary">
              <CheckCircle className="w-4 h-4" />
              <span>{kpis.transactionsSuccess} succès</span>
            </div>
            {kpis.transactionsFailed > 0 && (
              <div className="flex items-center gap-1 text-red-500">
                <XCircle className="w-4 h-4" />
                <span>{kpis.transactionsFailed} échecs</span>
              </div>
            )}
          </div>
        </div>

        {/* Volume Total */}
        <div className="border border-darkGray hover:border-darkGray bg-card rounded-lg p-6 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Volume Total
            </p>
            <DollarSign className="w-5 h-5 text-text" />
          </div>
          <p className="text-3xl font-bold text-text mb-2">{(totalVolume / 1000000).toFixed(2)}M BIF</p>
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <Users className="w-4 h-4" />
            <span>{kpis.clientsServed} clients servis</span>
          </div>
        </div>

        {/* Taux de Succès */}
        <div className="border border-darkGray hover:border-darkGray bg-card rounded-lg p-6 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm font-semibold flex items-center gap-2">
              <Target className="w-4 h-4" />
              Taux de Succès
            </p>
            <CheckCircle className="w-5 h-5 text-secondary" />
          </div>
          <p className="text-3xl font-bold text-text mb-2">{successRate}%</p>
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <Clock className="w-4 h-4" />
            <span>Temps moy: {kpis.avgTransactionTime}s</span>
          </div>
        </div>
      </div>

      {/* Statistiques du Jour - 4 KPIs détaillés */}
      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h3 className="text-xl font-anton uppercase text-text mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Statistiques du Jour
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-darkBlue rounded-lg">
            <ArrowDownToLine className="w-6 h-6 text-secondary mx-auto mb-2" />
            <p className="text-2xl font-bold text-text">{(kpis.depositsToday / 1000).toFixed(0)}K</p>
            <p className="text-gray-400 text-sm">Dépôts</p>
          </div>
          <div className="text-center p-4 bg-darkBlue rounded-lg">
            <ArrowUpFromLine className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-text">{(kpis.withdrawalsToday / 1000).toFixed(0)}K</p>
            <p className="text-gray-400 text-sm">Retraits</p>
          </div>
          <div className="text-center p-4 bg-darkBlue rounded-lg">
            <ArrowLeftRight className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-text">{(kpis.transfersToday / 1000).toFixed(0)}K</p>
            <p className="text-gray-400 text-sm">Transferts</p>
          </div>
          <div className="text-center p-4 bg-darkBlue rounded-lg">
            <CreditCard className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-text">{(kpis.paymentsToday / 1000).toFixed(0)}K</p>
            <p className="text-gray-400 text-sm">Paiements</p>
          </div>
        </div>
      </div>

      {/* 4 Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique 1: Activité par Heure */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <h3 className="text-xl font-anton uppercase text-text mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Activité par Heure
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={activityByHour}>
              <defs>
                <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#007BFF" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#007BFF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#343A40" />
              <XAxis dataKey="heure" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#181F27', border: '1px solid #343A40', borderRadius: '8px' }}
                labelStyle={{ color: '#F9F9F9' }}
              />
              <Area 
                type="monotone" 
                dataKey="transactions" 
                stroke="#007BFF" 
                fillOpacity={1} 
                fill="url(#colorTransactions)"
                name="Transactions"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Graphique 2: Transactions Hebdomadaires */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <h3 className="text-xl font-anton uppercase text-text mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Transactions Hebdomadaires
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transactionsByType}>
              <CartesianGrid strokeDasharray="3 3" stroke="#343A40" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#181F27', border: '1px solid #343A40', borderRadius: '8px' }}
                labelStyle={{ color: '#F9F9F9' }}
              />
              <Legend />
              <Bar dataKey="depots" fill="#F58424" name="Dépôts" />
              <Bar dataKey="retraits" fill="#007BFF" name="Retraits" />
              <Bar dataKey="transferts" fill="#6b7280" name="Transferts" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Graphique 3: Évolution Commissions */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <h3 className="text-xl font-anton uppercase text-text mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Évolution Commissions
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={commissionsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#343A40" />
              <XAxis dataKey="jour" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#181F27', border: '1px solid #343A40', borderRadius: '8px' }}
                labelStyle={{ color: '#F9F9F9' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="commissions" 
                stroke="#F58424" 
                strokeWidth={3}
                dot={{ fill: '#F58424', r: 5 }}
                name="Commissions (BIF)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Graphique 4: Volume Hebdomadaire */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <h3 className="text-xl font-anton uppercase text-text mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Volume Hebdomadaire
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={volumeByDay}>
              <defs>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F58424" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#F58424" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#343A40" />
              <XAxis dataKey="jour" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#181F27', border: '1px solid #343A40', borderRadius: '8px' }}
                labelStyle={{ color: '#F9F9F9' }}
                formatter={(value) => `${(value / 1000).toFixed(0)}K BIF`}
              />
              <Area 
                type="monotone" 
                dataKey="volume" 
                stroke="#F58424" 
                fillOpacity={1} 
                fill="url(#colorVolume)"
                name="Volume (BIF)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dernières Transactions + Répartition */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique en Camembert */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <h3 className="text-xl font-anton uppercase text-text mb-4 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5" />
            Répartition
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={transactionDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {transactionDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#181F27', border: '1px solid #343A40', borderRadius: '8px' }}
                formatter={(value) => `${(value / 1000).toFixed(0)}K BIF`}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {transactionDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-400">{item.name}</span>
                </div>
                <span className="text-text font-semibold">{(item.value / 1000).toFixed(0)}K</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dernières Transactions - Pagination par 3 */}
        <div className="lg:col-span-2 border border-darkGray bg-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-anton uppercase text-text flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Dernières Transactions
            </h3>
            <button className="text-primary hover:text-secondary text-sm font-semibold transition-colors">
              Voir tout →
            </button>
          </div>
          
          {/* Liste des transactions (3 par page) */}
          <div className="space-y-2 mb-4">
            {currentTransactions.map((tx) => {
              const IconComponent = getTypeIcon(tx.type);
              return (
                <div key={tx.id} className="flex items-center justify-between p-3 bg-darkBlue rounded-lg hover:bg-darkGray transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${
                      tx.type === 'depot' ? 'bg-secondary/10' :
                      tx.type === 'retrait' ? 'bg-primary/10' :
                      'bg-gray-500/10'
                    }`}>
                      <IconComponent className={`w-5 h-5 ${
                        tx.type === 'depot' ? 'text-secondary' :
                        tx.type === 'retrait' ? 'text-primary' :
                        'text-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-text font-semibold truncate">{tx.client}</p>
                      <p className="text-gray-400 text-xs">{tx.phone} • {tx.id}</p>
                    </div>
                  </div>
                  <div className="text-right mx-4">
                    <p className="text-text font-bold">{tx.amount.toLocaleString()} BIF</p>
                    <p className="text-secondary text-xs">+{tx.commission} BIF</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-xs">{tx.time}</span>
                    {getStatusBadge(tx.status)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-darkGray">
            <div className="text-sm text-gray-400">
              Page {currentPage} sur {totalPages} • {recentTransactions.length} transactions
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border transition-colors ${
                  currentPage === 1
                    ? 'border-darkGray text-gray-600 cursor-not-allowed'
                    : 'border-darkGray text-text hover:bg-darkGray hover:border-primary'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                      currentPage === index + 1
                        ? 'bg-primary text-white'
                        : 'text-gray-400 hover:bg-darkGray hover:text-text'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg border transition-colors ${
                  currentPage === totalPages
                    ? 'border-darkGray text-gray-600 cursor-not-allowed'
                    : 'border-darkGray text-text hover:bg-darkGray hover:border-primary'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}

export default AgentDashboard;


// Composant Skeleton pour le chargement
const DashboardSkeleton = () => {
  return (
    <>
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-8 w-64 bg-darkGray rounded animate-pulse mb-2"></div>
          <div className="h-4 w-96 bg-darkGray rounded animate-pulse"></div>
        </div>
        <div className="h-10 w-10 bg-darkGray rounded-lg animate-pulse"></div>
      </div>

      {/* KPIs Skeleton - 6 cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="border border-darkGray bg-card rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 w-32 bg-darkGray rounded animate-pulse"></div>
              <div className="h-5 w-5 bg-darkGray rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-40 bg-darkGray rounded animate-pulse mb-3"></div>
            <div className="h-3 w-full bg-darkGray rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Statistiques du Jour Skeleton */}
      <div className="border border-darkGray bg-card rounded-lg p-6 mb-6">
        <div className="h-6 w-48 bg-darkGray rounded animate-pulse mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center p-4 bg-darkBlue rounded-lg">
              <div className="h-6 w-6 bg-darkGray rounded mx-auto mb-2 animate-pulse"></div>
              <div className="h-8 w-20 bg-darkGray rounded mx-auto mb-2 animate-pulse"></div>
              <div className="h-3 w-16 bg-darkGray rounded mx-auto animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Graphiques Skeleton - 4 graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border border-darkGray bg-card rounded-lg p-6">
            <div className="h-6 w-48 bg-darkGray rounded animate-pulse mb-4"></div>
            <div className="h-[300px] bg-darkGray rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Répartition & Transactions Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camembert Skeleton */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <div className="h-6 w-32 bg-darkGray rounded animate-pulse mb-4"></div>
          <div className="h-[280px] bg-darkGray rounded-full mx-auto w-[280px] animate-pulse mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-darkGray rounded-full animate-pulse"></div>
                  <div className="h-3 w-20 bg-darkGray rounded animate-pulse"></div>
                </div>
                <div className="h-3 w-12 bg-darkGray rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions Skeleton */}
        <div className="lg:col-span-2 border border-darkGray bg-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 w-48 bg-darkGray rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-darkGray rounded animate-pulse"></div>
          </div>
          
          <div className="space-y-2 mb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-darkBlue rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-12 w-12 bg-darkGray rounded-lg animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-darkGray rounded animate-pulse mb-2"></div>
                    <div className="h-3 w-48 bg-darkGray rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="text-right mx-4">
                  <div className="h-4 w-24 bg-darkGray rounded animate-pulse mb-2"></div>
                  <div className="h-3 w-16 bg-darkGray rounded animate-pulse"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-12 bg-darkGray rounded animate-pulse"></div>
                  <div className="h-6 w-20 bg-darkGray rounded-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="flex items-center justify-between pt-4 border-t border-darkGray">
            <div className="h-4 w-48 bg-darkGray rounded animate-pulse"></div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-darkGray rounded-lg animate-pulse"></div>
              <div className="h-8 w-8 bg-darkGray rounded-lg animate-pulse"></div>
              <div className="h-8 w-8 bg-darkGray rounded-lg animate-pulse"></div>
              <div className="h-8 w-8 bg-darkGray rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
