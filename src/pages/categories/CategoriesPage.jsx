
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, PlusCircle, Edit, Trash2, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog.jsx";
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  // Function to fetch categories from the backend API
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      // Get authentication token
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Fetch categories from the backend API
      const response = await fetch('http://localhost:5000/api/categories', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }

      const data = await response.json();
      console.log('Categories from API:', data);

      // Transform the data to match the expected format
      if (data && data.data) {
        const formattedCategories = data.data.map(c => ({
          id: c._id,
          name: c.name,
          description: c.description || '',
          productCount: c.productCount || 0
        }));
        setCategories(formattedCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error Loading Categories",
        description: "Could not load categories from the server. Using fallback data.",
        variant: "destructive"
      });
      
      // Fallback to hardcoded categories if API fails
      const fallbackCategories = [
        { id: 'cat1', name: 'Electronics', description: 'Gadgets, devices, and accessories', productCount: 120 },
        { id: 'cat2', name: 'Books', description: 'Fiction, non-fiction, educational', productCount: 350 },
        { id: 'cat3', name: 'Clothing', description: 'Apparel for men, women, and children', productCount: 500 },
        { id: 'cat4', name: 'Home & Kitchen', description: 'Appliances, decor, and kitchenware', productCount: 250 },
      ];
      setCategories(fallbackCategories);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddOrUpdateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast({ title: "Error", description: "Category name cannot be empty.", variant: "destructive" });
      return;
    }

    try {
      // Get authentication token
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast({ title: "Error", description: "Authentication required. Please log in.", variant: "destructive" });
        return;
      }

      if (editingCategory) {
        // Update existing category
        const response = await fetch(`http://localhost:5000/api/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: newCategoryName,
            description: newCategoryDescription
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update category');
        }

        toast({ title: "Success", description: `Category "${newCategoryName}" updated.` });
      } else {
        // Create new category
        const response = await fetch('http://localhost:5000/api/categories', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: newCategoryName,
            description: newCategoryDescription
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create category');
        }

        toast({ title: "Success", description: `Category "${newCategoryName}" added.` });
      }
      
      // Refresh categories from the server
      await fetchCategories();
      resetForm();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save category. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setNewCategoryDescription(category.description);
    setIsFormOpen(true);
  };

  const handleDelete = async (categoryId) => {
    try {
      // Get authentication token
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast({ title: "Error", description: "Authentication required. Please log in.", variant: "destructive" });
        return;
      }

      // Delete category from the backend
      const response = await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete category');
      }

      toast({ title: "Success", description: "Category deleted.", variant: "destructive" });
      
      // Refresh categories from the server
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete category. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const resetForm = () => {
    setNewCategoryName('');
    setNewCategoryDescription('');
    setEditingCategory(null);
    setIsFormOpen(false);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><Layers className="h-10 w-10 animate-spin text-sky-500" /></div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-6 bg-slate-800/50 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent flex items-center">
          <Layers className="mr-3 h-8 w-8" /> Product Categories
        </h1>
        <Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if (!isOpen) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md">
              <PlusCircle className="mr-2 h-5 w-5" /> {editingCategory ? 'Edit Category' : 'Add New Category'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-slate-800 border-slate-700 text-gray-200">
            <DialogHeader>
              <DialogTitle className="text-sky-400">{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
              <DialogDescription className="text-gray-400">
                {editingCategory ? 'Update the details for this category.' : 'Enter details for the new product category.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddOrUpdateCategory} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right text-gray-300">Name</Label>
                <Input id="name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="col-span-3 bg-slate-700 border-slate-600 focus:border-sky-500 text-white" placeholder="e.g., Electronics" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right text-gray-300">Description</Label>
                <Input id="description" value={newCategoryDescription} onChange={(e) => setNewCategoryDescription(e.target.value)} className="col-span-3 bg-slate-700 border-slate-600 focus:border-sky-500 text-white" placeholder="Optional description" />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm} className="text-gray-300 border-slate-600 hover:bg-slate-700">Cancel</Button>
                <Button type="submit" className="bg-sky-500 hover:bg-sky-600 text-white">{editingCategory ? 'Save Changes' : 'Add Category'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <AnimatePresence>
        {categories.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-slate-800/70 border-slate-700 hover:shadow-sky-500/20 transition-shadow duration-300 flex flex-col h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-400">{category.name}</CardTitle>
                      <div className="flex space-x-1">
                        <Button onClick={() => handleEdit(category)} variant="ghost" size="icon" className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/30 h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-900/30 h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-slate-800 border-slate-700 text-gray-200">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-red-400">Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-400">
                                This action cannot be undone. This will permanently delete the category "{category.name}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="text-gray-300 border-slate-600 hover:bg-slate-700">Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(category.id)} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <CardDescription className="text-gray-400 pt-1">{category.description || 'No description available.'}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-gray-500">Products in category: <span className="font-semibold text-sky-400">{category.productCount}</span></p>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-slate-700">
                     <p className="text-xs text-gray-500">ID: {category.id}</p>
                   </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-slate-800/50 rounded-xl shadow-xl"
          >
            <Layers className="h-20 w-20 text-sky-400 mx-auto mb-6 animate-pulse" />
            <h2 className="text-2xl font-semibold text-gray-200 mb-2">No Categories Found</h2>
            <p className="text-gray-400 mb-6">
              Start by adding your first product category to organize your inventory.
            </p>
            <Button onClick={() => setIsFormOpen(true)} className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg">
              <PlusCircle className="mr-2 h-5 w-5" /> Add First Category
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CategoriesPage;
  