/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


var CommandManager = require('../commandManager'),
    domUtils = require('../domUtils');

/**
 * AddCol
 * Add col to selected table
 * @exports AddCol
 * @augments Command
 * @augments WysiwygCommand
 */
var AddCol = CommandManager.command('wysiwyg', /** @lends AddCol */{
    name: 'AddCol',
    /**
     * 커맨드 핸들러
     * @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor(),
            range = sq.getSelection().cloneRange(),
            $cell;

        sq.focus();

        if (sq.hasFormat('TR')) {
            sq.saveUndoState(range);

            $cell = getCellByRange(range);
            addColToCellAfter($cell);

            focusToNextCell(sq, $cell);
        }
    }
});

function getCellByRange(range) {
    var cell = range.startContainer;

    if (domUtils.getNodeName(cell) === 'TD' || domUtils.getNodeName(cell) === 'TH') {
        cell = $(cell);
    } else {
        cell = $(cell).parentsUntil('tr');
    }

    return cell;
}

function addColToCellAfter($cell) {
    var index = $cell.index();
    var cellToAdd;

    $cell.parents('table').find('tr').each(function(n, tr) {
        if (domUtils.getNodeName(tr.parentNode) === 'TBODY') {
            cellToAdd = $('<td></td>');
        } else {
            cellToAdd = $('<th></th>');
        }
        if (!tui.util.browser.msie) {
            cellToAdd.append($('<br />')[0]);
        }

        $(cellToAdd).insertAfter($(tr).children().eq(index));
    });
}

function focusToNextCell(sq, $cell) {
    var range;

    range = sq.getSelection();
    range.selectNodeContents($cell.next()[0]);
    range.collapse(true);

    sq.setSelection(range);
}

module.exports = AddCol;
