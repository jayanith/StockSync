
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, Package, Layers, ShoppingCart, Truck, Users, BarChart2, Settings, LogOut, 
  ChevronLeft, ChevronRight, PackagePlus, FileText, Building, FilePlus, Users2, LineChart, Cog
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NavItem = ({ to, children, icon, isCollapsed, exact = true }) => (
  <NavLink
    to={to}
    end={exact}
    className={({ isActive }) =>
      cn(
        'flex items-center p-3 rounded-lg transition-colors duration-200 ease-in-out group',
        isActive 
          ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md' 
          : 'text-gray-300 hover:bg-slate-700/50 hover:text-white',
        isCollapsed ? 'justify-center' : ''
      )
    }
  >
    {React.cloneElement(icon, { className: cn("h-5 w-5 shrink-0", !isCollapsed && "mr-3") })}
    {!isCollapsed && <span className="truncate">{children}</span>}
  </NavLink>
);

const Sidebar = ({ onLogout }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const handleDirectLogout = () => {
    onLogout(); 
    navigate('/login');
  };

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-full bg-slate-800 shadow-xl z-40 transition-all duration-300 ease-in-out pt-16 flex flex-col",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="flex-grow p-4 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
        <NavItem to="/" icon={<Home />} isCollapsed={isCollapsed} exact={true}>Dashboard</NavItem>
        
        <p className={cn("text-xs text-slate-500 uppercase font-semibold mt-3 mb-1", isCollapsed ? "text-center" : "px-3")}>Inventory</p>
        <NavItem to="/products" icon={<Package />} isCollapsed={isCollapsed}>Products</NavItem>
        <NavItem to="/products/new" icon={<PackagePlus />} isCollapsed={isCollapsed}>Add Product</NavItem>
        <NavItem to="/categories" icon={<Layers />} isCollapsed={isCollapsed}>Categories</NavItem>
        <NavItem to="/inventory" icon={<BarChart2 />} isCollapsed={isCollapsed}>Stock Control</NavItem>
        <NavItem to="/inventory/warehouses" icon={<Building />} isCollapsed={isCollapsed}>Warehouses</NavItem>
        <NavItem to="/inventory/transfers" icon={<Truck />} isCollapsed={isCollapsed}>Transfers</NavItem>


        <p className={cn("text-xs text-slate-500 uppercase font-semibold mt-3 mb-1", isCollapsed ? "text-center" : "px-3")}>Sales & Purchases</p>
        <NavItem to="/orders" icon={<ShoppingCart />} isCollapsed={isCollapsed}>Customer Orders</NavItem>
        <NavItem to="/orders/new" icon={<FileText />} isCollapsed={isCollapsed}>Create Order</NavItem>
        <NavItem to="/suppliers" icon={<Users2 />} isCollapsed={isCollapsed}>Suppliers</NavItem>
        <NavItem to="/purchase-orders" icon={<FilePlus />} isCollapsed={isCollapsed}>Purchase Orders</NavItem>
        <NavItem to="/deliveries" icon={<Truck />} isCollapsed={isCollapsed}>Deliveries</NavItem>

        <p className={cn("text-xs text-slate-500 uppercase font-semibold mt-3 mb-1", isCollapsed ? "text-center" : "px-3")}>Management</p>
        <NavItem to="/users" icon={<Users />} isCollapsed={isCollapsed}>User Management</NavItem>
        <NavItem to="/reports" icon={<LineChart />} isCollapsed={isCollapsed}>Reports</NavItem>
        <NavItem to="/settings" icon={<Cog />} isCollapsed={isCollapsed}>Settings</NavItem>
      </div>
      
      <div className="p-4 border-t border-slate-700">
        <Button 
          variant="ghost" 
          onClick={toggleSidebar} 
          className="w-full flex items-center justify-center text-gray-400 hover:bg-slate-700/50 hover:text-white mb-2"
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          {!isCollapsed && <span className="ml-2">Collapse</span>}
        </Button>
        <Button 
          variant="ghost" 
          onClick={handleDirectLogout} 
          className="w-full flex items-center text-red-400 hover:bg-red-700/20 hover:text-red-300"
        >
          <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
  