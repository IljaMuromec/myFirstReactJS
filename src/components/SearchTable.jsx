import React from "react";

const SearchTable = ({ setSearchTerm, searchTerm }) => {
  return (
    <div>
      <div className="form-outline">
        <input
          type="search"
          id="form1"
          className="form-control"
          placeholder="Поиск страны..."
          aria-label="Search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchTable;
