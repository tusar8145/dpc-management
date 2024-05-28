import * as React from 'react';
import TablePagination from '@mui/material/TablePagination';
import { useEffect} from 'react';


export default function TablePaginationDemo(props) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        props.setPageParent(newPage)
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        props.setRowParent(parseInt(event.target.value, 10))

        setPage(0);
        props.setPageParent(0)
    };

    useEffect(() => {
        setPage(0);
        props.setPageParent(0)
    }, [props.total_data]);

    return (<TablePagination component="div" count={props.total_data} page={page} onPageChange={handleChangePage} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage}/>);
}