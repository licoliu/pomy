/**
 * Created by jxzhuang on 2017/6/13.
 */
var jsdiff = require('diff');

function splitValue(value, flag) {
  if (value[value.length - 1] === '\n') {
    value = value.substring(0, value.length - 1);
  }
  var ary = value.split('\n');
  ary = ary.map(function(item) {
    return flag + item;
  });
  return ary.join('\n');
}

function index(old, newText) {
  var diff = jsdiff.diffLines(old, newText),
    r = {
      conflict: false,
      value: ''
    },
    ele = null,
    separator = null;

  for (var i = 0, len = diff.length; i < len; i++) {
    ele = diff[i];
    separator = "";

    if (ele.removed) {
      ele.value = '\n<<<<<<<<<<<<    server\n' + splitValue(ele.value, '--- ') + '\n============\n';
      r.conflict = true;

      if (i + 1 >= len || !diff[i + 1].added) {
        ele.value += '>>>>>>>>>>>>    local\n';
      }
    }

    if (ele.added) {
      if (i - 1 < 0 || !diff[i - 1].removed) {
        separator += '\n<<<<<<<<<<<<    server\n============\n';
      }

      ele.value = separator + splitValue(ele.value, '+++ ') + '\n>>>>>>>>>>>>    local\n';
      r.conflict = true;
    }

    r.value += ele.value;
  }

  return r;
}
module.exports = index;