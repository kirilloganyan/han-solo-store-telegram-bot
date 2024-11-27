const TelegramApi = require('node-telegram-bot-api')
const {getCurrency} = require("./api");
const token = '7393715479:AAGk1vCiSra6XAK94mzAsPSyl_gxf-W7RVY'

const bot = new TelegramApi(token, {polling: true})

const categoryOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [
                {text: 'Кроссовки ', callback_data: 'sneakers'},
                {text: 'Свитшот ', callback_data: 'sweatshirt'},
                {text: 'Лонгслив ', callback_data: 'longSleeve'},
                {text: 'Футболка ', callback_data: 't-shirt'}
            ]
        ]
    })
}

const userState = {};
let deliveryTax = 0;
let category = '';

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Рассчитать стоимость'},
        {command: '/course', description: 'Узнать стоимость курса'}
    ])
    bot.on('message', async(msg) =>  {
        const text = msg.text;
        const chatId = msg.chat.id;
        const currency = await getCurrency();
        if(text === '/start'){
            userState[chatId] = 'waiting_for_category';
            return bot.sendMessage(chatId,
                'Привет,Я бот Solo Store!\nЯ помогу тебе расчитать стоимость доставки\nВыберите категорию товара',
                categoryOptions);
        }
        if(text === '/course') {
           return bot.sendMessage(chatId, `Курс юаня на сегодня <b>${currency.value.toFixed(2)}</b>🇨🇳`, { parse_mode: 'HTML' })
        }
        if(userState[chatId] === 'waiting_for_category'){
            return bot.sendMessage(chatId, 'Выберите категорию товара для доставки', categoryOptions);
        }
            if(userState[chatId] === 'waiting_for_sum'){
            if(!isNaN(Number(text)))
            return bot.sendMessage(chatId, `Итоговая стоимость товара с учетом комиссии и доставки составила ≈ ${Math.floor(Number(text) * currency.value + deliveryTax)}руб.\nИнформация по заказу:\nКомиссия нашего сервиса: ${500} руб. \nЦена доставки сервиса: ${Math.floor(deliveryTax)} (уже включена в итоговую стоимость)\nАктуальный курс юаня: ${currency.value.toFixed(2)}\nКатегория товара: ${category}`);
            else {
                userState[chatId] = 'waiting_for_sum';
                return bot.sendMessage(chatId,'Постарайся ввести число')
            }
        }
         return bot.sendMessage(chatId, `Неизвестная команда`)
    })

    bot.on('callback_query', async(response) => {
        const data = response.data;
        const msg = response.message;
        const chatId = msg.chat.id;
        switch (userState[chatId]) {
            case 'waiting_for_category':
                switch (data) {
                    case 'sneakers':
                        userState[chatId] = 'waiting_for_sum';
                        deliveryTax=1500;
                        category = 'Кроссовки';
                        return bot.sendMessage(chatId, 'Укажите цену товара в <b>ЮАНЯХ</b> 🇨🇳', {parse_mode: 'HTML'});
                    case 'sweatshirt':
                        userState[chatId] = 'waiting_for_sum';
                        deliveryTax=900;
                        category = 'Свитшот';
                        return bot.sendMessage(chatId, 'Укажите цену товара в <b>ЮАНЯХ</b> 🇨🇳', {parse_mode: 'HTML'});
                    case 'longSleeve':
                        userState[chatId] = 'waiting_for_sum';
                        deliveryTax=700;
                        category = 'Лонгслив';
                        return bot.sendMessage(chatId, 'Укажите цену товара в <b>ЮАНЯХ</b> 🇨🇳', {parse_mode: 'HTML'});
                    case 't-shirt':
                        userState[chatId] = 'waiting_for_sum';
                        deliveryTax=500;
                        category = 'Футболка';
                        return bot.sendMessage(chatId, 'Укажите цену товара в <b>ЮАНЯХ</b> 🇨🇳', {parse_mode: 'HTML'});
                    default:
                        return bot.sendMessage(chatId, 'Неизвестная категория. Попробуйте ещё раз.');
                }
            }
    })
}
start();