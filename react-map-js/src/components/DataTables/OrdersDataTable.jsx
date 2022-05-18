import React, {useState, useEffect} from 'react'
import IconButton from "@mui/material/IconButton";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/Delete';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import {deleteOrderByOrderId} from '../../api/orders/DeleteOrderByOrderId';
import {getOrderByOrderId} from '../../api/orders/GetOrderByOrderId';


const OrdersDataTable = ({
                             currentPosition,
                             setOurShipmentAddress,
                             setOurShipmentAddresses,
                             setOurDeliveryAddress,
                             setOurDeliveryAddresses,
                             ourShipmentAddress,
                             ourShipmentAddresses,
                             ourDeliveryAddress,
                             ourDeliveryAddresses,
                             ourStart,
                             setOurStart,
                             ourEnd,
                             setOurEnd,
                             orders,
                             setOrders,
                             orderPoints,
                             setOrderPoints,
                             ordersIdForRoutes,
                             setOrdersIdForRoutes,
                             modal,
                             setModal,
                             ordersAddresses,
                             setOrdersAddresses,
                             ordersAddressesFlag,
                             setOrdersAddressesFlag
                         }) => {


    const [flag, setFlag] = useState(false)


    const columns = [
        {field: 'orderId', headerName: 'orderId'},
        {field: 'manufacturerUsername', headerName: 'manufacturerUsername', width: 250},
        {field: 'clientUsername', headerName: 'clientUsername', width: 250},
        {field: 'deliveryAddressId', headerName: 'deliveryAddressId', width: 250},
        // { field: orders.result.shipmentAddress, headerName: 'deliveryAddressId', width: 400 },
        {field: 'shipmentAddressId', headerName: 'shipmentAddressId', width: 250},

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
                        <DeleteIcon/>
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
                            // setFlag(!flag)


                            let selectedIDs = new Array(selectionModel);
                            if (selectedIDs[0].length > 10) {
                                alert("plz select max 10 orders")
                                selectedIDs = new Array();
                            } else {

                                setOrdersIdForRoutes([...selectedIDs[0]])

                                setModal(!modal)

                                let newOrdersAddresses = [];
                                let newOurShipmentAddresses = [];
                                let newOurDeliveryAddresses = [];


                                selectedIDs[0].map(idx => {

                                    getOrderByOrderId(idx).then((data) => {

                                        newOrdersAddresses.push(data)

                                        newOrdersAddresses.map((order, index) => {
                                            newOurShipmentAddresses.push(order.shipmentAddress)

                                            newOurShipmentAddresses[index].orderId = order.orderId


                                            newOurDeliveryAddresses.push(order.deliveryAddress)
                                            newOurDeliveryAddresses[index].orderId = order.orderId


                                        })

                                        const newUniqueOurShipmentAddresses = [...new Map(newOurShipmentAddresses.map((item) => [item["addressId"], item])).values()]
                                        newUniqueOurShipmentAddresses.push(currentPosition)
                                        setOurShipmentAddresses(newUniqueOurShipmentAddresses);

                                        const newUniqueOurDeliveryAddresses = [...new Map(newOurDeliveryAddresses.map((item) => [item["addressId"], item])).values()]
                                        setOurDeliveryAddresses(newUniqueOurDeliveryAddresses);
                                        newOurShipmentAddresses = [];
                                        newOurDeliveryAddresses = [];
                                    })

                                })


                                setOrdersAddresses(newOrdersAddresses)


                            }
                        }}
                    >
                        <AltRouteIcon/>
                    </IconButton>

                );
            }
        },
    ]



    const [selectionModel, setSelectionModel] = useState([]);
    const [manufacturerUsernameModel, setManufacturerUsernameModel] = useState([])


    return (


        <div style={{height: 700, width: '100%'}}>


            <DataGrid
                getRowId={(row) => row.orderId}
                rows={orders}
                onRowsUpdate={""}
                columns={columns}
                checkboxSelection
                pageSize={15}
                onSelectionModelChange={(ids) => {
                    setSelectionModel(ids);
                }}
                components={{Toolbar: GridToolbar}}
            />
        </div>
    )
}

export default OrdersDataTable