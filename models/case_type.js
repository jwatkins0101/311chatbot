var Report    = require('./report'),
    Sequelize = require('sequelize');

var CaseType = Sequelize.define('case_type', {
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
CaseType.belongsToMany(Report, {through: 'ReportCaseType'});

CaseType.sync({force: false}).then(function () {
    // Table created
    console.log('Created table: case_type.')
});