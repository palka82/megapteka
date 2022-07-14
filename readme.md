#REST service (Node + Express + PostgreSQL + Sequelize).

####Сервис запускается через Docker. В рабочем каталоге запустить "docker composer up". После успешного запуска. Сервис доступен по порту 8085.
###Логи выводятся на консоль.

---
Описание табл. "Товары" через Sequelize
```javascript 
    this.tableProducts = this._dbConn.define("product", {
        id: {
            allowNull: false,
            type: Sequelize.DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            comment: "Идентификатор"
        },
        description: {
            allowNull: false,
            type: Sequelize.DataTypes.STRING,
            defaultValue: '',
            comment: 'Описание'
        },
        name: {
            allowNull: false,
            type: Sequelize.DataTypes.STRING,
            defaultValue: '',
            comment: 'Наименование',
        },
        vendor: {
            allowNull: false,
            type: Sequelize.DataTypes.STRING,
            defaultValue: '',
            comment: "Производитель"
        }
    }, {
        timestamps: false
    });
```
Описание табл. "Группы" через Sequelize
```javascript
    this.tableGroups = this._dbConn.define("group", {
        id: {
            allowNull: false,
            type: Sequelize.DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            comment: "Идентификатор"
        },
        name: {
            allowNull: false,
            type: Sequelize.DataTypes.STRING,
            defaultValue: '',
            unique: true,
            validate: {
                notNull: true,
                notEmpty: true
            },
            comment: 'Наименование',
        },
        parentId: {
            allowNull: false,
            type: Sequelize.DataTypes.BIGINT,
            defaultValue: 0,
            comment: "Идентификатор группы родителя"
        }
    }, {
        timestamps: false
    });
```
Описание ассоциаций между "Товарами" и "Группами"

```javascript
    this.tableGroupProduct = this._dbConn.define("group_product", {

    }, {
        timestamps: false
    });
    //Описание связей между таблицами
    this.tableProducts.belongsToMany(this.tableGroups, {through: this.tableGroupProduct, as: "groups"});
    this.tableGroups.belongsToMany(this.tableProducts, {through: this.tableGroupProduct, as: "products"});
```
---


# API

####При успешном выполнении запросов сервис всегда возвращает HTTP Status Code 200. При ошибках используются HTTP Status Code: 500, 404, 400. В зависимости от ошибки
### API для групп
* Добавить группу:<br>
    `POST` http://localhost:8085/groups
<br>
    `Входные параметры`
    ```json
     {
      "name": "", //Наименование группы 
      "parentID": 0 //Идентификатор группы родителя. Может быть 0, тогда группа не будет в подчинении, т.е. будет на самой вершине дерева
     }
  ```
    Запрос
    ```
    curl --location --request POST 'localhost:8085/groups' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "name": "Test2"
    }'
    ```
    Ответ при успешном выполнении. HTTP Status 200
    ```json
    [{"id":"1","name":"Test2","parentId":"0"}]
    ```
    Ответ при ошибке. HTTP Status Code 500
    ```json
    {"error":"Validation error"}
    ```

* Редактирование группы:<br>
    `PUT` http://localhost:8085/groups
<br>
    `Входные параметры`
    ```json
    {
      "id": 1, //Идентификатор изменяемой группы
      "name": "Test5", //Наименование группы
      "parentID": "0" //Идентификатор предка, к какой группе привязана группа
    }   
    ```
    Ответ при успешном выполнении HTTP Status Code 200

    ```json
    {
    "id": "1",
    "name": "Test5"
    }
    ```
  
* Удалние группы:<br>
    `DELETE`  http://localhost:8085/groups/[id]  `[id] - Идентификатор группы`
    <br><br>
    Ответ при успешном выполнении HTTP Status Code 200 `OK`


* Список групп:<br>
    `GET` http://localhost/groups
    <br><br>
    Ответ при успешном выполнении HTTP Status Code 200
  
   ```json
    [{"id":"1","name":"Test5","parentId":"0"}]
   ```
   или
   ```json
   []
   ``` 

