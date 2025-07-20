import { Card, CardContent } from "@/components/ui/card";
import type { DashboardStats } from "@/types";

interface StatsCardsProps {
  stats: DashboardStats;
}

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral' | 'warning';
  icon: string;
  iconBg: string;
  iconColor: string;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards: StatCard[] = [
    {
      title: "Total Donations",
      value: `KES ${stats.totalDonations.toLocaleString()}`,
      change: `${stats.donationCount} donations this month`,
      changeType: "positive",
      icon: "fas fa-heart",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Success Rate",
      value: `${stats.successRate}%`,
      change: "Payment Success Rate",
      changeType: "neutral",
      icon: "fas fa-check-circle",
      iconBg: "bg-success/10",
      iconColor: "text-success",
    },
    {
      title: "Pending Payments",
      value: stats.pendingPayments.toString(),
      change: "Awaiting Confirmation",
      changeType: "warning",
      icon: "fas fa-clock",
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
    },
    {
      title: "Monthly Transactions",
      value: stats.monthlyStats.totalTransactions.toString(),
      change: `${((stats.monthlyStats.completedTransactions / stats.monthlyStats.totalTransactions) * 100).toFixed(1)}% completion rate`,
      changeType: stats.monthlyStats.failedTransactions === 0 ? "positive" : "neutral",
      icon: "fas fa-chart-line",
      iconBg: "bg-info/10",
      iconColor: "text-info",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">
                  {card.title}
                </p>
                <h3 className="text-2xl font-bold text-neutral-800 mt-2">
                  {card.value}
                </h3>
                <p className={`text-xs flex items-center mt-2 ${
                  card.changeType === "positive" ? "text-success" :
                  card.changeType === "warning" ? "text-warning" :
                  card.changeType === "negative" ? "text-error" : "text-neutral-500"
                }`}>
                  {card.changeType === "positive" && <i className="fas fa-arrow-up text-xs mr-1"></i>}
                  {card.changeType === "warning" && <i className="fas fa-exclamation-circle text-xs mr-1"></i>}
                  {card.changeType === "negative" && <i className="fas fa-arrow-down text-xs mr-1"></i>}
                  {card.change}
                </p>
              </div>
              <div className={`w-12 h-12 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                <i className={`${card.icon} ${card.iconColor} text-xl`}></i>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
