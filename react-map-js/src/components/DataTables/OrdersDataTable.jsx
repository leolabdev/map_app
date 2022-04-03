import React, { useState, useEffect } from 'react'
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/Delete';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import { deleteOrderByOrderId } from '../../api/orders/DeleteOrderByOrderId';
import { getOrderByOrderId } from '../../api/orders/GetOrderByOrderId';






const OrdersDataTable = ({ start, setStart, end, setEnd,orders, setOrders,orderPoints,setOrderPoints}) => {

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
    const [flag,setFlag] = useState(false)
    

    


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

                            
                                // const emptyArray = new Array();
                                // setFlag(!flag)
                                // setOrderPoints([[252.04533, 600.290486]]);
                            
                            const selectedIDs = new Array(selectionModel);
                            if (selectedIDs[0].length > 10) {
                                alert("plz select max 10 orders")
                                 selectedIDs = new Array();
                            }
                            else{ 
                                var newOrderPoints =  orderPoints;
                                selectedIDs[0].map(idx => {
                                    
                                    getOrderByOrderId(idx).then((data)=>{
                                        // console.log(idx)
                                        // console.log(data)
                                        
                                       
                                         newOrderPoints.push([data.shipmentAddress.lat,data.shipmentAddress.lon])
                                         newOrderPoints.push([data.deliveryAddress.lat,data.deliveryAddress.lon])
                                        setOrderPoints(newOrderPoints);
                                        // console.log(newOrderPoints) 
                                        // setOrderPoints(null)
                                        
                                    })
                                    
                                   
                                })
                                
                                    newOrderPoints=[];
                                    // console.log(orderPoints)
                                //  setTimeout(() => {
                                //     newOrderPoints= null;
                                // }, 1000);
                               
                                ;
                                // console.log("selectedIDs",selectedIDs[0])
                                // console.log(selectedIDs)


                                // for (let i = 0; i<selectedIDs[0].length; i++ ){
                                    // console.log("selectedIDs[0][i])",selectedIDs[0][i])
                                   
                                    // getOrderByOrderId(selectedIDs[0][i]).then((data) => {
                                    //     // console.log("suka",data.shipmentAddress.lon)
                                    //     // console.log(data)
                                        
                                    //     let newOrderPoints =  orderPoints;
                                    //     newOrderPoints.push([data.shipmentAddress.lat,data.shipmentAddress.lon])
                                    //     newOrderPoints.push([data.deliveryAddress.lat,data.deliveryAddress.lon])
                                    //      setOrderPoints(newOrderPoints);
                                         

                                    //     //  newOrderPoints=null;
                                            
                                    //      return data
                                        
                                    // })
                                // }
                                // setTimeout(() => {
                                    // console.log(orderPoints)
                                // }, 5000);
                                
                            }
                        }}
                    >
                        <AltRouteIcon />
                    </IconButton>

                );
            }
        },






    ]

    useEffect( () => {
        try{
            // setOrderPoints([[100.936707651023134,600.18226502577591]])
            const emptyArray = new Array() 
            // setMarkers((prevValue) => [...prevValue, e.latlng]);

            // setOrderPoints(null)
        }catch (e){
            console.log(e);
        }
    }, [
        flag
    ]);
   



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
    // console.log(" hello from tabledata from orders", orders)
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
                pageSize={15}
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