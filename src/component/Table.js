import React, { useState } from 'react'
import {useFilters, useTable, usePagination} from "react-table"

function TableComponent({ text, columns, data }) {
  const headerValue = columns.length > 0 ? columns[0].Header : ''
  const {
    getTableProps, // table props from react-table
    getTableBodyProps, // table body props from react-table
    headerGroups, // headerGroups, if your table has groupings
    rows, // rows for the table based on the data passed
    prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
    setFilter,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable({
    columns,
    data,
    initialState: { pageIndex: 0, pageSize: 5 },
  },
  useFilters,
  usePagination);
  const [filterInput, setFilterInput] = useState({});

  // Update the state when input changes
  const handleFilterChange = (e, header) => {
    const value = e.target.value || undefined;
    setFilter(header, value);
    setFilterInput({...filterInput, [header]:value});
  };
  return (
    <div className='my-5'>
        <h1 className='my-3 is-size-5 has-text-weight-semibold has-text-centered'>{text}</h1>
        <div className='table-box'>
          <table {...getTableProps()} className="mockaroo">
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column, i) => (
                    <th 
                      {...column.getHeaderProps()}
                      className='table--header'
                    >
                      {column.render("Header")}<br/>
                      <input 
                        class="input is-success mb-5" 
                        type="text" 
                        placeholder={`Search ${columns[i].Header}`}
                        value={filterInput[columns[i].Header]}
                        onChange={(e) => handleFilterChange(e, columns[i].Header)}  
                      />
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()} className="table--body">
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                      return <td {...cell.getCellProps()} className={`table--row ${i%2===0 ? null : 'has-background-white-ter'}`}>{cell.render("Cell")}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className='is-flex is-justify-content-center mt-5'>
            <div>
              <span>Page{' '}<strong>{pageIndex + 1} of {pageOptions.length}</strong>{' '}</span>
              <span>| Go to page: 
                <input 
                  type="number" 
                  defaultValue={pageIndex + 1}  
                  style={{width: 50}} 
                  onChange={e => {
                    const page = e.target.value ? Number(e.target.value) - 1 : 0
                    gotoPage(page)
                  }}
                />
              </span>
              <select
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value))
                }}
              >
                {[5, 10, 20, 30, 40, 50].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                  </option>
                ))}
              </select>
              <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>&lt;&lt;</button>
              <button onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</button>
              <button onClick={() => nextPage()} disabled={!canNextPage}>Next</button>
              <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>&gt;&gt;</button>
            </div>
          </div>
        </div>
    </div>
  )
}

export default TableComponent