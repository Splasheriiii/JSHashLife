# Игра "Жизнь"
 В данной реализации игры "Жизнь" используется "Hashlife" алгоритм, который я также буду освещать в своей курсовой работе.
 <br/>
 Алгоритм во многом не оптимален, используются поля класса TreesCollection как ячейки ассоциативного массива и в качестве "хеширования" происходит преобразование в строку, вместо числа. Данное решение было принято в связи с тем, что так будет проще заниматься отладкой и у меня не стоит цели добиться максимальной производительности.
 ## Управление игрой
 В сайдбаре с левой стороны расположены объекты управления "Вселенной" игры:
 * Управление размером поля. Размер поля равен 2^(значение ползунка)х2^(значение ползунка). Изменение в процессе анимации полностью очищает поле, но не приостанавливает анимацию.
 * Управление скоростью. Разница между итерациям вычисления поколений равна 2000ms/(значение ползунка). Изменение в процессе анимации увеличивает/уменьшает скорость.
 * Переключатель режима анимации. Если включен - нельзя устанавливать значения на поле и нельзя запустить вычисление следующих поколений.
 * Кнопка "Старт" - запускает анимацию следующих поколений.
 * Кнопка "Стоп" - останавливает анимацию.
 * Кнопка "Рестарт" - пересоздаёт поле текущего размера.
 <br/>
 Поле подстраивается под размер текущего квадрата, адаптируя размер квадратов, кнопка "Рестарт" возвращает их размер к минимальному.
 <br/>
 На больших полях увеличение скорости не будет заментно. 
 <br/>
 После ввода изменения состояния оно, согласно алгоритму, помещается в центр поля.
 
 ## QuadTree 
 Дерево квадрантов - дерево с 4 ветвями, дерево уровня 0 представляет из себя одну клетку на поле, не имеет ветвей, просто хранит значение true/false.
 <br/>
 В данном классе находится вся логика по получению следующего шага преобразования фигуры.
 ## TreesCollection
 Класс, реализующий хэширование дерева квадрантов, для быстрого получения уже существовавших деревьев. "Хэширование" не является таковым в полной мере, так как результат хэш-функции - строка, а не число. Как уже сказано выше, это было сделано в целях удобства отладки. 
 <br/>
 Результат хэш функции для дерева квадрантов - конкатенация результатов хэш-функций его ветвей.
 ## Universe
 Обёртка над канвасом и корневым деревом квадрантов.
 ## UniverseManager
 Основной js файл, управляющий объектами страницы и связующий их с интерфейсом Universe.
 <br/> 
 Реализация цикла получения нового поколения игры сделана с помощью анимации. 
 <br/>
 Большинство кода написано с использованием jQuery
