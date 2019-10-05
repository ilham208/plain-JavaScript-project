// storage controller
const StorageCtrl = (function(){
    return {
        storeItem: function(item){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];

                items.push(item);

                localStorage.setItem('items', JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem('items'));

                items.push(item);

                localStorage.setItem('items', JSON.stringify(items));
            }
        },

        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));

            }
            return items;
        },

        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));

        },

        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(id === item.id){
                    items.splice(index, 1);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));
        },

        clearItemsFromStorage: function(){
            localStorage.removeItem('items');
        }
    }
})();

const ItemCtrl = (function(){
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data state
    const data = {
        // items: [
        //     {id: 0, name: 'Steak Dinner', calories: 1200},
        //     {id: 1, name: 'Cookie', calories: 400},
        //     {id: 2, name: 'Eggs', calories: 300}
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentitem: null,
        totalCalories: 0
    }

    // Public methods
    return {
        getItems: function(){
            return data.items;
        },
        addItem: function (name, calories) {
            let ID;
            // create ID
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            calories = parseInt(calories);

            newItem = new Item(ID, name, calories);

            data.items.push(newItem);

            return newItem;
        },

        getItemById: function(id){
            let found = null;

            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            });

            return found;
        },

        updateItem: function(name, calories){
            // change input calories to number
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function(item){
                if(item.id === data.currentitem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });

            return found;
        },

        deleteItem: function(id){
            const ids = data.items.map(function(item){
                return item.id;
            });

            const index = ids.indexOf(id);

            // remove the item 
            data.items.splice(index, 1);
        },

        clearAllItems: function(){
            data.items = [];
        },

        setCurrentItem: function(item){
            data.currentitem = item;
        },

        getCurrentItem: function(){
            return data.currentitem;
        },

        getTotalCalories: function(){
            let total = 0;

            data.items.forEach(function(item) {
                total += item.calories;
            });
 
            data.totalCalories = total;

            return data.totalCalories;
        
        },

        logData: function(){
            return data;
        }
    }
    
})();

const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }

    // Public methods
    return {
        populateItemList: function(items){
            let html = '';
            items.forEach(function(item){
                html += `<li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                </li>`;
            });

            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        
        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },

        addListItem: function(item){
            // show item
            document.querySelector(UISelectors.itemList).style.display = 'block';

            const li = document.createElement('li');

            li.className = "collection-item";

            li.id = `item-${item.id}`;

            li.innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>
            `
            // insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
            
        },

        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // the above gives nodelist, so need to change it to array to use forEach
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');
                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `
                    <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                    `
                }
            })
        },

        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },

        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },

        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },

        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // turn node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(item){
                item.remove();
            });
        },

        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },

        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },

        clesrEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },

        showEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },

        getSelectors: function(){
            return UISelectors;
        }
    }
    
})();

const App = (function(ItemCtrl, StorageCtrl, UICtrl){

    const loadEventListeners = function(){
        const UISelectors = UICtrl.getSelectors();
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // disable submit on enter key
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        });

        // edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        // update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // delete button event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clesrEditState);

        // clear all event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

    }

    const itemAddSubmit = function (e) {
        const input = UICtrl.getItemInput(); 

        if(input.name !== '' && input.calories !== ''){
            
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            UICtrl.addListItem(newItem);

            // get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            UICtrl.showTotalCalories(totalCalories);

            // store in local storage
            StorageCtrl.storeItem(newItem);

            UICtrl.clearInput();
        }

        e.preventDefault();
    }

    // click edit item
    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
            const listId = e.target.parentNode.parentNode.id; 
            
            const listIdArr = listId.split('-');
            
            const id = parseInt(listIdArr[1]);

            const itemToEdit = ItemCtrl.getItemById(id);
            
            // set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            // add item to form
            UICtrl.addItemToForm();
        }

        e.preventDefault();
    }

    // update item submit
    const itemUpdateSubmit = function(e){
        // get item input
        const input = UICtrl.getItemInput();

        // update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        UICtrl.updateListItem(updatedItem);

        const totalCalories = ItemCtrl.getTotalCalories();

        UICtrl.showTotalCalories(totalCalories);

        // update local storage
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clesrEditState();
        
        e.preventDefault();
    }
    
    // delete button event
    const itemDeleteSubmit = function(e){
        const currentItem = ItemCtrl.getCurrentItem();

        ItemCtrl.deleteItem(currentItem.id);

        UICtrl.deleteListItem(currentItem.id);

        const totalCalories = ItemCtrl.getTotalCalories();

        UICtrl.showTotalCalories(totalCalories);

        // delete from local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clesrEditState();

        e.preventDefault();
    }

    // clear all items
    const clearAllItemsClick = function(){
        // delete all items from data
        ItemCtrl.clearAllItems();

        const totalCalories = ItemCtrl.getTotalCalories();

        UICtrl.showTotalCalories(totalCalories);

        UICtrl.removeItems();

        StorageCtrl.clearItemsFromStorage();

        UICtrl.hideList();

    }

    // Public methods
    return {
        init: function(){
            UICtrl.clesrEditState();

            const items = ItemCtrl.getItems();

            if(items.length === 0){
                UICtrl.hideList();
            } else {
                UICtrl.populateItemList(items);
            }

            const totalCalories = ItemCtrl.getTotalCalories();

            UICtrl.showTotalCalories(totalCalories);

            loadEventListeners();
        }
    }
})(ItemCtrl, StorageCtrl, UICtrl);

App.init();
