/**
 * Created by archheretic on 03.02.17.
 */
/* jshint node: true */
"use strict";

var mysql = require("mysql");

function restRouter(router, connection) {
    var self = this;
    self.handleRoutes(router, connection);
}

restRouter.prototype.handleRoutes = function(router, connection) {
    router.get("/", function(req,res)
    {
        res.json({"Message" : "Hello API users!"});
    });

    /**
     * Route to get all parking lots.
     */
    router.get("/parkinglots", function(req, res) {
        var query = "SELECT * FROM ??";
        var table = ["parkingLot"];
        query = mysql.format(query, table);
        connection.query(query,function(err, rows) {
            if (err) {
                res.json({"Error" : true, "Message" : err});
            }
            else {
                res.json({"ParkingLots" : rows});
            }

        });
    });

    /**
     * Route for creating new parking lots.
     */
    router.post("/parkinglots", function(req, res) {
        console.log(req.body.name);
        console.log(req.body.capacity);
        console.log(req.body.reservedSpaces);

        var query = "INSERT INTO ??(??,??,??) VALUES (?,?,?)";
        var table = ["parkingLot", "name", "capacity", "reservedSpaces",
            req.body.name, req.body.capacity, req.body.reservedSpaces];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows)
        {
            if (err)
            {
                res.json({"Error" : true, "Message" : err});
            }
            else
            {
                res.json({"Error" : false, "Message" : "Parking Lot Added"});
            }
        });
    });

}

module.exports = restRouter;