var inqu = require('inquirer');

var questions = [
     {
        name: 'favoriteColor',
        message: 'What is your favorite rainbow Color?',
        type: 'list',
        choices: ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet'],
        filter: function (str) {
            console.log(str);
            return str.toLowerCase();
        }
    }
];

inqu.prompt(questions, (answers) => {
    console.log(andswers);
});
