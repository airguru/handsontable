import { isEmpty } from './../../helpers/mixed';

/**
 * Converts javascript array into HTMLTable.
 *
 * @param {Array} input Input array which will be converted to HTMLTable
 */
export function arrayToTable(input) {
  const inputLen = input.length;
  const result = ['<table>'];

  const tempElement = document.createElement('div');
  document.documentElement.appendChild(tempElement);

  for (let row = 0; row < inputLen; row += 1) {
    const rowData = input[row];
    const columnsLen = rowData.length;
    const columnsResult = [];

    if (row === 0) {
      result.push('<tbody>');
    }

    for (let column = 0; column < columnsLen; column += 1) {
      tempElement.innerText = `${isEmpty(rowData[column]) ? '' : rowData[column]}`;

      columnsResult.push(`<td>${tempElement.innerHTML}</td>`);
    }

    result.push('<tr>', ...columnsResult, '</tr>');

    if (row + 1 === inputLen) {
      result.push('</tbody>');
    }
  }

  document.documentElement.removeChild(tempElement);

  result.push('</table>');

  return result.join('');
}

/**
 * Helper to verify if DOM element is an HTMLTable element.
 *
 * @param {Element} element Node element to verify if it's an HTMLTable.
 */
function isHTMLTable(element) {
  return (element && element.nodeName || '').toLowerCase() === 'table';
}

/**
 * Converts HTMLTable or string into array.
 *
 * @param {Element|String} element Node element or string, which should contain `<table>...</table>`.
 */
export function tableToArray(element) {
  const result = [];
  let checkElement = element;

  if (typeof checkElement === 'string') {
    const tempElem = document.createElement('div');
    tempElem.innerHTML = checkElement.replace(/\n/g, '');
    checkElement = tempElem.querySelector('table');
  }

  if (checkElement && isHTMLTable(checkElement)) {
    const tempArray = [];

    if (checkElement.rows.length == 0) { return tempArray; }
    let row = checkElement.rows[0];
    
    while (row != null) {
      const newRow = [];
      if (row.cells.length != 0)
      {
        let cell = row.cells[0];
        while (cell != null)
        {
          newRow.push(cell.textContent);
          cell = cell.nextElementSibling;
        }
      }

      tempArray.push(newRow);
      row = row.nextElementSibling;
    }

    result.push(...tempArray);
  }

  return result;
}
