const Sequelize = require('sequelize');
const { mysql } = require('../database/config');

const Course = mysql.define('Courses', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    author: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    topic: {
        type: Sequelize.STRING,
        allowNull: false
    },
    url: {
        type: Sequelize.STRING,
        allowNull: false
    }

});

Course.sync({ force: false }).then((res) => {
    console.log('Course Table Create Succesfully');
}).catch((err) => {
    console.log('Error in creating Table', err);
});

module.exports = Course;

