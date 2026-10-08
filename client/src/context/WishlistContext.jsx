import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, authStatus } = useAuth();

  const [guestWishlist, setGuestWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('herbal_guest_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [serverWishlist, setServerWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sync guest wishlist to localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      try {
        localStorage.setItem('herbal_guest_wishlist', JSON.stringify(guestWishlist));
      } catch (e) {
        console.error('Failed to save guest wishlist to localStorage', e);
      }
    }
  }, [guestWishlist, isAuthenticated]);

  const fetchServerWishlist = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const res = await wishlistService.getWishlist();
      setServerWishlist(res.data || []);
    } catch (err) {
      console.error('Failed to fetch server wishlist', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Handle Login Wishlist Merge
  const handleLoginWishlistMerge = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const savedGuest = localStorage.getItem('herbal_guest_wishlist');
      const guestItems = savedGuest ? JSON.parse(savedGuest) : [];

      if (guestItems && guestItems.length > 0) {
        const productIds = guestItems.map((item) => item._id || item.id);
        const res = await wishlistService.mergeWishlist(productIds);
        setServerWishlist(res.data || []);
        localStorage.removeItem('herbal_guest_wishlist');
        setGuestWishlist([]);
      } else {
        await fetchServerWishlist();
      }
    } catch (err) {
      console.error('Failed to merge guest wishlist', err);
      await fetchServerWishlist();
    }
  }, [isAuthenticated, fetchServerWishlist]);

  useEffect(() => {
    if (authStatus === 'AUTHENTICATED') {
      handleLoginWishlistMerge();
    } else if (authStatus === 'UNAUTHENTICATED') {
      setServerWishlist([]);
    }
  }, [authStatus, handleLoginWishlistMerge]);

  const activeWishlist = isAuthenticated ? serverWishlist : guestWishlist;

  const isInWishlist = (productId) => {
    return activeWishlist.some((item) => (item._id || item.id || item) === productId);
  };

  const toggleWishlist = async (product) => {
    const productId = product._id || product.id;

    if (isAuthenticated) {
      try {
        if (isInWishlist(productId)) {
          const res = await wishlistService.removeFromWishlist(productId);
          setServerWishlist(res.data || []);
          return false;
        } else {
          const res = await wishlistService.addToWishlist(productId);
          setServerWishlist(res.data || []);
          return true;
        }
      } catch (err) {
        console.error('Failed to toggle server wishlist', err);
      }
    } else {
      if (isInWishlist(productId)) {
        setGuestWishlist((prev) => prev.filter((item) => (item._id || item.id || item) !== productId));
        return false;
      } else {
        setGuestWishlist((prev) => [...prev, product]);
        return true;
      }
    }
  };

  const removeFromWishlist = async (productId) => {
    if (isAuthenticated) {
      try {
        const res = await wishlistService.removeFromWishlist(productId);
        setServerWishlist(res.data || []);
      } catch (err) {
        console.error('Failed to remove from server wishlist', err);
      }
    } else {
      setGuestWishlist((prev) => prev.filter((item) => (item._id || item.id || item) !== productId));
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems: activeWishlist,
        wishlistCount: activeWishlist.length,
        loading,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
