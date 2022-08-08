import React, { useMemo } from "react";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Chart = ({ posts, startDate, endDate }) => {
  const [currentCountry, setCurrentCountry] = useState("");

  const countries = useMemo(() => {
    return Array.from(
      new Set(posts.map((item) => item.countriesAndTerritories))
    );
  }, [posts]);

  const sortDates = useMemo(() => {
    const data = {
      cases: [],
      deaths: [],
      dateRep: [],
    };

    posts.sort((a, b) => {
      const [day, month, year] = a.dateRep.split("/");
      const aDate = new Date([year, month, day].join("-")).getTime();

      const [day2, month2, year2] = b.dateRep.split("/");
      const bDate = new Date([year2, month2, day2].join("-")).getTime();

      return aDate - bDate;
    });

    if (currentCountry === "allCoutries") {
      Array.from(new Set(posts.map((item) => item.dateRep))).forEach((item) => {
        const countries = posts.filter((country) => country.dateRep === item);
        data.cases.push(countries.reduce((prev, curr) => prev + curr.cases, 0));
        data.deaths.push(
          countries.reduce((prev, curr) => prev + curr.deaths, 0)
        );
        data.dateRep.push(item);
      });

      return data;
    }

    posts
      .filter((item) => item.countriesAndTerritories === currentCountry)
      .forEach((item) => {
        data.cases.push(item.cases);
        data.deaths.push(item.deaths);
        data.dateRep.push(item.dateRep);
      });

    return data;
  }, [posts, currentCountry]);

  const data = useMemo(
    () => ({
      labels: sortDates.dateRep,
      datasets: [
        {
          label: "Случаи",
          data: sortDates.cases,
          borderColor: "rgb(153, 153, 0)",
          backgroundColor: "rgba(153, 153, 0, 0.5)",
        },
        {
          label: "Смерти",
          data: sortDates.deaths,
          borderColor: "rgb(139, 0, 0)",
          backgroundColor: "rgba(139, 0, 0, 0.5)",
        },
      ],
    }),
    [sortDates]
  );

  return (
    <div>
      <select
        defaultValue={"DEFAULT"}
        className="form-select dropdown"
        aria-label="Default select example"
        onChange={(e) => setCurrentCountry(e.target.value)}
      >
        <option value="DEFAULT" disabled>
          Выберите страну...
        </option>
        <option value="allCoutries">Все страны</option>

        {countries.map((item) => (
          <option value={item} key={item}>
            {item}
          </option>
        ))}
      </select>
      <Line data={data} />
    </div>
  );
};

export default Chart;
