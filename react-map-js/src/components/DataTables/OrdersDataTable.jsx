import React, { useState, useEffect } from 'react'
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/Delete';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import { deleteOrderByOrderId } from '../../api/orders/DeleteOrderByOrderId';
import { getOrderByOrderId } from '../../api/orders/GetOrderByOrderId';






const OrdersDataTable = ({ start, setStart, end, setEnd,orders, setOrders}) => {

    // const [orders, setOrders] = useState([]);
    // const [isLoading, setIsLoading] = useState(false)
    // let [result, setResult] = useState(null)

    // useEffect(() => {

    //     console.log(start);
    //     console.log(end)
    //     // console.log(result)


    // }, [
    //     result

    // ]);

    //  useEffect(() => {

    //     getOrdersData().then((data) => {

    //         setOrders(data)
    //         console.log("helloti", orders)
    //         setIsLoading(false)
    //     })
    //     // console.log(result)
    //     setIsLoading(true)

    // }, [
       

    // ]);


        const columns = [
        // { field: 'id', headerName: 'ID' },
        // { field: 'title', headerName: 'Title', width: 300 },
        // { field: 'body', headerName: 'Body', width: 600 },
        // { field: 'body2', headerName: 'Body2', width: 600 },
        // { field: getRowId, headerName: 'hello' },
        { field: 'orderId', headerName: 'orderId' },
        { field: 'manufacturerUsername', headerName: 'manufacturerUsername', width: 350 },
        { field: 'clientUsername', headerName: 'clientUsername', width: 350 },
        { field: 'deliveryAddressId', headerName: 'deliveryAddressId', width: 350 },
        // { field: orders.result.shipmentAddress, headerName: 'deliveryAddressId', width: 400 },
        { field: 'shipmentAddressId', headerName: 'shipmentAddressId', width: 350 },

        {
            field: "delete",
            width: 210,
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

                            selectedIDs.forEach(s => deleteOrderByOrderId(s));



                            setOrders((r) => r.filter((x) => !selectedIDs.has(x.orderId)));
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>

                );
            }
        },
        {
            field: "Get Route",
            width: 75,
            sortable: false,
            disableColumnMenu: true,
            renderHeader: () => {
                return (
                    <IconButton
                        onClick={() => {
                            const selectedIDs = new Array(selectionModel);

                            if (selectedIDs[0].length > 1) {
                                alert("plz select only one")
                                 selectedIDs = new Array();
                            }
                            else {


                                // (selectedIDs[0][0].length) === 0 ? alert("sorry") : alert("ok")
                                // console.log(selectedIDs[0])
                                // selectedIDs.forEach(s => deleteOrderByOrderId(s));
                                // const hello = 
                                getOrderByOrderId(selectedIDs[0][0]).then((data) => {
                                    console.log(data)
                                    // setResult(data)
                                    // setStart(data?.shipmentAddress?.lat, data?.shipmentAddress?.lon)
                                    setStart(prevState => ({
                                        ...prevState,
                                        lat: data.shipmentAddress.lon
                                    }));
                                    setStart(prevState => ({
                                        ...prevState,
                                        lon: data.shipmentAddress.lat
                                    }));

                                    setEnd(prevState => ({
                                        ...prevState,
                                        lat: data.deliveryAddress.lon
                                    }));
                                    setEnd(prevState => ({
                                        ...prevState,
                                        lon: data.deliveryAddress.lat
                                    }));
                                    alert("Press Show route button on the map")

                                    // setStart("lol")
                                    // setEnd(data?.deliveryAddress?.lat, data?.deliveryAddress?.lon)
                                    console.log("shipmentAddress:", data.shipmentAddress.lat, data.shipmentAddress.lon, "deliveryAddress:", data.deliveryAddress.lat, data.deliveryAddress.lon)
                                });
                            }
                            // getOrdersData().then((data) => {

                            //     setOrders(data)
                            //     console.log("helloti", orders)

                            // })
                            // const hello = getOrderByOrderId(15);
                            // setResult(hello);
                            // console.log(result)

                            // selectedIDs.forEach(s => getOrderByOrderId(s))


                            // setOrders((r) => r.filter((x) => !selectedIDs.has(x.orderId)));
                        }}
                    >
                        <AltRouteIcon />
                    </IconButton>

                );
            }
        },






    ]





    // const [rows, setRows] = useState(_rows);
    const [selectionModel, setSelectionModel] = useState([]);
    const [manufacturerUsernameModel, setManufacturerUsernameModel] = useState([])
    // const [tableData, setTableData] = useState([])
    // useEffect(() => {
    //     // fetch("https://jsonplaceholder.typicode.com/posts")
    //     // fetch("http://localhost:8081/dao/order")
    //     fetch("http://localhost:3000/users")
    //         .then((data) => data.json())
    //         .then((data) => setTableData(data))


    //     // console.log("orders from table data", orders)
    // }, [])

    // console.log(" hello from tabledata from tableData", tableData)
    console.log(" hello from tabledata from orders", orders)
    // console.log(tableData)

    return (


        <div style={{ height: 700, width: '100%' }}>
            {/* {isLoading ? (
                <div 
                // className={classes.loading}
                >
                    <CircularProgress size="5rem" />
                </div>
            ) : ( */}
            
            <DataGrid
                getRowId={(row) => row.orderId}
                rows={orders}
                onRowsUpdate={""}
                columns={columns}
                checkboxSelection
                pageSize={12}
                // onCellClick={setOrders(...orders)}
                onSelectionModelChange={(ids) => {
                    setSelectionModel(ids);
                }}
                components={{ Toolbar: GridToolbar }}
            />
            {/* ) */}
        {/* } */}
        </div>
    )
}

export default OrdersDataTable