import { useState, useEffect } from "react";
import { getFavourites, toggleFavourite } from "../services/shop.api";
import useAuth from "../../auth/hooks/useAuth";

const useFavourites = () => {
  const { isAuthenticated } = useAuth();
  const [favouriteIds, setFavouriteIds] = useState([]); // just IDs for fast lookup
  const [favourites,   setFavourites]   = useState([]); // full shop objects
  const [loading, setLoading]           = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getFavourites();
        setFavourites(data.favourites);
        setFavouriteIds(data.favourites.map(s => s._id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [isAuthenticated]);

  const handleToggle = async (shopId) => {
    try {
      const data = await toggleFavourite(shopId);
      setFavouriteIds(data.favourites.map(id => id.toString()));

      // update full list too
      if (data.isFavourite) {
        // will be refreshed on FavouritesPage mount
      } else {
        setFavourites(prev => prev.filter(s => s._id !== shopId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isFavourite = (shopId) => favouriteIds.includes(shopId);

  return { favourites, favouriteIds, loading, handleToggle, isFavourite };
};

export default useFavourites;