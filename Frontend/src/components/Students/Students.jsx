import React, { useState, useEffect } from 'react'
import './Students.scss'
import { flexRender, getCoreRowModel, useReactTable, getPaginationRowModel } from '@tanstack/react-table'
import {columns, columnsDict} from './columns.jsx'
import TableFilters from '../TableFilters'
import {Button, ButtonGroup, Text } from '@chakra-ui/react'
import TableForm from '../TableForm/TableForm'
import { useDeleteDocument } from "../../hooks/api/useDelete"
import { useDisplayData } from '../../hooks/api/useDisplayData'
import { useGlobalSearch } from '../../hooks/api/useGlobalSearch'

function Students() {
  const [searchParam, setSearchParam] = useState('');
  const [data, setData] = useState()
  
  const {
    deleteDocument,
    resultDeleting,
    errorDeleting,
    loadingDeleteDocument,
  } = useDeleteDocument();

  const {
    displayDataSet,
    displayData,
    errorDisplay,
    loadingDisplay,
  } = useDisplayData();

  const {
    globalSearch,
    dataSearch,
    errorGlobSearch,
    loadingGlobSearch,
  } = useGlobalSearch();

  useEffect(() => {
    if (searchParam.length != 0) {
      console.log(searchParam)
      globalSearch(searchParam,'students')
      setData(dataSearch)
    } else {
      console.log(searchParam)
      setData(displayData)
    }
  }, [searchParam]);


  useEffect(() => {
    displayDataSet('students')
  }, []);

  const handleEdit = (idElement) => {
    console.log('Editing element with ID:', idElement);
  };

  const handleDelete = async (idElement) => {
    try {
      await deleteDocument(idElement, 'students');
      displayDataSet('students');
    } catch (error) {
      console.error('Error deleting element:', error);
    }
  };
    
  const table = useReactTable({
    data,
    columns: columns(handleEdit, handleDelete),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  return (
    <div className="mainTableContainer">
      <div><TableFilters 
              searchParam = {searchParam} 
              setSearchParam = {setSearchParam} 
              />
      </div>
      <div className="tableview" w={table.getTotalSize()}>
        <div className="tableHeaders">
          {table.getHeaderGroups().map(headerGroup => (
            <div className='tr' key={headerGroup.id}>
              {headerGroup.headers.map(
                header => (
                  <div className='th' w={header.getSize()} key={header.id}>
                    {header.column.columnDef.header}
                  </div>
                )
              )}
            </div>
          ))}
        </div>
        {!data ? (
          <div className="noResults">No results found.</div>
        ) : (
          <div className='tableRows'>
            {table.getRowModel().rows.map(row => (
              <div className='tr' key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <div className='td' w={cell.column.getSize()} key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        {data && (
          <React.Fragment>
            <Text fontSize='90%'>
              Page {table.getState().pagination.pageIndex + 1} of {""}
              {table.getPageCount()}
            </Text>
            <ButtonGroup>
              <Button
                size='100px'
                onClick={() => table.previousPage()}
                isDisabled={!table.getCanPreviousPage()}
              >
                {'<'}
              </Button>
              <Button
                size='sm'
                onClick={() => table.nextPage()}
                isDisabled={!table.getCanNextPage()}
              >
                {'>'}
              </Button>
            </ButtonGroup>
          </React.Fragment>
        )}
      </div>
      <TableForm columns={columnsDict}/>
    </div>
  )
}

export default Students
