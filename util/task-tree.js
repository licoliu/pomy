"use strict";
module.exports = function(e) {
	return Object.keys(e).reduce(function(n, s) {
		return n.nodes.push({
			label: s,
			nodes: e[s].dep
		}), n
	}, {
		nodes: []
	})
};
