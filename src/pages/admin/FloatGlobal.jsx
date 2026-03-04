import { useState, useRef } from 'react';
import { Toast } from 'primereact/toast';
import {
  ComposedChart, Line, Bar, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Wallet, TrendingUp, TrendingDown, Activity,
  RefreshCw, Download, Target, Cpu, CheckCircle, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

function FloatGlobal() {
  const toast = useRef(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const advancedMetrics = {
    floatTotal: { value: 8500000000, change: 12.5, trend: 'up', target: 10000000000, velocity: 245000000 },
    floatDisponible: { value: 6200000000, change: 8.3, trend: 'up', utilization: 72.9 },
    floatEngage: { value: 2300000000, change: 18.7, trend: 'up', efficiency: 94.2 },
    predictionBesoin: { value: 9200000000, confidence: 87.5, horizon: '7j' }
  };

  const floatPrediction = Array.from({ length: 14 }, (_, i) => {
    const baseFloat = 8500000000;
    const trend = 50000000 * i;
    const seasonality = Math.sin(i / 3) * 200000000;
    return {
      jour: `J+${i}`,
      prevu: baseFloat + trend + seasonality,
      min: baseFloat + trend + seasonality - 500000000,
      max: baseFloat + trend + seasonality + 500000000,
      confiance: 95 - (i * 2)
    };
  });

  const fluxAnalysis = Array.from({ length: 24 }, (_, i) => ({
    heure: `${i}h`,
    entrees: Math.floor(Math.random() * 300000000) + 100000000,
    sorties: Math.floor(Math.random() * 250000000) + 80000000,
    netFlow: Math.floor(Math.random() * 100000000) - 50000000,
    cumulative: 6200000000 + (Math.random() * 400000000 - 200000000)
  }));

  const AdvancedKPICard = ({ title, value, change, trend, icon: Icon, unit = '', format = 'number', subtitle, progress }) => {
    const isPositive = trend === 'up' ? change > 0 : change < 0;
    
    let displayValue = value;
    if (format === 'currency') {
      displayValue = value >= 1000000000 
        ? `${(value / 1000000000).toFixed(2)}B`
        : value >= 1000000
        ? `${(value / 1000000).toFixed(1)}M`
        : value.toLocaleString();
    }

    return (
      <div className="border border-darkGray bg-card rounded-lg p-5 hover:border-primary/50 transition-all">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-1">{title}</p>
            <p className="text-3xl font-bold text-text mb-1">{displayValue}{unit}</p>
            {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-lg ${isPositive ? 'bg-green-500/20' : 'bg-danger/20'}`}>
            <Icon className={`w-6 h-6 ${isPositive ? 'text-green-500' : 'text-danger'}`} />
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          {isPositive ? <ArrowUpRight className="w-4 h-4 text-green-500" /> : <ArrowDownRight className="w-4 h-4 text-danger" />}
          <span className={`text-sm font-semibold ${isPositive ? 'text-green-500' : 'text-danger'}`}>
            {Math.abs(change)}%
          </span>
          <span className="text-xs text-gray-400">vs hier</span>
        </div>

        {progress && (
          <div className="h-1.5 bg-darkGray rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                progress >= 90 ? 'bg-green-500' : progress >= 70 ? 'bg-secondary' : 'bg-primary'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-6 w-full max-w-full overflow-x-hidden">
      <Toast ref={toast} />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-anton uppercase text-text tracking-tight">
            Float Management Intelligence
          </h1>
          <p className="text-gray-400 mt-2 text-sm md:text-base">
            Gestion predictive et optimisation temps reel
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-card border border-darkGray rounded-lg text-text text-sm"
          >
            <option value="1h">Derniere heure</option>
            <option value="24h">24 heures</option>
            <option value="7d">7 jours</option>
          </select>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`p-2 rounded-lg ${autoRefresh ? 'bg-primary text-white' : 'bg-card border border-darkGray'}`}
          >
            <RefreshCw className={`w-5 h-5 ${autoRefresh ? 'animate-spin' : ''}`} />
          </button>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold">
            <Download size={18} />
            Exporter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdvancedKPICard
          title="Float Total Reseau"
          value={advancedMetrics.floatTotal.value}
          change={advancedMetrics.floatTotal.change}
          trend={advancedMetrics.floatTotal.trend}
          icon={Wallet}
          unit=" BIF"
          format="currency"
          subtitle={`Velocite: ${(advancedMetrics.floatTotal.velocity / 1000000).toFixed(0)}M/jour`}
          progress={(advancedMetrics.floatTotal.value / advancedMetrics.floatTotal.target) * 100}
        />
        <AdvancedKPICard
          title="Float Disponible"
          value={advancedMetrics.floatDisponible.value}
          change={advancedMetrics.floatDisponible.change}
          trend={advancedMetrics.floatDisponible.trend}
          icon={CheckCircle}
          unit=" BIF"
          format="currency"
          subtitle={`Utilisation: ${advancedMetrics.floatDisponible.utilization}%`}
          progress={advancedMetrics.floatDisponible.utilization}
        />
        <AdvancedKPICard
          title="Float Engage"
          value={advancedMetrics.floatEngage.value}
          change={advancedMetrics.floatEngage.change}
          trend={advancedMetrics.floatEngage.trend}
          icon={Activity}
          unit=" BIF"
          format="currency"
          subtitle={`Efficacite: ${advancedMetrics.floatEngage.efficiency}%`}
          progress={advancedMetrics.floatEngage.efficiency}
        />
        <AdvancedKPICard
          title="Prediction 7j"
          value={advancedMetrics.predictionBesoin.value}
          change={8.5}
          trend="up"
          icon={Target}
          unit=" BIF"
          format="currency"
          subtitle={`Confiance: ${advancedMetrics.predictionBesoin.confidence}%`}
          progress={advancedMetrics.predictionBesoin.confidence}
        />
      </div>

      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h2 className="text-xl font-anton uppercase text-text mb-6 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-primary" />
          Metriques Operationnelles Temps Reel
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase mb-2">Velocite Float</div>
            <div className="text-3xl font-bold text-primary mb-1">245M</div>
            <div className="text-xs text-green-500 flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +15.8%
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase mb-2">Taux Utilisation</div>
            <div className="text-3xl font-bold text-secondary mb-1">72.9%</div>
            <div className="text-xs text-gray-400">Optimal: 75%</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase mb-2">Temps Reappro</div>
            <div className="text-3xl font-bold text-text mb-1">2.3h</div>
            <div className="text-xs text-green-500 flex items-center justify-center gap-1">
              <TrendingDown className="w-3 h-3" />
              12.5%
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase mb-2">Turnover Rate</div>
            <div className="text-3xl font-bold text-text mb-1">3.2x</div>
            <div className="text-xs text-gray-400">par semaine</div>
          </div>
        </div>
      </div>

      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h2 className="text-xl font-anton uppercase text-text mb-6 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Prevision Intelligente des Besoins en Float (14 jours)
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={floatPrediction}>
            <defs>
              <linearGradient id="colorPrevu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#007BFF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#007BFF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#343A40" />
            <XAxis dataKey="jour" stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#181F27',
                border: '1px solid #343A40',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="max"
              stroke="none"
              fill="rgba(245, 132, 36, 0.1)"
              name="Scenario Haut"
            />
            <Area
              type="monotone"
              dataKey="min"
              stroke="none"
              fill="rgba(245, 132, 36, 0.1)"
              name="Scenario Bas"
            />
            <Area
              type="monotone"
              dataKey="prevu"
              stroke="#007BFF"
              strokeWidth={3}
              fill="url(#colorPrevu)"
              name="Prevision (BIF)"
            />
            <Line
              type="monotone"
              dataKey="confiance"
              stroke="#28A745"
              strokeWidth={2}
              dot={{ fill: '#28A745', r: 3 }}
              name="Confiance (%)"
              yAxisId="right"
            />
            <YAxis yAxisId="right" orientation="right" stroke="#28A745" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h2 className="text-xl font-anton uppercase text-text mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-secondary" />
          Analyse des Flux Entrants/Sortants (24h)
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={fluxAnalysis}>
            <CartesianGrid strokeDasharray="3 3" stroke="#343A40" />
            <XAxis dataKey="heure" stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <YAxis yAxisId="left" stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#181F27',
                border: '1px solid #343A40',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="entrees" fill="#28A745" name="Entrees (BIF)" />
            <Bar yAxisId="left" dataKey="sorties" fill="#DC3545" name="Sorties (BIF)" />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="netFlow"
              stroke="#F58424"
              strokeWidth={3}
              name="Flux Net (BIF)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cumulative"
              stroke="#007BFF"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Float Cumule (BIF)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default FloatGlobal;
