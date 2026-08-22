import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Users2, ArrowLeft, Mail, Phone, MapPin, Globe, Package, FilePlus } from 'lucide-react';
import { getSupplier, getSupplierProducts } from '@/lib/api';

const SupplierDetailsPage = () => {
  const { supplierId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [supplier, setSupplier] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const supRes = await getSupplier(supplierId);
        if (supRes && supRes.data) {
          setSupplier(supRes.data);
        }
        const prodRes = await getSupplierProducts(supplierId);
        if (prodRes && prodRes.data) {
          setProducts(prodRes.data);
        }
      } catch (e) {
        console.error('Error fetching supplier details:', e);
        toast({ title: "Notice", description: "Failed to load supplier profile." });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [supplierId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Users2 className="h-10 w-10 animate-spin text-[#c5a059]" />
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="text-center py-20 old-money-card border-[#2e4034] rounded-xl max-w-lg mx-auto">
        <h2 className="text-xl font-serif text-[#f8f6f0] mb-3">Supplier Not Found</h2>
        <Button onClick={() => navigate('/suppliers')} className="old-money-gold-btn text-xs uppercase tracking-wider">
          Return to Suppliers
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto space-y-6"
    >
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={() => navigate('/suppliers')} 
          className="text-[#c5a059] border-[#3a4d41] hover:bg-[#1f2e25] hover:text-[#f8f6f0]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Suppliers
        </Button>
        <Link to="/purchase-orders/new">
          <Button className="old-money-gold-btn text-xs uppercase tracking-wider py-2 px-4">
            <FilePlus className="mr-2 h-4 w-4" /> Create Purchase Order
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="old-money-card border-[#2e4034] rounded-xl shadow-xl">
            <CardHeader className="border-b border-[#202f25] p-6 bg-[#0f1712]/70">
              <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">Merchant Profile</span>
              <CardTitle className="text-2xl font-serif text-[#f8f6f0] mt-1">{supplier.name}</CardTitle>
              {supplier.contactPerson && (
                <CardDescription className="text-xs text-[#9ea8a1]">Principal Contact: {supplier.contactPerson}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs text-[#d8d3c5]">
              <div className="grid sm:grid-cols-2 gap-4">
                <p className="flex items-center"><Mail className="h-4 w-4 mr-2 text-[#c5a059]" /> {supplier.email}</p>
                <p className="flex items-center"><Phone className="h-4 w-4 mr-2 text-[#c5a059]" /> {supplier.phone}</p>
                {supplier.address && (
                  <p className="flex items-center sm:col-span-2"><MapPin className="h-4 w-4 mr-2 text-[#c5a059]" /> {supplier.address}</p>
                )}
                {supplier.website && (
                  <p className="flex items-center sm:col-span-2"><Globe className="h-4 w-4 mr-2 text-[#c5a059]" /> {supplier.website}</p>
                )}
              </div>
              {supplier.notes && (
                <div className="p-3.5 rounded-lg bg-[#111a14] border border-[#243328] mt-4">
                  <span className="text-[#c5a059] font-medium block mb-1">Contract Notes:</span>
                  {supplier.notes}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="old-money-card border-[#2e4034] rounded-xl shadow-xl">
            <CardHeader className="border-b border-[#202f25] p-5 bg-[#0f1712]/70">
              <CardTitle className="text-base font-serif text-[#f8f6f0] flex items-center">
                <Package className="mr-2 h-4 w-4 text-[#c5a059]" /> Products Supplied ({products.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              {products.length > 0 ? (
                <div className="divide-y divide-[#1e2c22]">
                  {products.map((p, idx) => (
                    <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-medium text-[#f8f6f0]">{p.name}</span>
                        <p className="text-[10px] text-[#718277]">SKU: {p.sku}</p>
                      </div>
                      <span className="font-serif text-[#c5a059] font-semibold">${Number(p.price || 0).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#9ea8a1] py-4 text-center">No catalog items assigned to this supplier yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="old-money-card border-[#2e4034] rounded-xl shadow-xl p-5 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#19271f] border border-[#c5a059]/40 text-[#c5a059] flex items-center justify-center mx-auto">
              <Users2 className="h-8 w-8" />
            </div>
            <div>
              <h4 className="font-serif font-semibold text-[#f8f6f0]">Procurement Status</h4>
              <span className="inline-block mt-1 px-3 py-1 rounded-full bg-[#173022] text-[#6ee7b7] border border-[#225039] text-xs">
                Active Supplier Guild
              </span>
            </div>
            <p className="text-xs text-[#9ea8a1]">
              Direct manufacturer contract synchronized with central database.
            </p>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default SupplierDetailsPage;