import React, { useState } from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Button } from '../../components/common';

function Reports() {
  const [reportType, setReportType] = useState('performance');

  // Données de comparaison mensuelle
  const comparisonData = [
    { mois: 'Jan', annee2025: 4500, annee2026: 5200, objectif: 5000 },
    { mois: 'Fév', annee2025: 5200, annee2026: 6100, objectif: 5500 },
    { mois: 'Mar', annee2025: 4800, annee2026: 5800, objectif: 5200 },
    { mois: 'Avr', annee2025: 6100, annee2026: 7200, objectif: 6500 },
    { mois: 'Mai', annee2025: 7200, annee2026: 8500, objectif: 7500 },
    { mois: 'Juin', annee2025: 6800, annee2026: 8100, objectif: 7200 }
  ];

  // Données de performance par catégorie
  const performanceData = [
    { categorie: 'Rapidité', score: 85, max: 100 },
    { categorie: 'Satisfaction', score: 92, max: 100 },
    { categorie: 'Volume', score: 78, max: 100 },
    { categorie: 'Qualité', score: 88, max: 100 },
    { categorie: 'Fiabilité', score: 95, max: 100 }
  ];

  // Données de croissance trimestrielle
  const quarterlyData = [
    { trimestre: 'Q1 2025', revenus: 14500, croissance: 12 },
    { trimestre: 'Q2 2025', revenus: 20100, croissance: 38 },
    { trimestre: 'Q3 2025', revenus: 24000, croissance: 19 },
    { trimestre: 'Q4 2025', revenus: 28600, croissance: 19 },
    { trimestre: 'Q1 2026', revenus: 17100, croissance: 18 },
    { trimestre: 'Q2 2026', revenus: 23800, croissance: 18 }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Rapports Détaillés</h1>
          <p className="text-muted">Analyses approfondies et comparaisons</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="small">
            📥 Télécharger PDF
          </Button>
          <Button variant="outline" size="small">
            📊 Exporter Excel
          </Button>
          <Button variant="primary" size="small">
            📧 Envoyer par Email
          </Button>
        </div>
      </div>

      {/* Filtres de rapport */}
      <div className="bg-card border border-default rounded-lg p-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={reportType === 'performance' ? 'primary' : 'outline'} 
            size="small"
            onClick={() => setReportType('performance')}
          >
            Performance
          </Button>
          <Button 
            variant={reportType === 'comparison' ? 'primary' : 'outline'} 
            size="small"
            onClick={() => setReportType('comparison')}
          >
            Comparaison
          </Button>
          <Button 
            variant={reportType === 'growth' ? 'primary' : 'outline'} 
            size="small"
            onClick={() => setReportType('growth')}
          >
            Croissance
          </Button>
        </div>
      </div>

      {/* Indicateurs clés */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-default rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Taux de Croissance</h3>
            <span className="text-3xl">📈</span>
          </div>
          <p className="text-4xl font-bold text-green-600 mb-2">+24.5%</p>
          <p className="text-sm text-muted">Par rapport à l'année dernière</p>
          <div className="mt-4 h-2 bg-background rounded-full overflow-hidden">
            <div className="h-full bg-green-600" style={{ width: '75%' }}></div>
          </div>
        </div>

        <div className="bg-card border border-default rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Objectif Atteint</h3>
            <span className="text-3xl">🎯</span>
          </div>
          <p className="text-4xl font-bold text-indigo-600 mb-2">87%</p>
          <p className="text-sm text-muted">Objectif mensuel</p>
          <div className="mt-4 h-2 bg-background rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600" style={{ width: '87%' }}></div>
          </div>
        </div>

        <div className="bg-card border border-default rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Score Performance</h3>
            <span className="text-3xl">⭐</span>
          </div>
          <p className="text-4xl font-bold text-amber-600 mb-2">4.6/5</p>
          <p className="text-sm text-muted">Évaluation globale</p>
          <div className="mt-4 h-2 bg-background rounded-full overflow-hidden">
            <div className="h-full bg-amber-600" style={{ width: '92%' }}></div>
          </div>
        </div>
      </div>

      {/* Graphique de comparaison annuelle */}
      <div className="bg-card border border-default rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Comparaison Année sur Année</h2>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis dataKey="mois" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="annee2025" fill="#8b5cf6" name="2025" radius={[8, 8, 0, 0]} />
            <Bar dataKey="annee2026" fill="#6366f1" name="2026" radius={[8, 8, 0, 0]} />
            <Line 
              type="monotone" 
              dataKey="objectif" 
              stroke="#f59e0b" 
              strokeWidth={3}
              name="Objectif"
              strokeDasharray="5 5"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Graphiques secondaires */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar de performance */}
        <div className="bg-card border border-default rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Analyse de Performance</h2>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={performanceData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="categorie" stroke="#9ca3af" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#9ca3af" />
              <Radar 
                name="Score" 
                dataKey="score" 
                stroke="#6366f1" 
                fill="#6366f1" 
                fillOpacity={0.6} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Croissance trimestrielle */}
        <div className="bg-card border border-default rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Croissance Trimestrielle</h2>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={quarterlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="trimestre" stroke="#9ca3af" angle={-15} textAnchor="end" height={80} />
              <YAxis yAxisId="left" stroke="#9ca3af" />
              <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar 
                yAxisId="left"
                dataKey="revenus" 
                fill="#ec4899" 
                name="Revenus ($)"
                radius={[8, 8, 0, 0]}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="croissance" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Croissance (%)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tableau récapitulatif */}
      <div className="bg-card border border-default rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Récapitulatif des Performances</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {performanceData.map((item, index) => (
            <div key={index} className="p-4 bg-background rounded-lg border border-default">
              <p className="text-sm text-muted mb-2">{item.categorie}</p>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold text-primary">{item.score}</p>
                <p className="text-sm text-muted mb-1">/ {item.max}</p>
              </div>
              <div className="mt-3 h-2 bg-card rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" 
                  style={{ width: `${item.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Reports;
