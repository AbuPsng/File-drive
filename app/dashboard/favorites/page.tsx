"use client";

import FileBrowser from "../_components/FileBrowser";

const FavoritesPage = () => {
  return (
    <div>
      <FileBrowser title={"Favorites"} favorites={true} />
    </div>
  );
};

export default FavoritesPage;
