import React, { useEffect, useState, useCallback, useMemo } from "react";
import "./styles/App.css";
import axios from "axios";
import TableWithData from "./components/TableWithData";
import Loader from "./components/Loader";
import SwitchTableOnGraph from "./components/SwitchTableOnGraph";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Routes, Route } from "react-router-dom";
import Chart from "./components/Chart";

function App() {
  //for api
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(20);

  //date-picker
  const [startDate, setStartDate] = useState(new Date("2019-12-01"));
  const [endDate, setEndDate] = useState(new Date("2020-12-14"));

  const urlAPI =
    "https://opendata.ecdc.europa.eu/covid19/casedistribution/json/";

  useEffect(() => {
    axios
      .get(urlAPI)
      .then((res) => {
        setPosts(res.data.records);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //calculations
  const currentData = useMemo(() => {
    const currentD = posts.reduce((prev, current) => {
      const country = current.countriesAndTerritories;

      if (!prev[country]) {
        prev[country] = { allPosts: [], totalCases: 0, totalDeaths: 0 };
      }

      prev[country].push = {
        cases: current.cases,
        deaths: current.deaths,
        date: current.dateRep,
      };

      prev[country].totalCases += current.cases;
      prev[country].totalDeaths += current.deaths;

      return prev;
    }, []);

    Object.values(currentD).forEach((items) => {
      items.casesPer1000 = Math.round(items.totalCases / 1000);
      items.deathsPer1000 = Math.round(items.totalDeaths / 1000);
    });
    return currentD;
  }, [posts]);

  const mergeData = useCallback((data, parsedData) => {
    const res = data.map((el) => {
      const countryData = parsedData[el.countriesAndTerritories];

      return { ...el, ...countryData };
    });

    return res;
  }, []);

  const sortByDates = useMemo(() => {
    return posts.filter((item) => {
      const [day, month, year] = item.dateRep.split("/");
      const currentDate = new Date([year, month, day].join("-")).getTime();
      return currentDate >= startDate && currentDate <= endDate;
    });
  }, [startDate, endDate, posts]);

  return (
    <div className="container">
      <SwitchTableOnGraph />
      <div className="d-flex flex-row">
        <div className="p-2">
          <i>От:</i>
          <DatePicker
            className="dateBorder"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
        </div>
        <div className="p-2">
          <i>До:</i>
          <DatePicker
            className="dateBorder"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
          />
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <TableWithData
                currentData={currentData}
                posts={sortByDates}
                mergeData={mergeData}
                postsPerPage={postsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                setPosts={setPosts}
              />
            }
          />
          <Route
            path="/chart"
            element={
              <Chart
                posts={sortByDates}
                startDate={startDate}
                endDate={endDate}
              />
            }
          />
        </Routes>
      )}
    </div>
  );
}

export default App;
