import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { Plus, Minus, Pencil, Trash2, X, Camera, ImagePlus, Utensils, Cookie, Coffee } from 'lucide-react';
import { Profile } from '@/model/profile.model';
import { notifyError, notifySuccess } from '@/lib/toast';
import Image from 'next/image';
import { initItemRequest, ItemRequest } from '@/model/item.model';
import { useMeal } from '@/hooks/use-meal';
import { useSnack } from '@/hooks/use-snack';
import { useDrink } from '@/hooks/use-drink';

type Category = 'meals' | 'snacks' | 'drinks';

export function ManageItem({ profile }: { profile: Profile | undefined }) {

    const meal = useMeal();
    const snack = useSnack();
    const drink = useDrink();

    const isPending = meal.isCreating || meal.isUpdating || meal.isDeleting ||
        snack.isCreating || snack.isUpdating || snack.isDeleting ||
        drink.isCreating || drink.isUpdating || drink.isDeleting;


    const [viewCategory, setViewCategory] = useState<Category>('meals');
    const [showForm, setShowForm] = useState(false);


    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);


    const [formCategory, setFormCategory] = useState<Category>('meals');
    const [formData, setFormData] = useState<ItemRequest>(initItemRequest);

    const currentItems = viewCategory === 'meals' ? meal.meals : viewCategory === 'snacks' ? snack.snacks : drink.drinks;

    const getActions = (cat: Category) => {
        if (cat === 'meals') return { create: meal.createMeal, update: meal.updateMeal, remove: meal.deleteMeal };
        if (cat === 'snacks') return { create: snack.createSnack, update: snack.updateSnack, remove: snack.deleteSnack };
        return { create: drink.createDrink, update: drink.updateDrink, remove: drink.deleteDrink };
    };

    const handleAddImage = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            notifyError("Image must be less than 2MB");
            return;
        }
        setImagePreview(URL.createObjectURL(file));
        setFormData(prev => ({ ...prev, image: file }));
    };

    const handleStockChange = async (item: any, delta: number) => {
        const { update } = getActions(viewCategory);
        const newStock = Math.max(0, item.stocks + delta);
        const request: ItemRequest = {
            name: item.name,
            price: item.price,
            stocks: newStock,
            image: item.image
        };
        update({ id: item.id, data: request });
    };

    const handleDelete = async () => {
        if (!deleteConfirm) return;
        const { remove } = getActions(viewCategory);
        remove(deleteConfirm, {
            onSuccess: () => setDeleteConfirm(null)
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { create, update } = getActions(formCategory);

        if (editingItem) {
            if (formCategory !== viewCategory) {
                const { remove: oldRemove } = getActions(viewCategory);
                oldRemove(editingItem.id, {
                    onSuccess: () => {
                        create(formData, {
                            onSuccess: closeForm
                        });
                    }
                });
            } else {
                update({ id: editingItem.id, data: formData }, {
                    onSuccess: closeForm
                });
            }
        } else {
            create(formData, {
                onSuccess: closeForm
            });
        }
    };

    const openEditForm = (item: any) => {
        setEditingItem(item);
        setFormCategory(viewCategory);
        setImagePreview(typeof item.image === 'string' ? item.image : null);
        setFormData({
            name: item.name,
            price: item.price,
            stocks: item.stocks,
            image: item.image
        });
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingItem(null);
        setImagePreview(null);
        setFormData(initItemRequest);
    };

    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold">Inventory Management</h2>
                    <p className="text-muted-foreground text-sm">Organize your stall items and track stock levels.</p>
                </div>
                <button
                    disabled={isPending}
                    onClick={() => {
                        setFormCategory(viewCategory);
                        setShowForm(true);
                    }}
                    className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus className="w-5 h-5" />
                    Add New Item
                </button>
            </div>

            <div className="flex border-b border-border mb-6">
                {(['meals', 'snacks', 'drinks'] as Category[]).map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setViewCategory(cat)}
                        className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-all capitalize font-medium ${viewCategory === cat ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {cat === 'meals' && <Utensils size={16} />}
                        {cat === 'snacks' && <Cookie size={16} />}
                        {cat === 'drinks' && <Coffee size={16} />}
                        {cat}
                    </button>
                ))}
            </div>

            <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-120">
                        <thead className="bg-secondary/20 text-muted-foreground text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 text-left font-semibold">Item Details</th>
                                <th className="px-6 py-4 text-left font-semibold">Price</th>
                                <th className="px-6 py-4 text-center font-semibold">Current Stock</th>
                                <th className="px-6 py-4 text-right font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {currentItems.map((item: any) => (
                                <tr key={item.id} className="hover:bg-secondary/10 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-secondary/30 relative overflow-hidden shrink-0">
                                                {item.image ? (
                                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full"><ImagePlus className="text-muted-foreground/30" /></div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold">{item.name}</div>
                                                <div className="text-xs text-muted-foreground">ID: #{item.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium">₱{item.price.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <button disabled={isPending} onClick={() => handleStockChange(item, -1)} className="p-1 rounded border border-border hover:bg-secondary transition-colors disabled:opacity-50"><Minus size={14} /></button>
                                            <span className={`w-8 text-center font-bold ${item.stocks < 5 ? 'text-red-500' : ''}`}>{item.stocks}</span>
                                            <button disabled={isPending} onClick={() => handleStockChange(item, 1)} className="p-1 rounded border border-border hover:bg-secondary transition-colors disabled:opacity-50"><Plus size={14} /></button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button disabled={isPending} onClick={() => openEditForm(item)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground transition-colors disabled:opacity-50"><Pencil size={18} /></button>
                                            <button disabled={isPending} onClick={() => setDeleteConfirm(item.id)} className="p-2 hover:bg-red-50 rounded-lg text-destructive transition-colors disabled:opacity-50"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL: Add/Edit Item */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-border">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-secondary/10">
                            <h3 className="text-lg font-bold">{editingItem ? 'Edit Item' : 'Create New Item'}</h3>
                            <button onClick={closeForm} className="p-2 hover:bg-secondary rounded-full"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Item Name</label>
                                    <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-border outline-none focus:ring-2 focus:ring-primary/20" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Price (₱)</label>
                                    <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))} className="w-full px-4 py-2 rounded-lg border border-border outline-none focus:ring-2 focus:ring-primary/20" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Stocks</label>
                                    <input type="number" value={formData.stocks} onChange={e => setFormData({ ...formData, stocks: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 rounded-lg border border-border outline-none focus:ring-2 focus:ring-primary/20" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Category</label>
                                    <select
                                        value={formCategory}
                                        onChange={(e) => setFormCategory(e.target.value as Category)}
                                        className="w-full px-4 py-2 rounded-lg border border-border bg-white outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                                    >
                                        <option value="meals">Meals</option>
                                        <option value="snacks">Snacks</option>
                                        <option value="drinks">Drinks</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold">Item Image</label>
                                <input type="file" ref={fileInputRef} className="hidden" onChange={handleAddImage} accept="image/*" />
                                <div onClick={() => fileInputRef.current?.click()} className="h-40 bg-secondary/30 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/50 transition-all overflow-hidden relative group">
                                    {imagePreview ? (
                                        <>
                                            <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Camera className="text-white" /></div>
                                        </>
                                    ) : (
                                        <>
                                            <ImagePlus className="text-muted-foreground mb-2" size={32} />
                                            <span className="text-xs text-muted-foreground">Click to upload (Max 2MB)</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button disabled={isPending} type="submit" className="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100">
                                    {isPending ? 'Processing...' : (editingItem ? 'Save Changes' : 'Add to Inventory')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: Delete Confirmation */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center border border-border">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Delete Item?</h3>
                        <p className="text-muted-foreground mb-6">This action cannot be undone. Are you sure you want to remove this item?</p>
                        <div className="flex gap-3">
                            <button disabled={isPending} onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 border border-border rounded-xl font-bold hover:bg-secondary transition-colors disabled:opacity-50">Cancel</button>
                            <button disabled={isPending} onClick={handleDelete} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50">
                                {isPending ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
