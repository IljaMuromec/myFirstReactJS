import React from "react";

const Dropdown = ({ setFrom, setTo, setField, from, to, field }) => {
  return (
    <div className="d-flex align-items-start">
      <select
        defaultValue={"DEFAULT"}
        className="form-select dropdown"
        aria-label="Default select example"
        onChange={(event) => {
          setField(event.target.value);
        }}
      >
        <option value="DEFAULT" disabled>
          Фильтровать по полю...
        </option>
        <option value="cases">Кол-во случаев</option>
        <option value="deaths">Кол-во смертей</option>
        <option value="totalCases">Кол-во случаев всего</option>
        <option value="totalDeaths">Кол-во смертей всего</option>
        <option value="casesPer1000">Кол-во случаев на 1000 ж...</option>
        <option value="deathsPer1000">Кол-во смертей на 1000 ж...</option>
      </select>

      <div className="filterForm">
        <input
          type="number"
          id="form1"
          className="form-control"
          placeholder="От:"
          aria-label="Search"
          value={from || ""}
          onChange={(event) => {
            setFrom(parseInt(event.target.value));
          }}
        />
      </div>

      <div className="filterForm">
        <input
          type="number"
          id="form1"
          className="form-control"
          placeholder="До:"
          aria-label="Search"
          value={to || ""}
          onChange={(event) => {
            setTo(parseInt(event.target.value));
          }}
        />
      </div>
    </div>
  );
};

export default Dropdown;
