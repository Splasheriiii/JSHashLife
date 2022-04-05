# Игра "Жизнь"
 В данной реализации игры "Жизнь" используется "Hashlife" алгоритм, который я также буду освещать в своей курсовой работе.
 <br/>
 Алгоритм во многом не оптимален, используются поля класса TreesCollection как ячейки ассоциативного массива и в качестве "хеширования" происходит преобразование в строку, вместо числа. Данное решение было принято в связи с тем, что так будет проще заниматься отладкой и у меня не стоит цели добиться максимальной производительности.
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
 Контроллер для Universe, связывающий его с интерфейсов страницы.
