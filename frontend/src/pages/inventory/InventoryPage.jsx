import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { BarChartBig, Search, Filter, ArrowRightLeft, PackagePlus, AlertTriangle, CheckCircle } from 'lucide-react';
import { getProducts } from '@/lib/api';

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchStock = async () => {
      setIsLoading(true);
      try {
        const res = await getProducts();
        if (res && res.data) {
          setProducts(res.data);
        }
      } catch (e) {
        console.error('Error fetching inventory:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStock();
  }, []);

  const totalUnits = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const totalValuation = products.reduce((sum, p) => sum + ((p.quantity || 0) * (p.price || 0)), 0);
  const lowStockCount = products.filter(p => (p.quantity || 0) < 10).length;

  const filtered = products.filter(p => {
    const pName = p.name || '';
    const pSku = p.sku || '';
    return pName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           pSku.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 old-money-card border-[#2e4034] rounded-xl shadow-xl">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">Stock Governance</span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#f8f6f0] mt-1 flex items-center">
            <BarChartBig className="mr-3 h-7 w-7 text-[#c5a059]" /> Central Inventory Audit
          </h1>
          <p className="text-xs text-[#9ea8a1] mt-0.5">Real-time valuation and distribution of catalog inventory</p>
        </div>
        <div className="flex gap-3">
          <Link to="/inventory/transfers">
            <Button variant="outline" className="text-[#c5a059] border-[#36493e] hover:bg-[#19271f] hover:text-[#f8f6f0] text-xs uppercase tracking-wider py-2 px-4">
              <ArrowRightLeft className="mr-2 h-4 w-4" /> Transfer Stock
            </Button>
          </Link>
          <Link to="/products/new">
            <Button className="old-money-gold-btn text-xs uppercase tracking-wider py-2 px-4 shadow-lg">
              <PackagePlus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <Card className="old-money-card border-[#2e4034] p-5 rounded-xl">
          <span className="text-xs uppercase tracking-wider text-[#9ea8a1]">Total Units In Depots</span>
          <div className="text-2xl font-serif font-bold text-[#f8f6f0] mt-1">{totalUnits} units</div>
          <span className="text-[11px] text-[#718277]">Across all facility vaults</span>
        </Card>

        <Card className="old-money-card border-[#2e4034] p-5 rounded-xl">
          <span className="text-xs uppercase tracking-wider text-[#9ea8a1]">Cumulative Stock Valuation</span>
          <div className="text-2xl font-serif font-bold text-[#c5a059] mt-1">${totalValuation.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          <span className="text-[11px] text-[#718277]">Based on current retail pricing</span>
        </Card>

        <Card className="old-money-card border-[#2e4034] p-5 rounded-xl">
          <span className="text-xs uppercase tracking-wider text-[#9ea8a1]">Low Stock Alerts</span>
          <div className="text-2xl font-serif font-bold text-[#fca5a5] mt-1">{lowStockCount} items</div>
          <span className="text-[11px] text-[#718277]">Units below minimum threshold (&lt; 10)</span>
        </Card>
      </div>

      <Card className="old-money-card border-[#2e4034] rounded-xl">
        <CardHeader className="p-5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#c5a059]" />
            <Input 
              type="text"
              placeholder="Filter stock by product name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059] text-xs h-11"
            />
          </div>
        </CardHeader>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <BarChartBig className="h-10 w-10 animate-spin text-[#c5a059]" />
        </div>
      ) : (
        <Card className="old-money-card border-[#2e4034] rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-[#d8d3c5]">
              <thead className="text-[11px] uppercase tracking-wider text-[#9ea8a1] bg-[#121b16] border-b border-[#202f25]">
                <tr>
                  <th className="px-6 py-4 font-semibold">SKU</th>
                  <th className="px-6 py-4 font-semibold">Product Name</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 text-center font-semibold">Available Units</th>
                  <th className="px-6 py-4 text-right font-semibold">Unit Price</th>
                  <th className="px-6 py-4 text-right font-semibold">Total Asset Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b2820]">
                {filtered.length > 0 ? (
                  filtered.map((p, idx) => {
                    const catName = typeof p.category === 'string' ? p.category : (p.category?.name || 'Unclassified');
                    const qty = p.quantity || 0;
                    const val = qty * (p.price || 0);

                    return (
                      <tr key={p.id || p._id || idx} className="hover:bg-[#16211a]/70 transition-colors">
                        <td className="px-6 py-4 font-mono font-medium text-[#f8f6f0]">{p.sku}</td>
                        <td className="px-6 py-4 font-medium text-[#e5dec9]">{p.name}</td>
                        <td className="px-6 py-4 text-[#9ea8a1]">{catName}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2.5 py-0.5 rounded font-mono font-semibold text-xs ${
                            qty > 10 ? 'bg-[#15271d] text-[#6ee7b7] border border-[#234734]' : 'bg-[#331b1b] text-[#fca5a5] border border-[#522525]'
                          }`}>
                            {qty}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-serif text-[#c5a059] font-medium">
                          ${Number(p.price || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right font-serif text-[#f8f6f0] font-semibold">
                          ${val.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-[#9ea8a1]">
                      No inventory records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </motion.div>
  );
};

export default InventoryPage;