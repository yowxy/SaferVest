import { Users, UserCheck, CheckCircle, AlertCircle, AlertTriangle, UserX } from 'lucide-react';
import { DashboardSummary } from '../types';

interface SummaryCardsProps {
  summary: DashboardSummary;
}

export const SummaryCards = ({ summary }: SummaryCardsProps) => {
  const cards = [
    {
      label: 'TOTAL',
      value: summary.total,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
    {
      label: 'ONLINE',
      value: summary.online,
      icon: UserCheck,
      color: 'text-primary-500',
      bgColor: 'bg-primary-500/10',
      borderColor: 'border-primary-500/30',
    },
    {
      label: 'NORMAL',
      value: summary.normal,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
    },
    {
      label: 'WARNING',
      value: summary.warning,
      icon: AlertCircle,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
    },
    {
      label: 'EMERGENCY',
      value: summary.emergency,
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
    },
    {
      label: 'OFFLINE',
      value: summary.offline,
      icon: UserX,
      color: 'text-gray-500',
      bgColor: 'bg-gray-500/10',
      borderColor: 'border-gray-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`bg-dark-900 border ${card.borderColor} rounded-lg p-4 hover:scale-105 transition-transform`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {card.label}
              </span>
              <div className={`${card.bgColor} p-2 rounded-lg`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <span className={`text-3xl font-bold ${card.color}`}>
                {card.value.toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
