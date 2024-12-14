export default function Search() {
  return (
    <div className="search-bar">
      <input className="search" type="text" placeholder={`Search`} />
      <span className="material-icons-outlined">search</span>
      <span className="material-symbols-outlined">genres</span>
      <span className="material-icons-outlined">mic</span>
      <span className="material-icons-outlined">image</span>
    </div>
  );
}
