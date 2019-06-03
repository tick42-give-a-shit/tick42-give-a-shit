const attachTabOnClicks = () => {
    const tabAElements = document.getElementsByClassName('tab-a');
    for (const tabAElement of tabAElements) {
        tabAElement.addEventListener('click', ({ target }) => {
            const activeAElement = document.getElementsByClassName('active-a')[0];
            const tabActiveElement = document.getElementsByClassName('tab-active')[0];
            activeAElement.classList.remove('active-a');
            tabActiveElement.classList.remove('tab-active');
            target.classList.add('active-a');
            document.querySelector(`.tab[data-id='${target.getAttribute('data-id')}']`).classList.add('tab-active');
        });
    }
};

const populateRestroomsElement = () => {
    const restroomsElement = document.getElementById('restrooms');

    const restroomsMapping = {
        floors: ['2', '3', '4'],
        genders: ['F', 'M'],
        sides: ['LEFT', 'RIGHT']
    };

    let restroomId = 0;
    for (const floor of restroomsMapping.floors) {
        const floorRow = restroomsElement.insertRow(0);
        const floorRowCell0 = floorRow.insertCell(0);
        floorRowCell0.innerHTML = `<p>Floor ${floor}</p>`;
        for (const gender of restroomsMapping.genders) {
            const genderRow = restroomsElement.insertRow(1);
            const genderRowCell0 = genderRow.insertCell(0);
            genderRowCell0.innerHTML = `<p>${gender}</p>`;
            for (const side of restroomsMapping.sides) {
                const genderRowCell1 = genderRow.insertCell(1);
                genderRowCell1.innerHTML = `<svg id=${floor}${gender}${side} viewBox="0 0 384 512"><path d="M152 64h-48c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V72c0-4.4-3.6-8-8-8zm216-16c8.8 0 16-7.2 16-16V16c0-8.8-7.2-16-16-16H16C7.2 0 0 7.2 0 16v16c0 8.8 7.2 16 16 16h16v156.7C11.8 214.8 0 226.9 0 240c0 61.4 28.9 115.9 73.7 151l-24.3 79.7C43.1 491.2 58.5 512 80 512h224c21.5 0 36.9-20.8 30.6-41.3L310.3 391c44.8-35.1 73.7-89.7 73.7-151 0-13.1-11.8-25.2-32-35.3V48h16zM80 48h224v140.1c-31.5-7.6-70.2-12.1-112-12.1s-80.5 4.5-112 12.1V48zm21.6 416l14.5-47.6c23.3 10 48.9 15.6 75.9 15.6s52.6-5.6 75.9-15.6l14.5 47.6H101.6zm90.4-80c-63.6 0-117.3-41.6-136.3-98.9 34.8 11.7 83 18.9 136.3 18.9s101.5-7.2 136.3-18.9c-19 57.3-72.7 98.9-136.3 98.9zm0-116c-77.1 0-139.6-12.5-139.6-28s62.5-28 139.6-28 139.6 12.5 139.6 28-62.5 28-139.6 28z"></path></svg>`;
            }
        }
    }
};

const setMilkStatus = (status) => {
    const milkStatusElement = document.getElementById('milk-status');
    if (status) {
        milkStatusElement.src = '../assets/milk.png';
    } else {
        milkStatusElement.src = '../assets/no-milk.png';
    }
};

const setRestroomStatus = (id, status) => {
    const restroomElement = document.getElementById(id);
    switch (status) {
        case true:
            restroomElement.style.fill = 'rgba(61, 193, 211, 1.0)';
            break;
        case false:
            restroomElement.style.fill = 'rgba(196, 69, 105,1.0)';
            break;
        default:
            restroomElement.style.fill = 'rgba(89, 98, 117,1.0)';
            break;
    }
};

const orderOnClick = (order) => {
    // TODO
};

const cellValuesToOrder = (cellValues) => ({
    restaurant: cellValues[0],
    platform: cellValues[1],
    name: cellValues[2],
    time: cellValues[3]
});

const populateOrdersElement = (orders) => {
    const ordersElement = document.getElementById('orders');

    for (const { restaurant, platform, name, time } of orders) {
        const orderRow = ordersElement.insertRow(1);
        orderRow.onclick = function () {
            const cellValues = Array.from(this.children).map(cell => cell.innerHTML.replace(/<p>(.*?)<\/p>/, '$1'));
            const order = cellValuesToOrder(cellValues);
            orderOnClick(order);
        };
        const orderRowCell0 = orderRow.insertCell(0);
        orderRowCell0.innerHTML = `<p>${restaurant}</p>`;
        const orderRowCell1 = orderRow.insertCell(1);
        orderRowCell1.innerHTML = `<p>${platform}</p>`;
        const orderRowCell2 = orderRow.insertCell(2);
        orderRowCell2.innerHTML = `<p>${name}</p>`;
        const orderRowCell3 = orderRow.insertCell(3);
        orderRowCell3.innerHTML = `<p>${time}</p>`;
    }
};

const sortTable = (columnId) => {
    var rows, switching, i, x, y, shouldSwitch, dir;
    let switchCount = 0;
    const ordersElement = document.getElementById('orders');
    switching = true;
    dir = 'asc';
    while (switching) {
        switching = false;
        rows = ordersElement.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName('td')[columnId];
            y = rows[i + 1].getElementsByTagName('td')[columnId];
            if (dir === 'asc') {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir === 'desc') {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchCount++;
        } else {
            if (switchCount === 0 && dir === 'asc') {
                dir = 'desc';
                switching = true;
            }
        }
    }
};

const attachOrdersTableHeadersOnClicks = () => {
    const ordersElement = document.getElementById('orders');
    const headerElements = Array.from(ordersElement.rows[0].children);
    for (const [index, headerElement] of headerElements.entries()) {
        headerElement.onclick = () => sortTable(index);
    }
};


const mapContextToRestroomIds = (restroom) => {
    return restroom
};

const getInfoFromBackgoundJs = () => {
    chrome.runtime.getBackgroundPage(updateRestrooms);
};

window.updateRestrooms = (windowObj) => {
    const { restrooms } = windowObj.context;

    Object.keys(restrooms).forEach(restroomId => {
        setRestroomStatus(restroomId, restrooms[restroomId]);
    });
};

const DOMContentLoadedCallback = () => {
    getInfoFromBackgoundJs();
    attachTabOnClicks();
    populateRestroomsElement();
    const mockOrders = [
        {
            restaurant: 'Boom Burgers',
            platform: 'Takeaway',
            name: 'Georgi Georgiev',
            time: '12:30'
        },
        {
            restaurant: 'Cactus',
            platform: 'Foodpanda',
            name: 'Svetozar Mateev',
            time: '13:30'
        }
    ];
    populateOrdersElement(mockOrders);
    attachOrdersTableHeadersOnClicks();
};

document.addEventListener('DOMContentLoaded', DOMContentLoadedCallback, false);
