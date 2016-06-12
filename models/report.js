var Report = sequelize.define('report', {
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

Report.sync({force: false}).then(function () {
    // Table created
    console.log('Created table: report.')
});