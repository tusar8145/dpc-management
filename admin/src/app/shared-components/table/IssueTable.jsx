 
 import { useMemo } from 'react';

import {
    MRT_GlobalFilterTextField,
    MRT_TableBodyCellValue,
    MRT_TablePagination,
    MRT_ToolbarAlertBanner,
    flexRender,
    useMaterialReactTable,
  } from 'material-react-table';
  import {
    Box,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
  } from '@mui/material';
  import Button from '@mui/material/Button';

  const Example = (props) => {

    const data = props.data;

    const columns = useMemo(
        () => [
            {
                accessorFn: (row) => ` `, //accessorFn used to join multiple data into a single cell
                id: 'action', //id is still required when using accessorFn instead of accessorKey
                header: 'Action',
                enableEditing: false,
                required: false,
                size: 50,
                Cell: ({ renderedCellValue, row }) => (
                  <> 
     
             
     <Button 	onClick={() => {
						 
                        props.idSend(row.original.id)
					}}
                    variant="contained" size="small">
          View
        </Button>
    
                  </>
                ),
              },
          {
            accessorKey: 'subject', //access nested data with dot notation
            header: 'Subject',
            size: 150,
          },
          {
            accessorKey: 'issue',
            header: 'Issue',
            size: 150,
          },
          {
            accessorKey: 'created', //normal accessorKey
            header: 'Created',
            size: 200,
          },
          {
            accessorKey: 'creator_',
            header: 'Creator',
            size: 150,
          },
          {
            accessorKey: 'status',
            header: 'Status',
            size: 150,
          },
          {
            accessorKey: 'status_date',
            header: 'Status Date',
            size: 150,
          },
          {
            accessorKey: 'have_new',
            header: 'New Reply',
            size: 150,
          },
        ],
        [],
      );
    const table = useMaterialReactTable({
      columns,
      data, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
      //MRT display columns can still work, optionally override cell renders with `displayColumnDefOptions`
      enableRowSelection: true,
      initialState: {
        pagination: { pageSize: 5, pageIndex: 0 },
        showGlobalFilter: true,
      },
      //customize the MRT components
      muiPaginationProps: {
        rowsPerPageOptions: [5, 10, 15],
        variant: 'outlined',
      },
      paginationDisplayMode: 'pages',
    });
  
    return (
      <Stack sx={{ m: '2rem 0' }} style={{background:"white", padding:"15px", borderRadius:"15px"}}> 
        <Typography variant="p"></Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/**
           * Use MRT components along side your own markup.
           * They just need the `table` instance passed as a prop to work!
           */}
          <MRT_GlobalFilterTextField table={table} />
          <MRT_TablePagination table={table} />
        </Box>
        {/* Using Vanilla Material-UI Table components here */}
        <TableContainer>
          <Table>
            {/* Use your own markup, customize however you want using the power of TanStack Table */}
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell align="center" variant="head" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.Header ??
                              header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map((row, rowIndex) => (
                <TableRow key={row.id} selected={row.getIsSelected()}>
                  {row.getVisibleCells().map((cell, _columnIndex) => (
                    <TableCell align="center" variant="body" key={cell.id}>
                      {/* Use MRT's cell renderer that provides better logic than flexRender */}
                      <MRT_TableBodyCellValue
                        cell={cell}
                        table={table}
                        staticRowIndex={rowIndex} //just for batch row selection to work
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <MRT_ToolbarAlertBanner stackAlertBanner table={table} />
      </Stack>
    );
  };
  
  export default Example;













