export default function Search() {
  return (
    <div className="search-bar">
      <input className="search" type="text" placeholder={`Search`} />
      <span className="material-icons-outlined">
        <img src="../../public/search_i.png" />
      </span>
      <span className="material-symbols-outlined">
        <img src="../../public/genres_i.png" />
      </span>
      <span className="material-icons-outlined">
        <img src="../../public/mic_i.png" />
      </span>
      <span className="material-icons-outlined">
        <img src="../../public/image_i.png" />
      </span>
    </div>
  );
}
