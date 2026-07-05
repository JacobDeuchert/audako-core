"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeasurementValueSource = exports.CompressionInterval = void 0;
var CompressionInterval;
(function (CompressionInterval) {
    CompressionInterval["ProcessInterval"] = "ProcessInterval";
    CompressionInterval["SubInterval"] = "SubInterval";
    CompressionInterval["HourInterval"] = "HourInterval";
    CompressionInterval["TwoHourInterval"] = "TwoHourInterval";
    CompressionInterval["DayInterval"] = "DayInterval";
    CompressionInterval["WeekInterval"] = "WeekInterval";
    CompressionInterval["MonthInterval"] = "MonthInterval";
    CompressionInterval["QuarterInterval"] = "QuarterInterval";
    CompressionInterval["YearInterval"] = "YearInterval";
})(CompressionInterval || (exports.CompressionInterval = CompressionInterval = {}));
var MeasurementValueSource;
(function (MeasurementValueSource) {
    MeasurementValueSource["System"] = "System";
    MeasurementValueSource["Process"] = "Process";
    MeasurementValueSource["Import"] = "Import";
    MeasurementValueSource["Manual"] = "Manual";
    MeasurementValueSource["Mixed"] = "Mixed";
    MeasurementValueSource["Manipulated"] = "Manipulated";
})(MeasurementValueSource || (exports.MeasurementValueSource = MeasurementValueSource = {}));
