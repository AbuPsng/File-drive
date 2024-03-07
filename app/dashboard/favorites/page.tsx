"use client";

import FileBrowser from "../_components/FileBrowser";

const FavoritesPage = () => {
  return (
    <div>
      <FileBrowser title={"Favorites"} filterForFavorite={true} />
    </div>
  );
};

export default FavoritesPage;
