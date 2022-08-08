import React from "react";
import { Link } from "react-router-dom";

const SwitchTableOnGraph = () => {
  return (
    <div>
      <div className="changePage">
        <Link to="/" className="btn btn-outline-danger">
          Таблица
        </Link>
        <Link to="/chart" className="btn btn-outline-secondary">
          График
        </Link>
      </div>
    </div>
  );
};

export default SwitchTableOnGraph;
