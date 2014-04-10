/* global variable --------------------------------*/
var TREE_ROOT = new TreeNode();
	TREE_ROOT.id = '0';

$(function () {
	initGanttTree();
	initTaskDialog();
});

/* task dialog ------------------------------------*/
function initTaskDialog () {
	$('#task_dialog_btn_cancel').click(function (e) {
		hideTaskDialog();
	});
	$('#task_dialog_btn_save').click(function (e) {
		var text = $('#task_dialog_description').val();
		var start_time = $('#task_dialog_start_time').val();
		var duration = $('#task_dialog_duration').val();
		var node = new TreeNode(text, start_time, duration);
		var parent_node_id = $('#parent_tree_node_id').val();
		var parent_node = TREE_ROOT.find(parent_node_id);
		if (parent_node != null) {
			parent_node.add(node);
		}
		repaintTree(TREE_ROOT);
		hideTaskDialog();
	});
	$('#task_dialog_btn_delete').click(function (e) {
		var parent_node_id = $('#parent_tree_node_id').val();
		var parent_node = TREE_ROOT.find(parent_node_id);
		if (parent_node != null) {
			parent_node.remove();
		}
		repaintTree(TREE_ROOT);
		hideTaskDialog();
	});
}
function showTaskDialog (parent_node_id) {
	$('#parent_tree_node_id').val(parent_node_id);
	$('#task_dialog').css('top', (window.innerHeight/2-125)+'px');
	$('#task_dialog').css('left', (window.innerWidth/2-275)+'px');
	$('#task_dialog').show();
}
function showEditTaskDialog (parent_node_id) {
	var parent_node = TREE_ROOT.find(parent_node_id);
	if (parent_node != null) {
		parent_node.remove();
	}
	$('#task_dialog_description').val(parent_node.text);
	$('#task_dialog_start_time').val(parent_node.start_time);
	$('#task_dialog_duration').val(parent_node.duration);
	showTaskDialog(parent_node_id);
}
function hideTaskDialog () {
	$('#parent_tree_node_id').val('');
	$('#task_dialog_description').val('');
	$('#task_dialog_start_time').val('');
	$('#task_dialog_duration').val('');
	$('#task_dialog').hide();	
}

/* gantt tree ---------------------------------------*/
function initGanttTree() {
	var child_1 = new TreeNode('Office itinerancy', 'April 02', 17);
	var child_2 = new TreeNode('Office facing', 'April 02', 8);
	var child_3 = new TreeNode('Interior office', 'April 02', 7);
	var child_4 = new TreeNode('Air conditioners check', 'April 03', 7);
	TREE_ROOT.add(child_1);
	child_1.add(child_2);
	child_2.add(child_3);
	child_2.add(child_4);
	
	repaintTree(TREE_ROOT);
}
function initTreeEvent () {
	$('.gantt_close').click(function (e) {
		var node_id = $(this).parent().parent().attr('task_id');
		var node = TREE_ROOT.find(node_id);
		node.folded = true;
		repaintTree(TREE_ROOT);
	});
	$('.gantt_open').click(function (e) {
		var node_id = $(this).parent().parent().attr('task_id');
		var node = TREE_ROOT.find(node_id);
		node.folded = false;
		repaintTree(TREE_ROOT);
	});
	$('.gantt_tree_add').click(function (e) {
		showTaskDialog($(this).parent().attr('task_id'));
	});
	$('.gantt_tree_row').dblclick(function (e) {
		showEditTaskDialog($(this).attr('task_id'));
	});
}
function repaintTree (tree) {
	$('#ave_gantt .gantt_tree_data').html('');
	drawTree(TREE_ROOT);
	initTreeEvent();
}
function drawTree(node) {
	var sa = node.id.split('-');
	if (sa.length > 1) {
		var rowHtml = ' <div class="gantt_tree_row" task_id="'+node.id+'">';
			rowHtml += '	<div class="gantt_cell gantt_tree_text">';
		for (var i = 0; i < sa.length-2; i++) {
			rowHtml += '		<div class="gantt_tree_indent"></div>';
		}
		if (node.childTreeNodes.length == 0) {
			rowHtml += '		<div class="gantt_tree_icon gantt_blank"></div>';
			rowHtml += '		<div class="gantt_tree_icon gantt_file"></div>';
		} else {
			if (node.folded) {
				rowHtml += '	<div class="gantt_tree_icon gantt_open"></div>';
				rowHtml += '	<div class="gantt_tree_icon gantt_folder_closed"></div>';
			} else {
				rowHtml += '	<div class="gantt_tree_icon gantt_close"></div>';
				rowHtml += '	<div class="gantt_tree_icon gantt_folder_open"></div>';
			}
		}
			rowHtml += '		<div class="gantt_tree_content">'+node.text+'</div>';
			rowHtml += '	</div>';
			rowHtml += '	<div class="gantt_cell gantt_tree_start_time">';
			rowHtml += '		<div class="gantt_tree_content">'+node.start_time+'</div>';
			rowHtml += '	</div>';
			rowHtml += '	<div class="gantt_cell gantt_tree_duration">';
			rowHtml += '		<div class="gantt_tree_content">'+node.duration+'</div>';
			rowHtml += '	</div>';
			rowHtml += '	<div class="gantt_tree_add"></div>';
			rowHtml += '</div>';

		$('#ave_gantt .gantt_tree_data').append(rowHtml);
	}

	if (node.folded) {
		return;
	}
	for (var i = 0; i < node.childTreeNodes.length; i++) {
		drawTree(node.childTreeNodes[i]);
	}
}

/* define TreeNode ----------------------------------*/
function TreeNode (text, start_time, duration) {
	this.id = null;
	this.child_id_generator = 0;
	this.text = text;
	this.start_time = start_time;
	this.duration = duration;
	this.folded = false;
	this.childTreeNodes = [];
	this.parentTreeNode = null;
}
TreeNode.prototype.add = function (node) {
	node.parentTreeNode = this;
	this.childTreeNodes[this.childTreeNodes.length] = node;
	node.id = this.id + '-' + this.child_id_generator;
	this.child_id_generator++;
};
TreeNode.prototype.remove = function () {
	var children = this.parentTreeNode.childTreeNodes;
	var i = children.length - 1;
	for (; i >= 0; i--) {
		if (this.id == children[i].id) {
			break;
		}
	}
	this.parentTreeNode.childTreeNodes.splice(i, 1);
	this.parentTreeNode = null;
};
TreeNode.prototype.print = function () {
	console.log(this.text);
	for (var i = 0; i < this.childTreeNodes.length; i++) {
		this.childTreeNodes[i].print();
	}
};
TreeNode.prototype.find = function (node_id) {
	if (this.id === node_id) {
		return this;
	}
	var tempNode = null;
	for (var i = 0; i < this.childTreeNodes.length; i++) {
		tempNode = this.childTreeNodes[i].find(node_id);
		if (tempNode != null) 
			break;
	}
	return tempNode;
};