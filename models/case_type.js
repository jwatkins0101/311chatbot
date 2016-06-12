var Report = require('./report');

var CaseType = sequelize.define('case_type', {
    name: {
        type: sequelize.STRING,
        field: 'name'
    }
}, {
    indexes: [
        {fields: ['name']}
    ],
    freezeTableName: true // Model case_type will be the same as the model name
});

// Define relationships
CaseType.hasMany(Report, {as: 'Reports'});

CaseType.sync({force: false}).then(function () {
    // Table created
    console.log('Created table: case_type.')
});