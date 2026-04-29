import { Home, Package, BarChart3, ShoppingCart } from 'lucide-react';
import { VALUE } from '@/config/app.config';

interface MobilesidebarProps {
    currentView: typeof VALUE[keyof typeof VALUE];
    onNavigate: (view: typeof VALUE[keyof typeof VALUE]) => void;
}


export default function Mobilesidebar({ currentView, onNavigate }: MobilesidebarProps) {
    const navItems = [
        { id: VALUE.HOME, label: 'Home', icon: Home },
        { id: VALUE.MANAGE, label: 'Manage Item', icon: Package },
        { id: VALUE.MONITOR, label: 'Monitor Item', icon: BarChart3 },
        { id: VALUE.ORDER, label: 'Order', icon: ShoppingCart },
    ];
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border flex md:hidden z-40">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                    <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className={`flex-1 flex flex-col items-center gap-0.5 py-2 transition-colors relative ${isActive
                            ? "text-foreground"
                            : "text-muted-foreground"
                            }`}
                    >
                        {isActive && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary" />
                        )}
                        <Icon className="w-5 h-5" strokeWidth={1.5} />
                        <span className="text-xs">{item.label}</span>
                    </button>
                );
            })}
        </nav>
    );
}