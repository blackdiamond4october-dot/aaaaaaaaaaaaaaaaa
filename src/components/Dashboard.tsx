import React from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Package, 
  CreditCard, 
  Wallet,
  Truck
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { motion } from 'motion/react';
import { useStore } from '../store/StoreContext';
import { formatCurrency, cn } from '../lib/utils';

const StatCard: React.FC<{ 
  title: string; 
  value: string | number; 
  icon: React.ReactNode; 
  trend?: string; 
  isPositive?: boolean;
  color?: string;
}> = ({ title, value, icon, trend, isPositive, color = "indigo" }) => (
  <div className="bg-app-surface border border-app-border p-5 rounded-xl relative overflow-hidden group hover:border-[#6366f155] transition-all duration-300 shadow-lg">
    <div className={`absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity scale-[3.0] rotate-12`}>
      {icon}
    </div>
    <div className="flex items-start justify-between mb-4">
      <div className={cn(
        "w-10 h-10 rounded flex items-center justify-center border",
        color === "indigo" ? "bg-[#6366f122] text-[#6366f1] border-[#6366f133]" :
        color === "green" ? "bg-[#22c55e22] text-[#22c55e] border-[#22c55e33]" :
        color === "red" ? "bg-[#ef444422] text-[#ef4444] border-[#ef444433]" :
        color === "amber" ? "bg-[#f59e0b22] text-[#f59e0b] border-[#f59e0b33]" : 
        "bg-app-surface text-app-muted border-app-border"
      )}>
        {icon}
      </div>
      {trend && (
        <span className={cn(
          "flex items-center gap-0.5 text-[9px] font-black px-2 py-0.5 rounded border tracking-wider uppercase",
          isPositive ? "bg-[#22c55e11] text-[#22c55e] border-[#22c55e22]" : "bg-[#ef444411] text-[#ef4444] border-[#ef444422]"
        )}>
          {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
          {trend}
        </span>
      )}
    </div>
    <p className="text-app-muted text-[10px] font-black uppercase tracking-[0.15em] mb-1">{title}</p>
    <p className="text-3xl font-black tracking-tight text-app-text font-mono">{value}</p>
  </div>
);

export const Dashboard: React.FC = () => {
  const { sales, purchases, expenses, items, customers, settings, setView } = useStore();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todaysSales = sales.filter(s => new Date(s.date) >= todayStart);
  
  const todaySalesAmount = todaysSales.reduce((acc, s) => acc + s.total, 0);
  
  let todayProfit = 0;
  todaysSales.forEach(sale => {
    sale.items.forEach(cartItem => {
      const dbItem = items.find(i => i.id === cartItem.itemId);
      const costPrice = dbItem ? dbItem.costPrice : 0;
      todayProfit += (cartItem.price - costPrice) * cartItem.qty;
    });
  });

  const lowStockItems = items.filter(i => i.lowStockValue > 0 && i.stock <= i.lowStockValue);
  
  const pendingReceivables = customers.reduce((acc, c) => {
    const custSales = sales.filter(s => s.customerId === c.id);
    const totalBought = custSales.reduce((sum, s) => sum + s.total, 0);
    const totalPaid = custSales.reduce((sum, s) => sum + s.paid, 0);
    return acc + (totalBought - totalPaid);
  }, 0);

  // Mock data for charts
  const salesData = [
    { name: 'MON', total: 4000 },
    { name: 'TUE', total: 3000 },
    { name: 'WED', total: 2000 },
    { name: 'THU', total: 2780 },
    { name: 'FRI', total: 1890 },
    { name: 'SAT', total: 2390 },
    { name: 'SUN', total: 3490 },
  ];

  // Calculate top items based on sales volume
  const topItemsMap = new Map<string, number>();
  sales.forEach(sale => {
    sale.items.forEach(cartItem => {
      const currentQty = topItemsMap.get(cartItem.name) || 0;
      topItemsMap.set(cartItem.name, currentQty + cartItem.qty);
    });
  });

  const calculatedTopItems = Array.from(topItemsMap.entries())
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  // Fallback to sample data if no sales exist so the chart isn't empty
  const topItems = calculatedTopItems.length > 0 ? calculatedTopItems : [
    { name: 'Start selling to', qty: 0 },
    { name: 'see top items', qty: 0 }
  ];

  const maxQty = topItems.reduce((max, item) => Math.max(max, item.qty), 1) || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-app-text uppercase">{settings.companyName} ANALYTIC HUB</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setView('REPORTS')} className="bg-app-surface border border-app-border px-4 py-2 rounded text-[11px] font-black uppercase tracking-wider hover:bg-app-border transition-all text-app-text">
            View Analytics
          </button>
          <button onClick={() => setView('SALE')} className="bg-[#6366f1] text-white px-4 py-2 rounded text-[11px] font-black uppercase tracking-wider hover:brightness-110 transition-all shadow-lg shadow-[#6366f122]">
            Launch Terminal
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Velocity" value={formatCurrency(todaySalesAmount)} icon={<TrendingUp size={18} />} color="indigo" />
        <StatCard title="Today's Alpha" value={formatCurrency(todayProfit)} icon={<ShoppingBag size={18} />} color="green" />
        <StatCard title="Action Required" value={lowStockItems.length} icon={<Wallet size={18} />} isPositive={false} color="red" />
        <StatCard title="Pending Receivables" value={formatCurrency(pendingReceivables)} icon={<Users size={18} />} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-app-surface border border-app-border p-6 rounded-xl shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-app-muted">Temporal Revenue Analysis</h3>
              <p className="text-[9px] text-app-muted mt-1 uppercase font-bold tracking-wider">7-Day Aggregated Data Stream</p>
            </div>
            <select className="bg-app-bg border border-app-border rounded px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider outline-none focus:border-[#6366f155] text-app-text">
              <option>Total Revenue</option>
              <option>Tx Count</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--app-border)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--app-muted)" 
                  fontSize={9} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                  fontFamily="JetBrains Mono"
                />
                <YAxis 
                  stroke="var(--app-muted)" 
                  fontSize={9} 
                  tickLine={false} 
                  axisLine={false} 
                  fontFamily="JetBrains Mono"
                  tickFormatter={(val) => `${val/1000}K`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--app-header)', borderRadius: '4px', border: '1px solid var(--app-border)', fontFamily: 'JetBrains Mono', fontSize: '10px', color: 'var(--app-text)' }}
                  itemStyle={{ color: '#6366f1' }}
                />
                <Area 
                  type="stepAfter" 
                  dataKey="total" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-app-surface border border-app-border p-6 rounded-xl shadow-xl flex flex-col">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-app-muted mb-6">Inventory Velocity</h3>
          <div className="space-y-5 flex-1">
            {topItems.map((item, index) => (
              <div key={index} className="group">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider mb-2">
                  <span className="text-app-muted group-hover:text-app-text transition-colors">{item.name}</span>
                  <span className="font-mono text-[#6366f1]">{item.qty} UNIT</span>
                </div>
                <div className="h-1 bg-app-bg rounded-full overflow-hidden border border-app-border">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.qty / maxQty) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full bg-gradient-to-r from-[#6366f133] to-[#6366f1] rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