* Получение информации по группе:<br>
    `GET` http://localhost/groups/[id]
    `[id] - идентификатор группы`
    <br>    
    Ответ при успешном выполнении HTTP Status Code 200

    ```json
    {
    "id": "1",
    "name": "Test5",
    "parentId": "0"
    }
    ```
    Ответ,если группа не найдена HTTP Status Code 404
    ```json
    {"error":"Group not found!"}
    ```

##API для товаров
* Добавить товар:<br>
  `POST` http://localhost:8085/product
  <br>
  `Входные параметры`
    ```json
     {
      "name": "", //Наименование товара
      "description":  "", //Описание
      "vendor": "", //Производитель
       "groupsID": [] //массив идентификаторов групп, в которых будет находиться товар
     }
  ```
  Запрос
    ```
    curl --location --request POST 'localhost:8085/product' \
    --header 'Content-Type: application/json' \
    --data-raw '{
    "name": "Test4",
    "description": "drugs",
    "vendor": "RU",
    "groupsID": []
    }'
    ```
  Ответ при успешном выполнении. HTTP Status 200
    ```json
    {"id":"1","name":"Test4","description":"drugs","vendor":"RU"}
    ```
  Ответ при ошибке. HTTP Status Code 500
    ```json
    {"error":"Product.Update | Group number [6] not found!"}
    ```

* Список товаров:<br>
  `GET` http://localhost/product
  <br><br>
  Ответ при успешном выполнении HTTP Status Code 200. `groups - массив групп, в которых находится товар`

   ```json
    [
    {
        "id": "3",
        "description": "drugs",
        "name": "Test4",
        "vendor": "RU",
        "groups": [
            {
                "id": "1",
                "name": "Test3",
                "parentId": "0",
                "group_product": {
                    "productId": "3",
                    "groupId": "1"
                }
            }
        ]
    },
    {
        "id": "4",
        "description": "drugs",
        "name": "Test4",
        "vendor": "RU",
        "groups": [
            {
                "id": "1",
                "name": "Test3",
                "parentId": "0",
                "group_product": {
                    "productId": "4",
                    "groupId": "1"
                }
            }
        ]
    },
    {
        "id": "5",
        "description": "drugs",
        "name": "Test4",
        "vendor": "RU",
        "groups": []
    },
    {
        "id": "1",
        "description": "drugs",
        "name": "Test4",
        "vendor": "RU",
        "groups": []
    }
    ]
   ```
   или
   ```json
   []
   ``` 

* Удалние товара:<br>
    `DELETE`  http://localhost:8085/product/[id]  `[id] - Идентификатор товара`
    <br><br>
    Ответ при успешном выполнении HTTP Status Code 200 `OK`
    <br><br>
    Ответ, если товар не найден HTTP Status Code 404
    ```json
    {
      "error": "Product not found!"
    }
    ```
* Редактирование товара:<br>
  `PUT` http://localhost:8085/product
  <br>
  `Входные параметры`
    ```json
    {
      "id": 1, //Идентификатор изменяемого товара
      "name": "Test5", //Наименование Товара
      "description": "", //Описание товара
      "vendor": "", //Производитель
      "groupsID": [] //Массив идентификаторов в которых находится товар
    }   
    ```
  Ответ при успешном выполнении HTTP Status Code 200

    ```json
    {
      "id": "2",
      "description": "drugs",
      "name": "Test10",
      "vendor": "RU",
      "groups": []
    }
    ```
  
  Ответ, если товар не найден HTTP Status Code 404
  ```json
    {
      "error": "Product not found!"
    }
  ``` 

* Получение информации по товару:<br>
  `GET` http://localhost/product/[id]
    `[id] - идентификатор товара`
  <br>    
  Ответ при успешном выполнении HTTP Status Code 200

    ```json
    {
    "id": "1",
    "name": "Test5",
    "description": "drugs",
    "vendor": "RU"
    }
    ```
  Ответ,если товар не найден HTTP Status Code 404
    ```json
    {"error":"Product not found!"}
    ```
