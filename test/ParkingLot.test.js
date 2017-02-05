/**
 * Created by archheretic on 05.02.17.
 */
process.env.NODE_ENV = "test";

// this ensures that the other tests runs first.
require("./parkingLots.test");
require("./parkingLogs.test");

let connection = require("../src/dbconnection");
let ParkingLot = require("../src/models/ParkingLot");

// Require the dev-dependencies
let chai = require("chai");
let should = chai.should();
let expect = chai.expect;
let assert = chai.assert;

describe('hooks', function() {
    before((done) => {
        prepareDatabase(() => {
            done();
        });
    });

    describe('/Test ParkingLot.getParkingLots', () => {
        it('This test should not get any parkingLots', (done) => {
            ParkingLot.getParkingLots(function (err, data) {
                data.should.be.empty;
                done();
            });
        });
    });

    let parkingLot = {
        "name": "fisk",
        "capacity": 77,
        "reservedSpaces": 10
    };
    describe('hooks', function() {
        before((done) => {
            ParkingLot.addParkingLot(parkingLot.name, parkingLot.capacity, parkingLot.reservedSpaces, (err) => {
                done();
            })
        });
        describe('/Test ParkingLot.addParkingLot', () => {
            it('One more row of data should have been inserted', (done) => {
                ParkingLot.getParkingLots(function (err, rows) {
                    let data;
                    if (err) {
                        data = parseRowData(err);
                    }
                    else {
                        data = parseRowData(rows);
                    }
                    data.should.be.not.empty;
                    firstRow = parseRowData(data);
                    firstRow = JSON.parse(data)[0];
                    assert.notEqual(firstRow, undefined);
                    secondRow = JSON.parse(data)[2];
                    assert.equal(secondRow, undefined);
                    done();
                });
            });
        });
    });

});


function prepareDatabase(callback)
{
    deleteAllParkingLogData( () => {
        deleteAllParkingLotData(callback);
    });
}

function deleteAllParkingLogData(callback) {
    let query = "DELETE FROM parkingLog";
    connection.query(query, callback);
    console.log("deleteAllParkingLogsData");
    //callback();
}

function deleteAllParkingLotData(callback) {
    var query = "DELETE FROM parkingLot";
    connection.query(query, callback);
    console.log("deleteAllParkingLotData");
}

function parseRowData(rowdata)
{
    rowdata = JSON.stringify(rowdata);
    return rowdata;
}

function parseRowDataIntoSingleEntity(rowdata)
{
    rowdata = parseRowData(rowdata);
    rowdata = JSON.parse(rowdata)[0];
    return rowdata;
}