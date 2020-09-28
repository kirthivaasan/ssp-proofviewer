function TreeNodeShape() { };

TreeNodeShape.prototype = new mxCylinder();
TreeNodeShape.prototype.constructor = TreeNodeShape;

// Defines the length of the upper edge segment.
TreeNodeShape.prototype.segment = 20;

// Needs access to the cell state for rendering
TreeNodeShape.prototype.apply = function(state)
{
    mxCylinder.prototype.apply.apply(this, arguments);
    this.state = state;
};

TreeNodeShape.prototype.redrawPath = function(path, x, y, w, h, isForeground)
{
    var graph = this.state.view.graph;
    var hasChildren = graph.model.getOutgoingEdges(this.state.cell).length > 0;

    if (isForeground)
    {
	if (hasChildren)
	{
	    // Painting outside of vertex bounds is used here
	    path.moveTo(w / 2, h + this.segment);
	    path.lineTo(w / 2, h);
	    path.end();
	}
    }
    else
    {
	path.moveTo(0, 0);
	path.lineTo(w, 0);
	path.lineTo(w, h);
	path.lineTo(0, h);
	path.close();
    }
};

mxCellRenderer.registerShape('treenode', TreeNodeShape);

// Defines a custom perimeter for the nodes in the tree
mxGraphView.prototype.updateFloatingTerminalPoint = function(edge, start, end, source)
{
    var pt = null;

    if (source)
    {
	pt = new mxPoint(start.x + start.width / 2,
			 start.y + start.height + TreeNodeShape.prototype.segment);
    }
    else
    {
	pt = new mxPoint(start.x + start.width / 2, start.y);
    }

    edge.setAbsoluteTerminalPoint(pt, source);
};
