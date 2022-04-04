const X_OFFSET = 491;
const Y_OFFSET = 1977;

const COLOR_MAPPINGS = {
    '#BE0039': 1,
    '#FF4500': 2,
    '#FFA800': 3,
    '#FFD635': 4,
    '#00A368': 6,
    '#00CC78': 7,
    '#7EED56': 8,
    '#00756F': 9,
    '#009EAA': 10,
    '#2450A4': 12,
    '#3690EA': 13,
    '#51E9F4': 14,
    '#493AC1': 15,
    '#6A5CFF': 16,
    '#811E9F': 18,
    '#B44AC0': 19,
    '#FF3881': 22,
    '#FF99AA': 23,
    '#6D482F': 24,
    '#9C6926': 25,
    '#000000': 27,
    '#898D90': 29,
    '#D4D7D9': 30,
    '#FFFFFF': 31
};

// reverse COLOR_MAPPINGS so that the number is the key
const COLOR_MAPPINGS_REVERSE = {};
for(const key in COLOR_MAPPINGS) {
    COLOR_MAPPINGS_REVERSE[COLOR_MAPPINGS[key]] = key;
}

// create a 13x16 grid of cells

/** @type {{ x: number, y: number, color: number, priority: number }[]} */
const grid = new Array(14 * 16).fill({}).map(
    (el, i) => ({
        x: i % 14,
        y: Math.floor(i / 14),
        color: 27,
        priority: 0
    })
)
/** @type {HTMLTableElement} */
const gridEl = document.getElementById('grid');

function renderToTable() {
    for(const part of grid) {
        const el = gridEl.rows[part.y].cells[part.x];
        el.style.backgroundColor = COLOR_MAPPINGS_REVERSE[part.color];
        // el.style.border = '1px solid black';
        el.classList.add('pixel');
        el.innerText = part.priority;
    }
}

function initalizeTable() {
    for(let y = 0; y < 16; y++) {
        const row = gridEl.insertRow(y);
        for(let x = 0; x < 14; x++) {
            row.insertCell(x);
        }
    }
}

initalizeTable();
renderToTable();

/** @type {HTMLTableCellElement|null} */
var selectedElement = null;

/** @type {HTMLSelectElement} */
const color = document.getElementById('select-color');
// add all colors to the select with the text being the color
for(const key in COLOR_MAPPINGS) {
    const option = document.createElement('option');
    option.value = COLOR_MAPPINGS[key];
    option.innerText = key;
    option.style.color = key;
    color.appendChild(option);
}

color.addEventListener('change', () => {
    if(selectedElement) {
        console.log('change', color.value)
        // change the element background and set in grid
        selectedElement.style.backgroundColor = COLOR_MAPPINGS_REVERSE[color.value];
        const index = grid.findIndex(el => el.x === selectedElement.cellIndex && el.y === selectedElement.parentElement.rowIndex);
        grid[index].color = color.value;
    }
})

/** @type {HTMLInputElement} */
const prio = document.getElementById('prio');

prio.addEventListener('change', () => {
    if(selectedElement) {
        selectedElement.innerText = prio.value;
        const index = grid.findIndex(el => el.x === selectedElement.cellIndex && el.y === selectedElement.parentElement.rowIndex);
        grid[index].priority = prio.value;
    }
});

document.querySelectorAll('.pixel').forEach(el => {
    el.addEventListener('click', () => {
        if(selectedElement) selectedElement.style.border = '';
        selectedElement = el;
        el.style.border = '3px solid yellow';

        // set selected color to the color of the element
        color.value = COLOR_MAPPINGS[el.style.backgroundColor];
        // set the priority to the inner text of the element
        prio.value = el.innerText;
    });
});

const save = document.getElementById('save');
const output = document.getElementById('output');

save.addEventListener('click', () => {
    const gridCopy = [];
    
    // offset all x and y values by X_OFFSET and Y_OFFSET
    for(const elem of grid) {
        gridCopy.push({
            ...elem,
            x: elem.x + X_OFFSET,
            y: elem.y + Y_OFFSET
        });
    }


    output.innerText = JSON.stringify(gridCopy);
});