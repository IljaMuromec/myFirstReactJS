import React, { useState, useMemo, useCallback } from "react";
import ArrowBottom from "../svg/ArrowBottom";
import ArrowTop from "../svg/ArrowTop";
import SearchTable from "./SearchTable";
import Pagination from "./Pagination";
import Dropdown from "./Dropdown";

const TableWithData = ({
  currentData,
  mergeData,
  posts,
  postsPerPage,
  currentPage,
  setCurrentPage,
  setPosts,
}) => {
  const response = useMemo(
    () => mergeData(posts, currentData),
    [posts, currentData, mergeData]
  );

  //Search filter
  const [searchTerm, setSearchTerm] = useState("");
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [field, setField] = useState("");

  const filter = useMemo(() => {
    let filteredData = response;

    if (!searchTerm) {
      filteredData = response;
    } else {
      filteredData = response.filter((item) => {
        return item?.countriesAndTerritories
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
    }

    if (!field || !field.length || (!from && !to)) {
      return filteredData;
    } else if (from && to) {
      filteredData = filteredData.filter((item) => {
        return item[field] >= from && item[field] <= to;
      });
    } else if (from) {
      filteredData = filteredData.filter((item) => {
        return item[field] >= from;
      });
    } else {
      filteredData = filteredData.filter((item) => {
        return item[field] <= to;
      });
    }

    return filteredData;
  }, [field, from, response, searchTerm, to]);

  //clear filter
  const clearFilter = () => {
    setSearchTerm("");
    setFrom(0);
    setTo(0);
    setField("");
  };

  //Sort
  const [directionSort, setDirectionSort] = useState("ASC");

  const sortedData = useCallback(
    (field) => {
      const datasToSort = mergeData(posts, currentData);

      if (directionSort === "DSC") {
        const sorted = datasToSort.sort((a, b) => {
          return a[field] < b[field] ? -1 : 1;
        });
        setPosts(sorted);
        setDirectionSort("ASC");
      } else if (directionSort === "ASC") {
        const sorted = datasToSort.sort((a, b) => {
          return a[field] > b[field] ? -1 : 1;
        });
        setPosts(sorted);
        setDirectionSort("DSC");
      }
    },
    [directionSort, posts, currentData, mergeData, setPosts]
  );

  const [fieldData, setFieldData] = useState("");
  const fieldSortData = (field) => {
    sortedData(field);
    setFieldData(field);
  };

  //Component for showing arrow when sort button has clicked
  const ShowArrow = () => {
    return directionSort === "DSC" ? <ArrowBottom /> : <ArrowTop />;
  };

  //Slice page
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = useMemo(() => {
    if (!filter.length) return [];
    const array = [];
    for (let i = indexOfFirstPost; i < indexOfLastPost; i++) {
      array.push(filter[i]);
    }
    return array;
  }, [filter, indexOfFirstPost, indexOfLastPost]);

  return (
    <div>
      <div className="buttonContainer d-flex align-items-start">
        <SearchTable setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
        <Dropdown
          setFrom={setFrom}
          setTo={setTo}
          setField={setField}
          from={from}
          to={to}
          field={field}
        />
        <div className="dropFilter">
          <button
            type="button"
            className="btn btn-dark"
            onClick={() => {
              clearFilter();
            }}
          >
            Сбросить фильтры!
          </button>
        </div>
      </div>
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th
              scope="col"
              onClick={() => {
                fieldSortData("countriesAndTerritories");
              }}
            >
              Страна
              {fieldData === "countriesAndTerritories" ? <ShowArrow /> : null}
            </th>
            <th
              scope="col"
              onClick={() => {
                fieldSortData("cases");
              }}
            >
              Количество случаев{fieldData === "cases" ? <ShowArrow /> : null}
            </th>
            <th
              scope="col"
              onClick={() => {
                fieldSortData("deaths");
              }}
            >
              Количество смертей{fieldData === "deaths" ? <ShowArrow /> : null}
            </th>
            <th
              scope="col"
              onClick={() => {
                fieldSortData("totalCases");
              }}
            >
              Количество случаев всего
              {fieldData === "totalCases" ? <ShowArrow /> : null}
            </th>
            <th
              scope="col"
              onClick={() => {
                fieldSortData("totalDeaths");
              }}
            >
              Количество смертей всего
              {fieldData === "totalDeaths" ? <ShowArrow /> : null}
            </th>
            <th
              scope="col"
              onClick={() => {
                fieldSortData("casesPer1000");
              }}
            >
              Количество случаев на 1000 жителей
              {fieldData === "casesPer1000" ? <ShowArrow /> : null}
            </th>
            <th
              scope="col"
              onClick={() => {
                fieldSortData("deathsPer1000");
              }}
            >
              Количество смертей на 1000 жителей
              {fieldData === "deathsPer1000" ? <ShowArrow /> : null}
            </th>
          </tr>
        </thead>
        {currentPosts.map((item, idx) => (
              <tr key={idx}>
                <td>{item?.countriesAndTerritories}</td>
                <td>{item?.cases}</td>
                <td>{item?.deaths}</td>
                <td>{item?.totalCases}</td>
                <td>{item?.totalDeaths}</td>
                <td>{item?.casesPer1000}</td>
                <td>{item?.deathsPer1000}</td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tr>
            <td colSpan={7} className="text-center">
              Ничего не найдено!
            </td>
          </tr>
        )}
      </table>

      {filter.length > 0 && (
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={filter.length}
          paginate={setCurrentPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default React.memo(TableWithData);
