/**
 * Created by archheretic on 04.02.17.
 */
/* jshint node: true */
"use strict";

const express = require('express');
const router = express.Router();
const ParkingLog = require('../models/parkingLog.model');
const authorize = require('./authorize');

const config = require("config");
const env = config.util.getEnv('NODE_ENV');

/**
 * Route to get all parking logs.
 */
router.get("/", function(req, res) {
    ParkingLog.getParkingLogs(function(err, rows) {
        if (err) {
            let message = "Internal Server Error";
            if (env === "dev" || env === "test") {
                message = err;
            }
            res.status(500).send({
                success: false,
                message: message
            });
        }
        else {
            if (rows.length === 0) {
                res.status(204).send({
                    success: false,
                    message: 'No parking logs found'
                });
                return;
            }
            res.json({"parkingLogs" : rows});
        }
    });
});

/**
 * Route to get the latest parking log.
 */
router.get("/latest", function(req, res) {
    ParkingLog.getLatestParkingLog(function(err,rows) {
        if (err) {
            let message = "Internal Server Error";
            if (env === "dev" || env === "test") {
                message = err;
            }
            res.status(500).send({
                success: false,
                message: message
            });
        }
        else {
            if (rows.length === 0) {
                res.status(204).send({
                    success: false,
                    message: 'No parking log found'
                });
                return;
            }
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
        if (err) {
            let message = "Internal Server Error";
            if (env === "dev" || env === "test") {
                message = err;
            }
            res.status(500).send({
                success: false,
                message: message
            });
        }
        else {
            if (rows.length === 0) {
                res.status(204).send({
                    success: false,
                    message: 'Parking log not found'
                });
                return;
            }
            res.json({"parkingLogs" : rows});
        }
    });
});

/**
 * Route to get a specific parking log based on id.
 */
router.get("/:id", function(req, res) {
    ParkingLog.getParkingLogById(req.params.id, function(err,rows) {
        if (err) {
            let message = "Internal Server Error";
            if (env === "dev" || env === "test") {
                message = err;
            }
            res.status(500).send({
                success: false,
                message: message
            });
        }
        else {
            if (rows.length === 0) {
                res.status(204).send({
                    success: false,
                    message: 'Parking log not found'
                });
                return;
            }
            res.json({"parkingLogs" : rows});
        }
    });
});

/**
 * Route to create new parking logs.
 */
router.post("/", function(req, res) {
    if (!req.body.parkingLot_id) {
        res.status(400).send({
            success: false,
            message: "request body is missing parkingLot_id"
        });
        return;
    }
    authorize.verify(req,res, true, function(req,res) {
        ParkingLog.addParkingLog(req.body.parkingLot_id, req.body.currentParked, req.body.logDate, function(err, rows)
        {
            if (err) {
                let message = "Internal Server Error";
                if (env === "dev" || env === "test") {
                    message = err;
                }
                res.status(500).send({
                    success: false,
                    message: message
                });
            }
            else {
                res.status(201).send({
                    success: true,
                    message: 'Parking Log Added'
                });
            }
        });
    });
});

/**
 * Route to create new parking logs.
 */
router.post("/increment", function(req, res) {
    if (!req.body.parkingLot_id) {
        res.status(400).send({
            success: false,
            message: "request body is missing parkingLot_id"
        });
        return;
    }
    authorize.verify(req,res, true, function(req,res) {
        ParkingLog.addIncrementedParkingLog(req.body.parkingLot_id, req.body.increment, req.body.logDate, function (err, rows) {
            if (err) {
                let message = "Internal Server Error";
                if (env === "dev" || env === "test") {
                    message = err;
                }
                res.status(500).send({
                    success: false,
                    message: message
                });
            }
            else {
                res.status(201).send({
                    success: true,
                    message: 'Parking Log Added'
                });
            }
        });
    });
});


/**
 * Route to update a parking log.
 * Only the currentParked value can be changed.
 */
router.put("/", function(req, res) {
    if (!req.body.id || !req.body.currentParked) {
        res.status(400).send({
            success: false,
            message: "request body is missing id and/or currentParked"
        });
        return;
    }
    authorize.verify(req,res, true, function(req,res) {
        ParkingLog.updateParkingLog(req.body.id, req.body.currentParked, function (err, rows) {
            if (err) {
                let message = "Internal Server Error";
                if (env === "dev" || env === "test") {
                    message = err;
                }
                res.status(500).send({
                    success: false,
                    message: message
                });
            }
            else if (rows.affectedRows == 0) {
                res.status(204).send({
                    success: false,
                    message: 'Parking log not found'
                });
            }
            else {
                res.json({"Message": "Parking Log Updated"});
            }
        });
    });
});

/**
 * Route to delete a parking log with the corresponding id.
 */
router.delete("/:id", function(req, res) {
    authorize.verify(req,res, true, function(req,res) {
        ParkingLog.deleteParkingLogById(req.params.id, function (err, rows) {
            if (err) {
                let message = "Internal Server Error";
                if (env === "dev" || env === "test") {
                    message = err;
                }
                res.status(500).send({
                    success: false,
                    message: message
                });
            }
            else {
                if (rows.affectedRows == 0) {
                    res.status(204).send({
                        success: false,
                        message: 'Parking log not found'
                    });
                    return;
                }
                res.json({"Message": "Deleted parking log with id " + req.params.id});
            }
        });
    });
});

module.exports = router;