import React, { useState, useEffect } from 'react'
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/Delete';



const DataTable = () => {

    const columns = [
        { field: 'id', headerName: 'ID' },
        { field: 'title', headerName: 'Title', width: 300 },
        { field: 'body', headerName: 'Body', width: 600 },
        {
            field: "delete",
            width: 75,
            sortable: false,
            disableColumnMenu: true,
            renderHeader: () => {
                return (
                    <IconButton
                        onClick={() => {
                            const selectedIDs = new Set(selectionModel);
                            // you can call an API to delete the selected IDs
                            // and get the latest results after the deletion
                            // then call setRows() to update the data locally here
                            setTableData((r) => r.filter((x) => !selectedIDs.has(x.id)));
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                );
            }
        }
    ]





    // const [rows, setRows] = useState(_rows);
    const [tableData, setTableData] = useState([])
    const [selectionModel, setSelectionModel] = useState([]);
    useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/posts")
            //fetch("http://localhost:3000/users")
            .then((data) => data.json())
            .then((data) => setTableData(data))

    }, [])

    console.log(tableData)

    return (
        <div style={{ height: 700, width: '100%' }}>
            <DataGrid
                rows={tableData}
                columns={columns}
                checkboxSelection
                pageSize={12}
                onSelectionModelChange={(ids) => {
                    setSelectionModel(ids);
                }}
            />
        </div>
    )
}

export default DataTable