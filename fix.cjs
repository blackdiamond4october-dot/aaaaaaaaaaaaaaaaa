const fs = require('fs');
const files = ['src/components/PurchaseModule.tsx', 'src/components/PaymentsModule.tsx', 'src/components/ReportsModule.tsx', 'src/components/Dashboard.tsx', 'src/components/Layout.tsx', 'src/components/SaleModule.tsx', 'src/components/RemindersModule.tsx', 'src/components/SettingsModule.tsx', 'src/components/ExpensesModule.tsx'];
files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/bg-\[#1c1c1f\]/g, 'bg-app-surface');
  content = content.replace(/bg-\[#18181b\]/g, 'bg-app-header');
  content = content.replace(/bg-\[#0f0f10\]/g, 'bg-app-bg');
  content = content.replace(/border-\[#27272a\]/g, 'border-app-border');
  content = content.replace(/text-\[#f4f4f5\]/g, 'text-app-text');
  content = content.replace(/text-\[#a1a1aa\]/g, 'text-app-muted');
  content = content.replace(/bg-\[#27272a\]/g, 'bg-app-border');
  content = content.replace(/hover:bg-\[#27272a\]/g, 'hover:bg-app-border');
  content = content.replace(/hover:text-\[#f4f4f5\]/g, 'hover:text-app-text');
  content = content.replace(/text-\[#52525b\]/g, 'text-app-muted');
  content = content.replace(/bg-\[#0f0f10\]\/50/g, 'bg-app-bg');
  content = content.replace(/hover:bg-\[#27272a44\]/g, 'hover:bg-app-border/40');
  fs.writeFileSync(file, content);
});
