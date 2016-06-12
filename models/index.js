var Sequelize = require('sequelize');

var DataModel = function (DB, model) {
    // Define Report
    var report = DB.define('report', {
        address: {
            type: Sequelize.STRING,
            field: 'address'
        },
        zipcode: {
            type: Sequelize.STRING,
            field: 'zipcode'
        }
    }, {
        indexes: [
            {fields: ['address']}
        ],
        freezeTableName: true // Model tableName will be the same as the model name
    });

    // Define Case Type
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
    report.belongsToMany(caseType, {through: 'ReportCaseType'});

    report.sync({force: false}).then(function () {
        // Table created
        console.log('Created table: report.')
    });

    caseType.belongsToMany(report, {through: 'ReportCaseType'});

    caseType.sync({force: false}).then(function () {
        // Table created
        console.log('Created table: case_type.')
    });

    model.report = report;
    model.caseType = caseType;

    return model;
};

module.exports = DataModel;