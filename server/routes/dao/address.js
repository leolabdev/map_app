const express = require('express');
const axios = require("axios");

const router = express.Router();
const ResponseUtil = require('./ResponseUtil').ResponseUtil;
const AddressDAO = require("../../DAO/AddressDAO").AddressDAO;
const DaoUtil = require("../../util/DaoUtil").DaoUtil;

const daoUtil = new DaoUtil();

const responseUtil = new ResponseUtil();

const addressDAO = new AddressDAO();

router.post("/", async (req, res) => {
    let {street, building, city, lon, lat} = req.body;

    //if coordinates are not provided
    if(lon == null || lat == null){
        //get coordinates of the street address
        const addressData = await daoUtil.getAddressData(street, building, city);

        if(await addressData != null){
            if(addressData.data.length === 1){
                const coordinates = addressData.data[0].coordinates;
                req.body.lon = coordinates.lon;
                req.body.lat = coordinates.lat;
                const status = await addressDAO.create(req.body);
                responseUtil.sendStatusOfOperation(res, status);
            } else{
                console.error("address: Multiple addresses for this query was found, DB will not be updated");
                responseUtil.sendStatusOfOperation(res, false);
            }

        } else{
            responseUtil.sendStatusOfOperation(res, false);
        }
    } else{
        const status = await addressDAO.create(req.body);
        responseUtil.sendStatusOfOperation(res, status);
    }
});

router.get("/:addressId", async (req, res) => {
    const result = await addressDAO.read(req.params.addressId);
    responseUtil.sendResultOfQuery(res, result);
});

router.get("/", async (req, res) => {
    const result = await addressDAO.readAll();
    responseUtil.sendResultOfQuery(res, result);
});

router.put("/", async (req, res) => {
    let {street, building, city} = req.body;

    //if there is a changes in street address, update lat, lon as well
    if(street != null || building != null || city != null){
        //get coordinates of the street address
        const addressData = await daoUtil.getAddressData(street, building, city);

        if(await addressData != null){
            if(addressData.data.length === 1){
                const coordinates = addressData.data[0].coordinates;
                req.body.lon = coordinates.lon;
                req.body.lat = coordinates.lat;
                const status = await addressDAO.create(req.body);
                responseUtil.sendStatusOfOperation(res, status);
            } else{
                console.error("address: Multiple addresses for this query was found, DB will not be updated");
                responseUtil.sendStatusOfOperation(res, false);
            }
        } else{
            responseUtil.sendStatusOfOperation(res, false);
        }
    } else{
        const status = await addressDAO.update(req.body);
        responseUtil.sendStatusOfOperation(res, status);
    }
});

router.delete("/:addressId", async (req, res) => {
    const status = await addressDAO.delete(req.params.addressId);
    responseUtil.sendStatusOfOperation(res, status);
});

module.exports = router;