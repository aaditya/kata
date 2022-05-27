const numerics = require('./numerics.json');

const getNotations = (numArr) => {
    return numArr.map(n => numerics[n]).join('-');
}

const groupNum = (num) => {
    let parts = [];
    let startDiv = 100;

    if (num < 100 && num > 16) {
        const floor = Math.floor(num / 10) * 10;
        if (floor != 0) parts.push(floor);
        if (num - floor != 0) parts.push(num - floor);
    } else if (num <= 16) {
        parts.push(num);
    }

    while (num / startDiv > 1) {
        if (num / startDiv >= startDiv / 10) {
            startDiv *= 10;
        }

        num = num / startDiv;

        if (num > 100) {
            const further = groupNum(num);
            parts = parts.concat(further);
        } else {
            parts.push(num, startDiv);
        }
    }

    if (!parts.length) return parts;

    const subParts = parseInt(parts[0].toString().split('.')[1]);
    parts[0] = Math.floor(parts[0]);
    
    const further = groupNum(subParts);
    parts = parts.concat(further);

    return parts;
}

const cleanGroup = (parts) => {
    parts.forEach((part, index) => {
        if (part === 1 && [100, 1000].includes(parts[index + 1])) {
            parts.splice(index, 1);
        }

        if (part < 100 && part > 16) {
            parts.splice(index, 1);            
            const floor = Math.floor(part / 10) * 10;
            if (part - floor != 0) parts.splice(index, 0, part - floor);;
            if (floor != 0) parts.splice(index, 0, floor);
        }
    });
}

const getFrenchNotation = (num) => {
    const numStr = num.toString();
    if (numerics[numStr]) return numerics[numStr];

    const parts = groupNum(num);
    cleanGroup(parts);    

    let notation = getNotations(parts);

    if (/un$/.test(notation)) {
        notation = notation.replace(/un$/, 'et-un');
    }

    if (/((cent)|(mille))$/.test(notation)) {
        notation += 's';
    }

    return notation;
};

module.exports = getFrenchNotation;
