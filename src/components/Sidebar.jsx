import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, Package, Layers, ShoppingCart, Truck, Users, BarChart2, Settings, LogOut, 
  ChevronLeft, ChevronRight, PackagePlus, FileText, Building, FilePlus, Users2, LineChart, Cog, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const NavItem = ({ to, children, icon, isCollapsed, exact = true }) => (
  <NavLink
    to={to}
    end={exact}
    className={({ isActive }) =>
      cn(
        'flex items-center px-3 py-2 rounded-md text-xs tracking-wide font-medium transition-colors group',
        isActive 
          ? 'bg-[#1b221d] text-[#f4f1ea] border-l-2 border-[#c5a059] font-semibold' 
          : 'text-[#9e9a8f] hover:bg-[#151a17] hover:text-[#f4f1ea]',
        isCollapsed ? 'justify-center' : ''
      )
    }
  >
    {React.cloneElement(icon, { 
      className: cn("h-4 w-4 shrink-0 transition-colors group-hover:text-[#c5a059]", !isCollapsed && "mr-3") 
    })}
    {!isCollapsed && <span className="truncate">{children}</span>}
  </NavLink>
);

const Sidebar = ({ onLogout }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const userRole = (currentUser?.role || 'Manager').toLowerCase();

  const isAdmin = userRole.includes('admin');
  const isManager = userRole.includes('manager') || isAdmin;
  const isStaff = userRole.includes('staff') || isAdmin;
  const isSupplier = userRole.includes('supplier');

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const handleDirectLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
      navigate('/login', { replace: true });
    }
  };

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-full bg-[#101412] border-r border-[#232b26] shadow-lg z-40 transition-all duration-200 ease-in-out pt-16 flex flex-col",
      isCollapsed ? "w-16" : "w-60"
    )}>
      <div className="flex-grow p-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#252e29] scrollbar-track-[#101412]">
        <NavItem to="/" icon={<Home />} isCollapsed={isCollapsed} exact={true}>Dashboard</NavItem>
        
        {/* Catalog: Available to Admin, Manager, and Supplier */}
        {(isAdmin || isManager || isSupplier) && (
          <>
            <p className={cn("text-[10px] text-[#6b675e] uppercase font-bold tracking-wider mt-4 mb-1", isCollapsed ? "text-center" : "px-3")}>Catalog</p>
            <NavItem to="/products" icon={<Package />} isCollapsed={isCollapsed}>Products</NavItem>
            {isManager && <NavItem to="/products/new" icon={<PackagePlus />} isCollapsed={isCollapsed}>Add Product</NavItem>}
            {isManager && <NavItem to="/categories" icon={<Layers />} isCollapsed={isCollapsed}>Categories</NavItem>}
          </>
        )}

        {/* Vault Storage: Available to Admin, Manager, and Staff (Hidden from Supplier) */}
        {(isAdmin || isManager || isStaff) && !isSupplier && (
          <>
            <p className={cn("text-[10px] text-[#6b675e] uppercase font-bold tracking-wider mt-4 mb-1", isCollapsed ? "text-center" : "px-3")}>Storage</p>
            <NavItem to="/inventory" icon={<BarChart2 />} isCollapsed={isCollapsed}>Stock Control</NavItem>
            <NavItem to="/inventory/warehouses" icon={<Building />} isCollapsed={isCollapsed}>Warehouses</NavItem>
            <NavItem to="/inventory/transfers" icon={<Truck />} isCollapsed={isCollapsed}>Transfers</NavItem>
          </>
        )}

        {/* Orders & Procurement: Available to Admin and Manager */}
        {(isAdmin || isManager) && (
          <>
            <p className={cn("text-[10px] text-[#6b675e] uppercase font-bold tracking-wider mt-4 mb-1", isCollapsed ? "text-center" : "px-3")}>Client Orders</p>
            <NavItem to="/orders" icon={<ShoppingCart />} isCollapsed={isCollapsed}>Orders Ledger</NavItem>
            <NavItem to="/orders/new" icon={<FileText />} isCollapsed={isCollapsed}>Create Order</NavItem>
          </>
        )}

        {/* Procurement & Deliveries */}
        {(isAdmin || isManager || isSupplier || isStaff) && (
          <>
            <p className={cn("text-[10px] text-[#6b675e] uppercase font-bold tracking-wider mt-4 mb-1", isCollapsed ? "text-center" : "px-3")}>Procurement</p>
            {(isAdmin || isManager) && <NavItem to="/suppliers" icon={<Users2 />} isCollapsed={isCollapsed}>Suppliers</NavItem>}
            {(isAdmin || isManager || isSupplier) && <NavItem to="/purchase-orders" icon={<FilePlus />} isCollapsed={isCollapsed}>Purchase Orders</NavItem>}
            <NavItem to="/deliveries" icon={<Truck />} isCollapsed={isCollapsed}>Deliveries</NavItem>
          </>
        )}

        {/* Administration: Admin and Manager */}
        {(isAdmin || isManager) && (
          <>
            <p className={cn("text-[10px] text-[#6b675e] uppercase font-bold tracking-wider mt-4 mb-1", isCollapsed ? "text-center" : "px-3")}>Administration</p>
            {isAdmin && <NavItem to="/users" icon={<Users />} isCollapsed={isCollapsed}>User Accounts</NavItem>}
            <NavItem to="/reports" icon={<LineChart />} isCollapsed={isCollapsed}>Reports & Audits</NavItem>
            <NavItem to="/settings" icon={<Cog />} isCollapsed={isCollapsed}>Settings</NavItem>
          </>
        )}
      </div>
      
      <div className="p-3 border-t border-[#1f2621] bg-[#0c100e]">
        <div className="px-2.5 py-1 mb-2 rounded bg-[#141916] border border-[#232b26] flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#c5a059] uppercase font-semibold">{currentUser?.role || 'Staff'}</span>
          <Shield className="h-3 w-3 text-[#5ea378]" />
        </div>
        <Button 
          variant="ghost" 
          onClick={toggleSidebar} 
          className="w-full flex items-center justify-center text-[#9e9a8f] hover:bg-[#151a17] hover:text-[#f4f1ea] mb-1 h-8 text-xs"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!isCollapsed && <span className="ml-2">Minimize</span>}
        </Button>
        <Button 
          variant="ghost" 
          onClick={handleDirectLogout} 
          className="w-full flex items-center text-red-400/90 hover:bg-red-950/30 hover:text-red-300 h-8 text-xs"
        >
          <LogOut className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
          {!isCollapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;