import { VALUE } from '@/config/app.config';
import { Home, Package, BarChart3, ShoppingCart } from 'lucide-react';

interface SidebarProps {
    currentView: typeof VALUE[keyof typeof VALUE];
    onNavigate: (prev: typeof VALUE[keyof typeof VALUE]) => void;
}

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
    const navItems = [
        { id: VALUE.HOME, label: 'Home', icon: Home },
        { id: VALUE.MANAGE, label: 'Manage Item', icon: Package },
        { id: VALUE.MONITOR, label: 'Monitor Item', icon: BarChart3 },
        { id: VALUE.ORDER, label: 'Order', icon: ShoppingCart },
    ];

    return (
        <div className="hidden md:flex w-56 bg-white border-r border-border h-screen flex-col">
            <div className="px-6 py-4 border-b border-border">
                <h2>CISM Stall</h2>
            </div>

            <nav className="flex-1 py-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`w-full flex items-center gap-3 px-6 py-3 transition-colors relative ${isActive
                                ? 'bg-secondary/50'
                                : 'hover:bg-secondary/30'
                                }`}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary" />
                            )}
                            <Icon className="w-5 h-5" strokeWidth={1.5} />
                            <span className={isActive ? 'text-foreground' : 'text-muted-foreground'}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}