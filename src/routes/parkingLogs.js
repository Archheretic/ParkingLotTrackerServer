/**
 * Created by archheretic on 04.02.17.
 */
/* jshint node: true */
"use strict";

var express = require('express');
var router = express.Router();
var ParkingLog = require('../models/parkingLog.model');

/**
 * Route to get all parking logs.
 */
router.get("/", function(req, res) {
    ParkingLog.getParkingLogs(function(err, rows) {
        if (err) {
            res.json({err});
        }
        else {
            res.json({"parkingLogs" : rows});
        }
    });
});

/**
 * Route to get the latest parking log.
 */
router.get("/latest", function(req, res) {
    ParkingLog.getLatestParkingLog(function(err,rows) {
        if(err) {
            res.json({err})
        }
        else {
            res.json({"parkingLogs" : rows});
        }
    });
});

/**
 * Route to get the latest parking log from a spesific parkinglot.
 * Where :id is the id of the parkinglot.
 */
router.get("/latest/:id", function(req, res) {
    ParkingLog.getAParkingLotsLatestParkingLog(req.params.id, function(err,rows) {
        if(err) {
            res.json({err})
        }
        else {
            res.json({"parkingLogs" : rows});
        }
    });
});

/**
 * Route to get a specific parking log based on id.
 */
router.get("/:id", function(req, res) {
    ParkingLog.getParkingLogById(req.params.id, function(err,rows) {
        if(err) {
            res.json({err})
        }
        else {
            res.json({"parkingLogs" : rows});
        }
    });
});

/**
 * Route to create new parking logs.
 */
router.post("/", function(req, res) {
    if (!req.body.parkingLot_id) {
        res.json({"err": {"code":"Missing json body: parkingLot_id"}});
        return;
    }
    console.log(req.body.currentParked);
    ParkingLog.addParkingLog(req.body.parkingLot_id, req.body.currentParked, req.body.logDate, function(err, rows)
    {
        if (err) {
            res.json({err});
        }
        else {
            res.json({"Error" : false, "Message" : "Parking Log Added"});
        }
    });
});

/**
 * Route to update a parking log.
 * Only the currentParked value can be changed.
 */
router.put("/", function(req, res) {
    if (!req.body.id || !req.body.currentParked) {
        res.json({"err": {"code":"Missing parameter: id and/or currentParked"}});
        return;
    }

    ParkingLog.updateParkingLog(req.body.id, req.body.currentParked, function(err, rows)
    {
        if (err) {
            res.json({err});
        }
        else {
            res.json({"Message" : "Parking Log Updated"});
        }
    });
});

/**
 * Route to delete a parking log with the corresponding id.
 */
router.delete("/:id", function(req, res) {
    ParkingLog.deleteParkingLogById(req.params.id, function(err, rows) {
        if(err) {
            res.json({err});
        }
        else {
            res.json({"Message" : "Deleted parking log with id " + req.params.id});
        }
    });
});

module.exports = router;