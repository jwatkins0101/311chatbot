var Sequelize = require('sequelize');

var Report = function (DB) {
    var report = DB.define('report', {
        address: {
            type: DB.STRING,
            field: 'address'
        },
        zipcode: {
            type: DB.STRING,
            field: 'zipcode'
        }
    }, {
        indexes: [
            {fields: ['address']}
        ],
        freezeTableName: true // Model tableName will be the same as the model name
    });

    report.belongsToMany(CaseType, {through: 'ReportCaseType'});

    report.sync({force: false}).then(function () {
        // Table created
        console.log('Created table: report.')
    });

    return report;
};

var CaseType = function (DB) {
    var caseType = DB.define('case_type', {
        name: {
            type: Sequelize.STRING,
            field: 'name'
        }
    }, {
        indexes: [
            {fields: ['name']}
        ],
        freezeTableName: true // Model case_type will be the same as the model name
    });

// Define relationships
    caseType.belongsToMany(Report, {through: 'ReportCaseType'});

    caseType.sync({force: false}).then(function () {
        // Table created
        console.log('Created table: case_type.')
    });

    return caseType;
};

module.exports.Report = CaseType;
module.exports.CaseType = Report;