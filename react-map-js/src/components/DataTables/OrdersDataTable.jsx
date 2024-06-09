import React, { useState } from 'react'
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/Delete';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import {Api} from "../../shared/api";

//in order data table can be found the information about orders, also it is used for making the request to the server for getting the routing
const OrdersDataTable = ({
    currentPosition,
    setOurShipmentAddresses,
    setOurDeliveryAddresses,
    modal,
    setModal,
    orders,
    setOrders,
    setOrdersIdForRoutes,
    setOrdersAddresses,
}) => {
    // columns are used for displaying the necessary information from the data source to the order data table
    const columns = [
        { field: 'orderId', headerName: 'orderId' },
        { field: 'manufacturerUsername', headerName: 'manufacturerUsername', width: 250 },
        { field: 'clientUsername', headerName: 'clientUsername', width: 250 },
        { field: 'deliveryAddressId', headerName: 'deliveryAddressId', width: 250 },
        { field: 'shipmentAddressId', headerName: 'shipmentAddressId', width: 250 },

        //button for deleting orders 
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
                            selectedIDs.forEach(s => Api.orders.deleteById(s));
                            setOrders((r) => r.filter((x) => !selectedIDs.has(x.orderId)));
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                );
            }
        },
        //button for making the request to the server for getting the routing
        {
            field: "Get Route",
            width: 75,
            sortable: false,
            disableColumnMenu: true,
            renderHeader: () => {
                return (
                    <IconButton
                        onClick={() => {
                            let selectedIDs = new Array(selectionModel);
                            // if choose more then 10 orders they will be reseted
                            if (selectedIDs[0].length > 10) {
                                alert("plz select max 10 orders")
                                selectedIDs = [];
                            } else {
                                // orders's id for routes are saved
                                setOrdersIdForRoutes([...selectedIDs[0]])
                                //toogle off the modal window
                                setModal(!modal)

                                let newOrdersAddresses = [];
                                let newOurShipmentAddresses = [];
                                let newOurDeliveryAddresses = [];

                                // here by order ids we get orders' shipmentAddresses and deliveryAddress
                                selectedIDs[0].forEach(idx => {
                                    Api.orders.getById(idx).then((data) => {
                                        newOrdersAddresses.push(data)
                                        // here we add ordersid keys 
                                        newOrdersAddresses.forEach((order, index) => {

                                            // for shipmentAddresses make ordersid keys
                                            newOurShipmentAddresses.push(order.shipmentAddress)
                                            newOurShipmentAddresses[index].orderId = order.orderId

                                            // for deliveryAddresses make ordersid keys
                                            newOurDeliveryAddresses.push(order.deliveryAddress)
                                            newOurDeliveryAddresses[index].orderId = order.orderId


                                        })
                                        // filtering shipmentAddresses to remove reccurring ones
                                        const newUniqueOurShipmentAddresses = [...new Map(newOurShipmentAddresses.map((item) => [item["addressId"], item])).values()]
                                        newUniqueOurShipmentAddresses.push(currentPosition)
                                        setOurShipmentAddresses(newUniqueOurShipmentAddresses);

                                        // filtering deliveryAddress to remove reccurring ones
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
                        <AltRouteIcon />
                    </IconButton>

                );
            }
        },
    ]
    // order data table requires for selecting items 
    const [selectionModel, setSelectionModel] = useState([]);
    return (
        <div style={{ height: 700, width: '100%' }}>
            <DataGrid
                getRowId={(row) => row.orderId}
                rows={orders}
                onRowsUpdate={""}
                columns={columns}
                checkboxSelection
                onSelectionModelChange={(ids) => {
                    setSelectionModel(ids);
                }}
                components={{ Toolbar: GridToolbar }}
            />
        </div>
    )
}
export default OrdersDataTable