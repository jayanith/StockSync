import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Layers, PlusCircle, Search, Trash2, Tag, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getCategories, createCategory, deleteCategory } from '@/lib/api';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await getCategories();
      if (res && res.data) {
        setCategories(res.data);
      }
    } catch (e) {
      console.error('Error fetching categories:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({ title: "Validation Error", description: "Category name is required.", variant: "destructive" });
      return;
    }

    try {
      await createCategory({ name: name.trim(), description: description.trim() });
      toast({ title: "Category Created", description: `${name} saved to MySQL.` });
      setIsCreateOpen(false);
      setName('');
      setDescription('');
      fetchCategories();
    } catch (err) {
      toast({ title: "Error", description: err.message || "Failed to create category.", variant: "destructive" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      setCategories(prev => prev.filter(c => (c.id || c._id) !== id));
      toast({ title: "Category Deleted", description: "Category removed from database." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to delete category.", variant: "destructive" });
    }
  };

  const filtered = categories.filter(c => (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 old-money-card border-[#2e4034] rounded-xl shadow-xl">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">Catalog Structure</span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#f8f6f0] mt-1 flex items-center">
            <Layers className="mr-3 h-7 w-7 text-[#c5a059]" /> Item Categories
          </h1>
          <p className="text-xs text-[#9ea8a1] mt-0.5">Classification hierarchies for luxury assets and catalog lines</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="old-money-gold-btn text-xs uppercase tracking-wider py-2 px-4 shadow-lg">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#111914] border-[#36493e] text-[#f4efe6] max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl text-[#f8f6f0]">Create New Category</DialogTitle>
              <DialogDescription className="text-xs text-[#9ea8a1]">Define classification name and scope.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-2">
              <div>
                <Label className="text-xs uppercase tracking-wider text-[#c5a059]">Category Name *</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Fine Watches & Timepieces" className="mt-1 bg-[#141f18] border-[#2c3d32] text-[#f4efe6]" />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider text-[#9ea8a1]">Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detailed description of classification scope..." className="mt-1 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] min-h-[80px]" />
              </div>
              <DialogFooter className="pt-4 border-t border-[#202f25]">
                <Button type="submit" className="old-money-gold-btn text-xs uppercase tracking-wider w-full">
                  Save Category
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="old-money-card border-[#2e4034] rounded-xl">
        <CardHeader className="p-5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#c5a059]" />
            <Input 
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059] text-xs h-11"
            />
          </div>
        </CardHeader>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Layers className="h-10 w-10 animate-spin text-[#c5a059]" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.length > 0 ? (
            filtered.map((cat, idx) => {
              const cid = cat.id || cat._id || idx + 1;
              return (
                <Card key={cid} className="old-money-card border-[#2c3e33] hover:border-[#c5a059]/60 transition-all rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="h-4 w-4 text-[#c5a059]" />
                      <h3 className="font-serif font-semibold text-lg text-[#f8f6f0]">{cat.name}</h3>
                    </div>
                    <p className="text-xs text-[#9ea8a1] line-clamp-3">
                      {cat.description || 'General catalog classification.'}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#1e2c22] mt-4 flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(cid)} 
                      className="h-8 text-xs text-red-400 hover:bg-red-950/40 hover:text-red-300"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                    </Button>
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-16 old-money-card border-[#2e4034] rounded-xl">
              <Layers className="h-12 w-12 text-[#c5a059] mx-auto mb-3 opacity-80" />
              <p className="text-xs text-[#9ea8a1]">No categories found in database.</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default CategoriesPage;