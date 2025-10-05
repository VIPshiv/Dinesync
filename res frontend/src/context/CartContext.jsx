import { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // aggregated cart items: {id,name,price,image,quantity}
  const [lastAddedName, setLastAddedName] = useState(null);
  const [lastAddedId, setLastAddedId] = useState(null);

  // Hydrate from localStorage once (with migration from previous line-based model)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart_items');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Migration: if entries have lineId, collapse by product id
          const aggregated = {};
          parsed.forEach(entry => {
            const productId = entry.id || entry._id || entry.productId;
            if (!productId) return;
            if (!aggregated[productId]) {
              aggregated[productId] = {
                id: productId,
                name: entry.name,
                price: entry.price,
                image: entry.image,
                quantity: entry.quantity && entry.quantity > 0 ? entry.quantity : 1
              };
            } else {
              aggregated[productId].quantity += entry.quantity && entry.quantity > 0 ? entry.quantity : 1;
            }
          });
          const migrated = Object.values(aggregated);
          setItems(migrated);
          if (migrated.length !== parsed.length) {
            console.log('[cart] migrated line-based storage -> aggregated');
          }
        }
      }
    } catch (e) {
      console.warn('[cart] failed to parse stored cart', e);
    }
  }, []);

  // Persist on change
  useEffect(() => {
    try { localStorage.setItem('cart_items', JSON.stringify(items)); } catch { /* ignore */ }
  }, [items]);

  const addItem = useCallback((item) => {
    if (!item) return;
    setItems(prev => {
      let normId = item.id || item._id;
      if (!normId) {
        const base = (item.name || 'item').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        normId = `${base}-${item.price}`;
      }
      // If an id collision occurs but the names differ, create a derived id so both can coexist
      const collisionIdx = prev.findIndex(p => p.id === normId);
      if (collisionIdx !== -1 && prev[collisionIdx].name !== item.name) {
        const altSuffix = (item.name || 'var').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        normId = `${normId}-${altSuffix}`;
        console.warn('[cart] id collision detected; generated alternate id:', normId);
      }
      const existingIdx = prev.findIndex(p => p.id === normId);
      if (existingIdx !== -1) {
        const copy = [...prev];
        copy[existingIdx] = { ...copy[existingIdx], quantity: copy[existingIdx].quantity + 1 };
        console.log('[cart] inc', normId, copy[existingIdx]);
        setLastAddedName(item.name);
        setLastAddedId(normId);
        return copy;
      }
      const created = { id: normId, name: item.name, price: item.price, image: item.image, quantity: 1 };
      const next = [...prev, created];
      console.log('[cart] add', normId, created, 'cart now:', next);
      setLastAddedName(item.name);
      setLastAddedId(normId);
      return next;
    });
  }, []);

  const decrementItem = useCallback((id) => {
    setItems(prev => prev.flatMap(p => {
      if (p.id !== id) return [p];
      if (p.quantity <= 1) return []; // remove item if reaches 0/1
      return [{ ...p, quantity: p.quantity - 1 }];
    }));
  }, []);

  const removeItem = useCallback((id) => {
    setItems(prev => prev.filter(p => p.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = useMemo(() => items.reduce((sum, it) => sum + it.price * it.quantity, 0), [items]);
  const count = useMemo(() => items.reduce((sum, it) => sum + it.quantity, 0), [items]);

  const clearLastAdded = useCallback(() => { setLastAddedName(null); setLastAddedId(null); }, []);

  const value = useMemo(() => ({ items, addItem, decrementItem, removeItem, clearCart, total, count, lastAddedName, lastAddedId, clearLastAdded }), [items, addItem, decrementItem, removeItem, clearCart, total, count, lastAddedName, lastAddedId, clearLastAdded]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() { return useContext(CartContext); }
