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

    var reportCaseType = DB.deinfe('report_case_type', {});

    // Define relationships
    report.belongsToMany(caseType, {through: reportCaseType});
    caseType.belongsToMany(report, {through: reportCaseType});

    report.sync({force: false}).then(function () {
        // Table created
        console.log('Created table: report.')
    });

    model.report = report;
    model.caseType = caseType;
    model.reportCaseType = reportCaseType;

    return model;
};

module.exports = DataModel;
