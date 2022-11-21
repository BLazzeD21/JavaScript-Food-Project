document.addEventListener('DOMContentLoaded', () => { // Структура страницы загружена и готова к взаимодействию

    // *****************************************************************
    // Tabs
    // *****************************************************************

    // Ищем на странице элементы по переданным селекторам и записываем в переменные
    let tabs = document.querySelectorAll('.tabheader__item'), 
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() { // Функция для скрытия неактивных элементов
        tabsContent.forEach(item => { // Cкрытие всех элементов
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => { //Удаление у всех элементов активного класса
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) { // функция для отображения активного элемента по индексу (по дефолту 1 таб)
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent(); // удаление всех табов с экрана
    showTabContent(); // Отображение первого таба

    tabsParent.addEventListener('click', function(event) { // при клике на элемент с кнопками
        const target = event.target; //Получение активного блока в переменную target
        tabs.forEach((item, i) => { // Выполняет указанную функцию один раз для каждого элемента в массиве
            if (target == item) { // Сравнение выбранного значения с блоком таба
                hideTabContent(); // удаление всех табов с экрана
                showTabContent(i); // Отображение выбранного таба по айди
            }
        });
    });
    
    // *****************************************************************
    // Timer
    // *****************************************************************

    const deadline = '2023-12-21'; // Дата конца таймера

    function getTimeRemaining(endtime) { // Функция получения времени 
        const t = Date.parse(endtime) - Date.parse(new Date()), // Получение разницы времени (Сейчас - дедлаин)  
            days = Math.floor( (t/(1000*60*60*24)) ), // Вычисление дней
            seconds = Math.floor( (t/1000) % 60 ), // Вычисление секунд
            minutes = Math.floor( (t/1000/60) % 60 ), // Вычисление минут
            hours = Math.floor( (t/(1000*60*60) % 24) ); // Вычисление часов

        return { // Получение времени
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num){ // Функция добавления нуля к цифрам
        if (num >= 0 && num < 10) { 
            return '0' + num;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) { // Считываем элементы по переданным селекторам и записываем в переменные
        const timer = document.querySelector(selector),
            days = timer.querySelector("#days"), 
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000); // Установка интервала в секунду

        updateClock(); // Обновление таймера

        function updateClock() { // Функция обновления таймера
            const t = getTimeRemaining(endtime); // Конец таймера

            days.innerHTML = getZero(t.days); // Отображение дней в форме
            hours.innerHTML = getZero(t.hours); // Отображение часов в форме
            minutes.innerHTML = getZero(t.minutes); // Отображение минут в форме
            seconds.innerHTML = getZero(t.seconds);  // Отображение секунд в форме

            if (t.total <= 0) { //Окончание таймера
                clearInterval(timeInterval); // Прерывание таймера
                days.innerHTML = 0; // Обнуление значений таймера
                hours.innerHTML = 0;
                minutes.innerHTML = 0;
                seconds.innerHTML = 0;
            }
        }
    }

    setClock('.timer', deadline); // Вызов функции
    
    // *****************************************************************
    // Modal
    // *****************************************************************

    // Записываем модальное окно в переменную
    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    
    modalTrigger.forEach(btn => { // Открытие модального окна по кнопке
        btn.addEventListener('click', openModal);
    });

    function closeModal() { // Закрытие модального окна
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    function openModal() { // Отурытие модального окна
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden'; // отменяет прокрутку когда окно открыто
        clearInterval(modalTimerId); // Остановка таймера
    }

    modal.addEventListener('click', (e) => { // Закрытие модального окна по кнопке modal__close
        if (e.target === modal || e.target.getAttribute('data-close') == "") {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => { // Закрытие модального окна по кнопке modal__close
        if (e.code === "Escape" && modal.classList.contains('show')) { 
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 3000); // Отурытие модального окна через 3 секунды

    function showModalByScroll() { // Функция открытия модального окна при скроле страницы в самый конец 
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll); // удаляем обработчик события чтобы сработал только один раз
        }
    }
    window.addEventListener('scroll', showModalByScroll); // Открытия модального окна при скроле страницы в самый конец 

    // *****************************************************************
    // Используем классы для создание карточек меню
    // *****************************************************************

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector); // родитель в который мы будем создавать карточку
            this.transfer = 27;
            this.changeToUAH(); 
        }

        changeToUAH() { // Конвертация валют
            this.price = this.price * this.transfer; 
        }

        render() { // функция которая будет создавать карточку на странице 
            const element = document.createElement('div');

            if (this.classes.length === 0) {
                this.classes = "menu__item"; // в элемент записываем класс
                element.classList.add(this.classes); // Добавляем класс
            } else {
                this.classes.forEach(className => element.classList.add(className)); // Перебираем массив и добавляем в элементы класс
            }

            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.parent.append(element); // Добавление карточки
        }
        
    }

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнесc"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        "7",
        '.menu .container', // это родительский селектор в котором будет создаваться элемент
        'menu__item', // Добавляем класс в элемент
        'big' 
    ).render(); // Создаем обьект

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        "11",
        '.menu .container',// это родительский селектор в котором будет создаваться элемент
        'menu__item' // Добавляем класс в элемент
    ).render(); // Создаем обьект

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков. ',
        "16",
        '.menu .container',// это родительский селектор в котором будет создаваться элемент
        'menu__item' // Добавляем класс в элемент
    ).render(); // Создаем обьект

    // *****************************************************************
    // Slider
    // *****************************************************************

    let slideIndex = 1; // Слайд по умолчанию 
     // Считываем элементы по переданным селекторам и записываем в переменные
    const slides = document.querySelectorAll('.offer__slide'), // Слайды
        prev = document.querySelector('.offer__slider-prev'), // Стрелка назад
        next = document.querySelector('.offer__slider-next'), // Стрелка назад
        total = document.querySelector('#total'),
        current = document.querySelector('#current');

    showSlides(slideIndex); // Показ слайдов
    

    function showSlides(n) { // Функция показа слайдов
        if (n > slides.length) { slideIndex = 1; }
        if (n < 1) { slideIndex = slides.length; }

        slides.forEach((item) => item.style.display = 'none');
        slides[slideIndex - 1].style.display = 'block';
        
        
        if (slides.length < 10) { // Проверка индекса слайда на правильное отображение числа на форме
            current.textContent =  `0${slideIndex}`;
        } else {
            current.textContent =  slideIndex;
        }
    }

    function plusSlides (n) { // Переключение слайдов
        showSlides(slideIndex += n);
    }

    prev.addEventListener('click', function(){ // Переключение слайдов назад 
        plusSlides(-1);
    });

    next.addEventListener('click', function(){ // Переключение слайдов вперед 
        plusSlides(1);
    });
});