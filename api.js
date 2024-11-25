const axios = require('axios');

const url = 'https://www.cbr-xml-daily.ru/daily_json.js';

const gettingCourse = async (cur) => {
    try {
        const response = await axios.get(url);
        const data = response.data;
        const currency = data['Valute'][cur]['Value'];
        return currency;
    } catch (error) {
        console.error('Ошибка при получении данных:', error.message);
        return null;
    }
};

const getCurrency = async () => {
    const CNYCourse = await gettingCourse('CNY');
    return {
        name: 'Курс CNY',
        value: CNYCourse + 0.55,
    };
};

module.exports = { getCurrency };
