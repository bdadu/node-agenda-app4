var allPersons = [];
var editPersonId;

var API_URL = {
    CREATE: '...',
    READ: '...',
    ADD: 'users/add',
    UPDATE: 'users/update',
    DELETE: 'users/delete'
};
var API_METHOD = {
    //ADD:'GET'
    CREATE: 'POST',
    READ: 'GET',
    ADD: 'POST',
    UPDATE: 'PUT',
    DELETE: 'DELETE'
}
fetch('data/persons.json').then(function (r) {
    return r.json();
}).then(function (persons) {
    console.log('all persons', persons);
    allPersons = persons;
    display(persons);

})
function display(persons) {
    var list = persons.map(function (person) {
        return `<tr data-id="${person.id}">
                <td>${person.firstName}</td>
                <td>${person.lastName}</td>
                <td>${person.phone}</td>
                <td>
                <a href="#" class="delete">&#10006;</a>
                <a href="#" class="edit">&#9998;</a>
            </td>
            </tr>`
    });


    console.log('list', list);
    document.querySelector('#agenda tbody').innerHTML = list.join('');
}

function savePerson() {
    var firstName = document.querySelector('[name=firstName]').value;
    var lastName = document.querySelector('[name=lastName]').value;
    var phone = document.querySelector('[name=phone]').value;
    if (editPersonId) {
        submitEditPerson(editPersonId, firstName, lastName, phone);
    } else {
        submitNewPerson(firstName, lastName, phone);
    }
}

function submitNewPerson(firstName, lastName, phone) {

    var body = null;
    const method = API_METHOD.ADD;
    if (method === 'POST') {
        body = JSON.stringify({
            firstName,
            lastName,
            phone
        });
    }

    fetch(API_URL.ADD, {
        method,
        body,
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (r) {
        return r.json();
    }).then(function (status) {
        if (status.success) {

            inlineAddPerson(status.id, firstName, lastName, phone);
        } else {
            console.warn('not saved', status);
        }
    })
}

function submitEditPerson(id, firstName, lastName, phone) {

    var body = null;
    const method = API_METHOD.UPDATE;
    if (method === 'PUT') {
        body = JSON.stringify({
            id,
            firstName,
            lastName,
            phone
        });
    }

    fetch(API_URL.UPDATE, {
        method,
        body,
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (r) {
        return r.json();
    }).then(function (status) {
        if (status.success) {

            inlineEditPerson(id, firstName, lastName, phone);
        } else {
            console.warn('not saved', status);
        }
    })
}
function inlineAddPerson(id, firstName, lastName, phone) {
    allPersons.push({
        id,
        firstName: firstName,
        lastName: lastName,
        phone: phone
    });

    display(allPersons);
}
function inlineEditPerson(id, firstName, lastName, phone) {
    //window.location.reload();
    const person = allPersons.find((p) => {
        return p.id == id;
    });
    person.firstName = firstName;
    person.lastName = lastName;
    person.phone = phone;

    display(allPersons);

    editPersonId = '';
    document.querySelector('[name=firstName]').value = '';
    document.querySelector('[name=lastName]').value = '';
    document.querySelector('[name=phone]').value = '';
}

function inlineDeletePerson(id) {
    console.warn('please refers', id);
    allPersons = allPersons.filter(function (person) {
        return person.id != id;
    });
    display(allPersons);
}

function deletePerson(id) {
    var body = null;
    if (API_METHOD.DELETE === 'DELETE') {
        body = JSON.stringify({ id });
    }

    console.log('body', body);

    fetch(API_URL.DELETE, {
        method: API_METHOD.DELETE,
        body: body,
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (r) {
        return r.json();
    }).then(function (status) {
        if (status.success) {

            inlineDeletePerson(id);
        } else {
            console.warn('not removed', status);
        }
    })
}

const editPerson = function (id) {
    // const ii o variabila/functie ca si constanta si nu se modifica
    var person = allPersons.find(function (p) {
        return p.id == id
    });
    document.querySelector('[name=firstName]').value = person.firstName;
    document.querySelector('[name=lastName]').value = person.lastName;
    document.querySelector('[name=phone]').value = person.phone;

    editPersonId = id;

}

function initEvents() {
    const tbody = document.querySelector('#agenda tbody');
    tbody.addEventListener('click', function (e) {
        console.warn('click on tbody', e.target);
        if (e.target.className == 'delete') {
            const tr = e.target.parentNode.parentNode;
            const id = tr.getAttribute('data-id');
            console.warn('parent!', e.target.parentNode.parentNode);
            deletePerson(id);
        } else if (e.target.className == 'edit') {
            const tr = e.target.parentNode.parentNode;
            const id = tr.getAttribute('data-id');
            console.warn('edit', id);
            editPerson(id);
        }
    });
}

initEvents();
